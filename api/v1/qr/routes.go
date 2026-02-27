package qr

import (
	"mira-api/middleware"

	"github.com/gorilla/mux"
)

func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/qr/generate", middleware.AuthMiddleware(GenerateQrCode)).Methods("POST")
	r.HandleFunc("/qr/scan", middleware.AuthMiddleware(ScanQrCode)).Methods("POST")
}
