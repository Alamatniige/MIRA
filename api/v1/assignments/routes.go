package assignments

import (
	"mira-api/middleware"
	"net/http"
)

func RegisterRoutes() {
	http.HandleFunc("POST /assign", middleware.AuthMiddleware(AssignAsset))
	http.HandleFunc("POST /return", middleware.AuthMiddleware(ReturnAsset))
	http.HandleFunc("GET /all", middleware.AuthMiddleware(GetAllAssets))
}
