package auth

import (
	"encoding/json"
	"net/http"
	"os"
	"strings"
	"time"

	"mira-api/internal/db"
	"mira-api/v1/user"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// generateToken creates a signed JWT for the given user.
func generateToken(u user.User) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "change-me-in-production-at-least-32-chars"
	}

	claims := JWTClaims{
		UserID: u.ID,
		Email:  u.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			Issuer:    "mira-api",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// 1. Look up user by email in public.users
	var targetUser user.User
	if result := db.DB.Where("email = ?", req.Email).Preload("Role").First(&targetUser); result.Error != nil {
		// Return generic message to avoid email enumeration
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	// 2. Verify password against stored bcrypt hash
	if err := bcrypt.CompareHashAndPassword([]byte(targetUser.Password), []byte(req.Password)); err != nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	// 3. Issue a self-signed JWT
	tokenStr, err := generateToken(targetUser)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Login successful",
		"data": LoginResponse{
			AccessToken: tokenStr,
			User:        targetUser,
		},
	})
}

func Logout(w http.ResponseWriter, r *http.Request) {
	// Tokens are stateless JWTs — logout is handled client-side by discarding the token.
	// For server-side invalidation, implement a token denylist (Redis etc.) in the future.
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		http.Error(w, "Missing token", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Logout successful",
	})
}
