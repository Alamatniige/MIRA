package qr

import (
	"mira-api/middleware"
	"net/http"
)

func RegisterRoutes() {
	http.HandleFunc("POST /qr/generate", middleware.AuthMiddleware(GenerateQrCode))
	http.HandleFunc("GET /qr/{id}", middleware.AuthMiddleware(ScanQrCode))
}
