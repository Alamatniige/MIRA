package auth

import "mira-api/v1/user"

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	AccessToken string    `json:"access_token"`
	User        user.User `json:"user"`
}
