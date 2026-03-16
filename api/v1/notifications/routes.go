package notifications

import (
	"mira-api/middleware"

	"github.com/gorilla/mux"
)

func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/notifications", middleware.AuthMiddleware(GetNotifications)).Methods("GET")
	// read-all must be registered before {id}/read so the static path wins
	r.HandleFunc("/notifications/read-all", middleware.AuthMiddleware(MarkAllRead)).Methods("PUT")
	r.HandleFunc("/notifications/{id}/read", middleware.AuthMiddleware(MarkRead)).Methods("PUT")
	r.HandleFunc("/notifications/stream", middleware.AuthMiddleware(SSEStream)).Methods("GET")
}
