package history

import (
	"mira-api/middleware"

	"github.com/gorilla/mux"
)

func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/history/all", middleware.AuthMiddleware(GetMyHistoryAll)).Methods("GET")
	r.HandleFunc("/history/assigned", middleware.AuthMiddleware(GetMyHistoryAssigned)).Methods("GET")
	r.HandleFunc("/history/reported", middleware.AuthMiddleware(GetMyHistoryReported)).Methods("GET")
}
