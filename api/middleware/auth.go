package middleware

import (
	"context"
	"mira-api/v1/supabase"
	"net/http"
	"strings"
)

func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid Authorization header format", http.StatusUnauthorized)
			return
		}
		token := parts[1]

		ctx := context.Background()
		user, err := supabase.Client.Auth.User(ctx, token)
		if err != nil {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		if user != nil {
			ctx := context.WithValue(r.Context(), "userID", user.ID)
			r = r.WithContext(ctx)
		}

		next(w, r)
	}
}
