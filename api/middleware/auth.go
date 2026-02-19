package middleware

import (
	"context"
	"mira-api/v1/supabase"
	"net/http"
	"strings"
)

// AuthMiddleware validates the Authorization header bearer token
func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 1. Get the token from the header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
			return
		}

		// Expect "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid Authorization header format", http.StatusUnauthorized)
			return
		}
		token := parts[1]

		// 2. Validate token with Supabase
		ctx := context.Background()
		user, err := supabase.Client.Auth.User(ctx, token)
		if err != nil {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		// 3. (Optional) Inject user into request context
		// For now, we just pass control to the next handler
		// r = r.WithContext(context.WithValue(r.Context(), "user", user))

		// If validation succeeds, call the next handler
		_ = user
		next(w, r)
	}
}
