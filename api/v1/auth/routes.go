package auth

import (
	"github.com/gorilla/mux"
)

func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/login", Login).Methods("POST")
	r.HandleFunc("/logout", Logout).Methods("POST")
}
