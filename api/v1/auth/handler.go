package auth

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"mira-api/internal/db"
	"mira-api/v1/supabase"
	"mira-api/v1/user"

	supa "github.com/nedpals/supabase-go"
)

func Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	ctx := context.Background()
	userSession, err := supabase.Client.Auth.SignIn(ctx, supa.UserCredentials{
		Email:    req.Email,
		Password: req.Password,
	})
	if err != nil {
		http.Error(w, "Login failed: "+err.Error(), http.StatusUnauthorized)
		return
	}

	var targetUser user.User
	// Use GORM to fetch user profile
	if result := db.DB.Where("id = ?", userSession.User.ID).Preload("Role").First(&targetUser); result.Error != nil {
		http.Error(w, "Error fetching user profile: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	resp := LoginResponse{
		AccessToken: userSession.AccessToken,
		User:        targetUser,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Login successful",
		"data":    resp,
	})

	w.WriteHeader(http.StatusOK)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	token := strings.TrimPrefix(
		r.Header.Get("Authorization"),
		"Bearer ",
	)

	if token == "" {
		http.Error(w, "Missing token", http.StatusUnauthorized)
		return
	}

	err := supabase.Client.Auth.SignOut(ctx, token)
	if err != nil {
		http.Error(w, "Logout failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Logout successful",
	})

	w.WriteHeader(http.StatusOK)
}
