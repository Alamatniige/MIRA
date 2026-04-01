package dashboard

import (
	"mira-api/middleware"

	"github.com/gorilla/mux"
)

func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/dashboard/stats", middleware.AuthMiddleware(GetDashboardStats)).Methods("GET")
	r.HandleFunc("/dashboard/rooms", middleware.AuthMiddleware(GetDashboardRooms)).Methods("GET")
	r.HandleFunc("/dashboard/activity", middleware.AuthMiddleware(GetDashboardActivity)).Methods("GET")
}
