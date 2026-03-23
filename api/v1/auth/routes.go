package auth

import (
	"github.com/gorilla/mux"
)

func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/login", Login).Methods("POST")
	r.HandleFunc("/logout", Logout).Methods("POST")
	r.HandleFunc("/setup-password", SetupPassword).Methods("POST")
	r.HandleFunc("/forgot-password", ForgotPassword).Methods("POST")
	r.HandleFunc("/verify-otp", VerifyOTP).Methods("POST")
	r.HandleFunc("/reset-password", ResetPassword).Methods("POST")
}
