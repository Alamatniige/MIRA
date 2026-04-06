package notifications

import (
	"encoding/json"
	"fmt"
	"mira-api/internal/db"
	"mira-api/middleware"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
)

// ---------------------------------------------------------------------------
// SSE hub — fan-out broadcast to all connected clients
// ---------------------------------------------------------------------------

type sseClient chan []byte

var (
	mu      sync.Mutex
	clients = make(map[string]map[sseClient]struct{}) // userID -> set of channels
)

func subscribe(userID string) sseClient {
	ch := make(sseClient, 8)
	mu.Lock()
	if clients[userID] == nil {
		clients[userID] = make(map[sseClient]struct{})
	}
	clients[userID][ch] = struct{}{}
	mu.Unlock()
	return ch
}

func unsubscribe(userID string, ch sseClient) {
	mu.Lock()
	if userClients, ok := clients[userID]; ok {
		delete(userClients, ch)
		if len(userClients) == 0 {
			delete(clients, userID)
		}
	}
	mu.Unlock()
	close(ch)
}

func deliver(recipientID string, data []byte) {
	mu.Lock()
	defer mu.Unlock()
	for ch := range clients[recipientID] {
		select {
		case ch <- data:
		default:
			// drop message if client buffer is full to avoid blocking
		}
	}
}

// Emit creates a notification record in the database and broadcasts it to the specific recipient.
func Emit(recipientID, actorID, assetID string, notifType NotificationType, title, message string) {
	n := Notification{
		RecipientID: recipientID,
		ActorID:     actorID,
		AssetID:     assetID,
		Type:        notifType,
		Title:       title,
		Message:     message,
	}
	if err := db.DB.Create(&n).Error; err != nil {
		fmt.Printf("Failed to create notification: %v\n", err)
		return
	}
	data, _ := json.Marshal(n)
	deliver(recipientID, data)
}

// ---------------------------------------------------------------------------
// HTTP Handlers
// ---------------------------------------------------------------------------

func authenticatedUserIDFromContext(r *http.Request) (string, bool) {
	if userID, ok := r.Context().Value(middleware.UserIDKey).(string); ok && userID != "" {
		return userID, true
	}
	return "", false
}

// GET /notifications
func GetNotifications(w http.ResponseWriter, r *http.Request) {
	userID, ok := authenticatedUserIDFromContext(r)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var notifs []Notification
	if result := db.DB.Where("recipient_id = ?", userID).Order(`"createdAt" DESC`).Find(&notifs); result.Error != nil {
		http.Error(w, "Error fetching notifications: " + result.Error.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notifs)
}

// PATCH /notifications/{id}/read
func MarkRead(w http.ResponseWriter, r *http.Request) {
	userID, ok := authenticatedUserIDFromContext(r)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	id := mux.Vars(r)["id"]
	if result := db.DB.Model(&Notification{}).Where("id = ? AND recipient_id = ?", id, userID).Update("is_read", true); result.Error != nil {
		http.Error(w, "Error updating notification: " + result.Error.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// PATCH /notifications/read-all
func MarkAllRead(w http.ResponseWriter, r *http.Request) {
	userID, ok := authenticatedUserIDFromContext(r)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	if result := db.DB.Model(&Notification{}).Where("recipient_id = ? AND is_read = false", userID).Update("is_read", true); result.Error != nil {
		http.Error(w, "Error updating notifications: " + result.Error.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// GET /notifications/unread-count
func GetUnreadCount(w http.ResponseWriter, r *http.Request) {
	userID, ok := authenticatedUserIDFromContext(r)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var count int64
	if result := db.DB.Model(&Notification{}).Where("recipient_id = ? AND is_read = false", userID).Count(&count); result.Error != nil {
		http.Error(w, "Error fetching unread count: " + result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]int64{"unread_count": count})
}

// GET /notifications/stream — Server-Sent Events endpoint
func SSEStream(w http.ResponseWriter, r *http.Request) {
	userID, ok := authenticatedUserIDFromContext(r)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "SSE not supported by this server", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")

	ch := subscribe(userID)
	defer unsubscribe(userID, ch)

	// Initial heartbeat so the client knows the connection is live
	fmt.Fprintf(w, ": connected\n\n")
	flusher.Flush()

	for {
		select {
		case data, ok := <-ch:
			if !ok {
				return
			}
			fmt.Fprintf(w, "data: %s\n\n", data)
			flusher.Flush()
		case <-r.Context().Done():
			return
		}
	}
}
