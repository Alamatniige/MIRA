package qr

import (
	"mira-api/middleware"
	"net/http"
)

func RegisterRoutes() {
	http.HandleFunc("POST /generate", middleware.AuthMiddleware(GenerateQrCode))
	http.HandleFunc("GET /{id}", middleware.AuthMiddleware(ScanQrCode))
}
