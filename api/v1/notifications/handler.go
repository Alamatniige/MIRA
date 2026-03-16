package notifications

import (
	"encoding/json"
	"fmt"
	"mira-api/internal/db"
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
	clients = make(map[sseClient]struct{})
)

func subscribe() sseClient {
	ch := make(sseClient, 8)
	mu.Lock()
	clients[ch] = struct{}{}
	mu.Unlock()
	return ch
}

func unsubscribe(ch sseClient) {
	mu.Lock()
	delete(clients, ch)
	mu.Unlock()
	close(ch)
}

func broadcast(data []byte) {
	mu.Lock()
	defer mu.Unlock()
	for ch := range clients {
		select {
		case ch <- data:
		default:
			// drop message if client buffer is full to avoid blocking
		}
	}
}

// ---------------------------------------------------------------------------
// Emit — save notification to DB and push to all SSE clients
// ---------------------------------------------------------------------------

// Emit creates a notification record in the database and broadcasts it to all
// connected SSE clients. performedBy is the full name of the actor who triggered
// the event. Call this from any package after a relevant event.
func Emit(notifType NotificationType, title, description, performedBy string) {
	n := Notification{
		Type:        notifType,
		Title:       title,
		Description: description,
		PerformedBy: performedBy,
	}
	db.DB.Create(&n)
	data, _ := json.Marshal(n)
	broadcast(data)
}

// ---------------------------------------------------------------------------
// HTTP Handlers
// ---------------------------------------------------------------------------

// GET /notifications
func GetNotifications(w http.ResponseWriter, r *http.Request) {
	var notifs []Notification
	if result := db.DB.Order(`"createdAt" DESC`).Find(&notifs); result.Error != nil {
		http.Error(w, "Error fetching notifications: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notifs)
}

// PUT /notifications/{id}/read
func MarkRead(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	if result := db.DB.Model(&Notification{}).Where("id = ?", id).Update("read", true); result.Error != nil {
		http.Error(w, "Error updating notification: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// PUT /notifications/read-all
func MarkAllRead(w http.ResponseWriter, r *http.Request) {
	if result := db.DB.Model(&Notification{}).Where("read = false").Update("read", true); result.Error != nil {
		http.Error(w, "Error updating notifications: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// GET /notifications/stream — Server-Sent Events endpoint
func SSEStream(w http.ResponseWriter, r *http.Request) {
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "SSE not supported by this server", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")

	ch := subscribe()
	defer unsubscribe(ch)

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
