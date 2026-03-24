package assignments

import (
	"context"
	"net/http"
	"testing"

	"mira-api/middleware"
)

func TestAuthenticatedUserIDFromContextUsesMiddlewareKey(t *testing.T) {
	req, err := http.NewRequest(http.MethodGet, "/assign/active", nil)
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}

	ctx := context.WithValue(req.Context(), middleware.UserIDKey, "middleware-user")
	req = req.WithContext(ctx)

	userID, ok := authenticatedUserIDFromContext(req)
	if !ok {
		t.Fatal("expected middleware context user ID to be found")
	}

	if userID != "middleware-user" {
		t.Fatalf("expected middleware user ID, got %q", userID)
	}
}

func TestAuthenticatedUserIDFromContextFallsBackToLegacyKey(t *testing.T) {
	req, err := http.NewRequest(http.MethodGet, "/assign/active", nil)
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}

	ctx := context.WithValue(req.Context(), "userID", "legacy-user")
	req = req.WithContext(ctx)

	userID, ok := authenticatedUserIDFromContext(req)
	if !ok {
		t.Fatal("expected legacy context user ID to be found")
	}

	if userID != "legacy-user" {
		t.Fatalf("expected legacy user ID, got %q", userID)
	}
}

func TestAuthenticatedUserIDFromContextRejectsBlankValues(t *testing.T) {
	req, err := http.NewRequest(http.MethodGet, "/assign/active", nil)
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}

	ctx := context.WithValue(req.Context(), middleware.UserIDKey, "   ")
	req = req.WithContext(ctx)

	if userID, ok := authenticatedUserIDFromContext(req); ok || userID != "" {
		t.Fatalf("expected blank user ID to be rejected, got %q", userID)
	}
}