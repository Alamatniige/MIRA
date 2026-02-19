package auth

import "net/http"

func RegisterRoutes() {
	http.HandleFunc("POST /login", Login)
	http.HandleFunc("POST /logout", Logout)
}
