package asset

import (
	"mira-api/middleware"
	"net/http"
)

func RegisterRoutes() {
	http.HandleFunc("GET /assets", middleware.AuthMiddleware(GetAssets))
	http.HandleFunc("GET /assets/{id}", middleware.AuthMiddleware(GetAssetDetails))
	http.HandleFunc("POST /assets", middleware.AuthMiddleware(AddAsset))
	http.HandleFunc("PUT /assets/{id}", middleware.AuthMiddleware(UpdateAsset))
	http.HandleFunc("PUT /assets/{id}/status", middleware.AuthMiddleware(UpdateAssetStatus))
	http.HandleFunc("DELETE /assets/{id}", middleware.AuthMiddleware(DeleteAsset))
}
