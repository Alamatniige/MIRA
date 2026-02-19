package user

import (
	"mira-api/middleware"
	"net/http"
)

func RegisterRoutes() {
	http.HandleFunc("GET /users/me", middleware.AuthMiddleware(GetUser))
	http.HandleFunc("GET /users", middleware.AuthMiddleware(GetAllUsers))
	http.HandleFunc("GET /users/{id}", middleware.AuthMiddleware(GetUserDetails))
	http.HandleFunc("PUT /users/{id}", middleware.AuthMiddleware(AddUser))
}
