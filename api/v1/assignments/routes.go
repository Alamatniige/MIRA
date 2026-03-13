package assignments

import (
	"mira-api/middleware"

	"github.com/gorilla/mux"
)

func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/assign", middleware.AuthMiddleware(AssignAsset)).Methods("POST")
	r.HandleFunc("/assign", middleware.AuthMiddleware(GetAllAssets)).Methods("GET")
	r.HandleFunc("/assign/{id}/confirm", middleware.AuthMiddleware(ConfirmAssignment)).Methods("PUT")
	r.HandleFunc("/return", middleware.AuthMiddleware(ReturnAsset)).Methods("POST")
}
