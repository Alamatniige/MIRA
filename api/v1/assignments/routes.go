package assignments

import (
	"mira-api/middleware"

	"github.com/gorilla/mux"
)

func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/assign", middleware.AuthMiddleware(AssignAsset)).Methods("POST")
	r.HandleFunc("/return", middleware.AuthMiddleware(ReturnAsset)).Methods("POST")
	r.HandleFunc("/all", middleware.AuthMiddleware(GetAllAssets)).Methods("GET")
}
