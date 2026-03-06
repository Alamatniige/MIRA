package user

import (
	"mira-api/middleware"

	"github.com/gorilla/mux"
)

func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/users/me", middleware.AuthMiddleware(GetCurrentUser)).Methods("GET")
	r.HandleFunc("/users", middleware.AuthMiddleware(GetAllUsers)).Methods("GET")
	r.HandleFunc("/users/{id}", middleware.AuthMiddleware(GetUserDetails)).Methods("GET")
	r.HandleFunc("/users", middleware.AuthMiddleware(AddUser)).Methods("POST")
	r.HandleFunc("/users/{id}", middleware.AuthMiddleware(UpdateUser)).Methods("PUT")
	r.HandleFunc("/users/{id}", middleware.AuthMiddleware(DeleteUser)).Methods("DELETE")
	r.HandleFunc("/roles", middleware.AuthMiddleware(GetRoles)).Methods("GET")
}
