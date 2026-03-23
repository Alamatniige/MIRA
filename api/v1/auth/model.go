package auth

import (
	"mira-api/v1/user"

	"github.com/golang-jwt/jwt/v5"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	AccessToken string    `json:"access_token"`
	User        user.User `json:"user"`
}

// JWTClaims holds the payload embedded in every issued token.
type JWTClaims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

// ForgotPasswordRequest is the body for POST /forgot-password.
type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

// VerifyOTPRequest is the body for POST /verify-otp.
type VerifyOTPRequest struct {
	Email string `json:"email"`
	OTP   string `json:"otp"`
}

// ResetPasswordRequest is the body for POST /reset-password.
type ResetPasswordRequest struct {
	ResetToken  string `json:"reset_token"`
	NewPassword string `json:"new_password"`
}
