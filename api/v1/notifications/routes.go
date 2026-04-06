package notifications

import (
	"mira-api/middleware"

	"github.com/gorilla/mux"
)

func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/notifications", middleware.AuthMiddleware(GetNotifications)).Methods("GET")
	r.HandleFunc("/notifications/unread-count", middleware.AuthMiddleware(GetUnreadCount)).Methods("GET")
	r.HandleFunc("/notifications/{id}/read", middleware.AuthMiddleware(MarkRead)).Methods("PATCH")
	r.HandleFunc("/notifications/read-all", middleware.AuthMiddleware(MarkAllRead)).Methods("PATCH")
	r.HandleFunc("/notifications/stream", middleware.AuthMiddleware(SSEStream)).Methods("GET")
}
