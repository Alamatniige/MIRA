package asset

import (
	"mira-api/middleware"

	"github.com/gorilla/mux"
)

func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/assets", middleware.AuthMiddleware(GetAssets)).Methods("GET")
	r.HandleFunc("/assets/{id}", middleware.AuthMiddleware(GetAssetDetails)).Methods("GET")
	r.HandleFunc("/assets", middleware.AuthMiddleware(AddAsset)).Methods("POST")
	r.HandleFunc("/assets/types", middleware.AuthMiddleware(AddAssetType)).Methods("POST")
	r.HandleFunc("/assets/{id}", middleware.AuthMiddleware(UpdateAsset)).Methods("PUT")
	r.HandleFunc("/assets/{id}/status", middleware.AuthMiddleware(UpdateAssetStatus)).Methods("PUT")
	r.HandleFunc("/assets/{id}", middleware.AuthMiddleware(DeleteAsset)).Methods("DELETE")
}
