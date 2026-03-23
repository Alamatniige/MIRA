package auth

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"time"

	"mira-api/internal/activity"
	"mira-api/internal/db"
	"mira-api/v1/user"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
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

	clientType := strings.ToLower(strings.TrimSpace(r.Header.Get("X-Client-Type")))
	if clientType == "mobile" && !strings.EqualFold(targetUser.Role.RoleName, "Staff") {
		http.Error(w, "Access denied. Mobile app is restricted to staff accounts.", http.StatusUnauthorized)
		return
	}

	now := time.Now().UTC()
	if err := activity.TouchUserLastActive(targetUser.ID, now); err != nil {
		http.Error(w, "Failed to update user activity", http.StatusInternalServerError)
		return
	}
	targetUser.LastActive = &now

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

type SetupPasswordRequest struct {
	Email        string `json:"email"`
	TempPassword string `json:"tempPassword"`
	NewPassword  string `json:"newPassword"`
}

// SetupPassword allows a newly invited user to set their password.
func SetupPassword(w http.ResponseWriter, r *http.Request) {
	var req SetupPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// 1. Look up user by email
	var targetUser user.User
	if result := db.DB.Where("email = ?", req.Email).Preload("Role").First(&targetUser); result.Error != nil {
		// Generic message to avoid email enumeration
		http.Error(w, "Invalid email or temporary password", http.StatusUnauthorized)
		return
	}

	// 2. Verify temporary password
	if err := bcrypt.CompareHashAndPassword([]byte(targetUser.Password), []byte(req.TempPassword)); err != nil {
		http.Error(w, "Invalid email or temporary password", http.StatusUnauthorized)
		return
	}

	// 3. Hash the new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error computing new password hash", http.StatusInternalServerError)
		return
	}

	// 4. Update the user with the new password
	if result := db.DB.Model(&targetUser).Update("password", string(hashedPassword)); result.Error != nil {
		http.Error(w, "Error saving new password", http.StatusInternalServerError)
		return
	}

	now := time.Now().UTC()
	if err := activity.TouchUserLastActive(targetUser.ID, now); err != nil {
		http.Error(w, "Password updated, but failed to update user activity", http.StatusInternalServerError)
		return
	}
	targetUser.LastActive = &now

	// 5. Generate a JWT token to log them in automatically (if needed by the frontend)
	tokenStr, err := generateToken(targetUser)
	if err != nil {
		http.Error(w, "Password updated, but failed to generate login token", http.StatusInternalServerError)
		return
	}

	// 6. Return success with user data
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Password setup successful",
		"data": LoginResponse{
			AccessToken: tokenStr,
			User:        targetUser,
		},
	})
}

// PasswordResetOTP is the GORM model for the password_reset_otps table.
type PasswordResetOTP struct {
	ID         string     `gorm:"column:id;primaryKey"`
	UserID     string     `gorm:"column:user_id"`
	OTPHash    string     `gorm:"column:otp_hash"`
	ResetToken *string    `gorm:"column:reset_token"`
	ExpiresAt  time.Time  `gorm:"column:expires_at"`
	Used       bool       `gorm:"column:used"`
	CreatedAt  time.Time  `gorm:"column:created_at"`
}

func (PasswordResetOTP) TableName() string { return "password_reset_otps" }

// generate6DigitOTP returns a zero-padded 6-digit numeric code.
func generate6DigitOTP() string {
	return fmt.Sprintf("%06d", rand.Intn(1_000_000))
}

// ForgotPassword handles POST /forgot-password.
// It always returns 200 OK to prevent email enumeration.
func ForgotPassword(w http.ResponseWriter, r *http.Request) {
	var req ForgotPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	// Look up user — silently succeed even if not found (no enumeration).
	var targetUser user.User
	if result := db.DB.Where("email = ?", strings.TrimSpace(req.Email)).First(&targetUser); result.Error != nil {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "If that email is registered, you will receive a reset code shortly.",
		})
		return
	}

	// Invalidate any previous unused OTPs for this user.
	db.DB.Model(&PasswordResetOTP{}).
		Where("user_id = ? AND used = false", targetUser.ID).
		Update("used", true)

	// Generate and hash OTP.
	otp := generate6DigitOTP()
	hashedOTP, err := bcrypt.GenerateFromPassword([]byte(otp), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to generate reset code", http.StatusInternalServerError)
		return
	}

	record := PasswordResetOTP{
		ID:        uuid.New().String(),
		UserID:    targetUser.ID,
		OTPHash:   string(hashedOTP),
		ExpiresAt: time.Now().UTC().Add(10 * time.Minute),
		Used:      false,
	}
	if result := db.DB.Create(&record); result.Error != nil {
		http.Error(w, "Failed to store reset code", http.StatusInternalServerError)
		return
	}

	// Fire-and-forget: send OTP email via Next.js / SendGrid.
	go func(email, name, code string) {
		payload := map[string]interface{}{
			"email": email,
			"name":  name,
			"otp":   code,
		}
		payloadBytes, _ := json.Marshal(payload)

		nextjsURL := os.Getenv("NEXT_PUBLIC_APP_URL")
		if nextjsURL == "" || nextjsURL == "http://localhost:3000" {
			nextjsURL = "http://127.0.0.1:3000"
		}

		req, err := http.NewRequest("POST", nextjsURL+"/api/emails/reset-password", bytes.NewBuffer(payloadBytes))
		if err != nil {
			fmt.Printf("ForgotPassword: error creating email request: %v\n", err)
			return
		}
		req.Header.Set("Content-Type", "application/json")
		client := &http.Client{Timeout: 10 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			fmt.Printf("ForgotPassword: error sending email request: %v\n", err)
			return
		}
		defer resp.Body.Close()
		fmt.Printf("ForgotPassword: email dispatch status %d for %s\n", resp.StatusCode, email)
	}(targetUser.Email, targetUser.FullName, otp)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "If that email is registered, you will receive a reset code shortly.",
	})
}

// VerifyOTP handles POST /verify-otp.
// On success it returns a short-lived reset_token the client must use to set a new password.
func VerifyOTP(w http.ResponseWriter, r *http.Request) {
	var req VerifyOTPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	email := strings.TrimSpace(req.Email)
	otp := strings.TrimSpace(req.OTP)

	// Find the most-recent non-used, non-expired OTP for this email.
	var record PasswordResetOTP
	result := db.DB.
		Joins("JOIN users ON users.id = password_reset_otps.user_id").
		Where("users.email = ? AND password_reset_otps.used = false AND password_reset_otps.expires_at > ?", email, time.Now().UTC()).
		Order("password_reset_otps.created_at DESC").
		First(&record)

	if result.Error != nil {
		http.Error(w, "Invalid or expired code", http.StatusBadRequest)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(record.OTPHash), []byte(otp)); err != nil {
		http.Error(w, "Invalid or expired code", http.StatusBadRequest)
		return
	}

	// Issue a short-lived reset token.
	resetToken := uuid.New().String()
	newExpiry := time.Now().UTC().Add(15 * time.Minute)

	if result := db.DB.Model(&record).Updates(map[string]interface{}{
		"reset_token": resetToken,
		"expires_at":  newExpiry,
	}); result.Error != nil {
		http.Error(w, "Failed to issue reset token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":     "OTP verified",
		"reset_token": resetToken,
	})
}

// ResetPassword handles POST /reset-password.
func ResetPassword(w http.ResponseWriter, r *http.Request) {
	var req ResetPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	resetToken := strings.TrimSpace(req.ResetToken)
	newPassword := req.NewPassword

	if resetToken == "" || newPassword == "" {
		http.Error(w, "reset_token and new_password are required", http.StatusBadRequest)
		return
	}

	// Find OTP record by reset_token — must be non-used and non-expired.
	var record PasswordResetOTP
	result := db.DB.
		Where("reset_token = ? AND used = false AND expires_at > ?", resetToken, time.Now().UTC()).
		First(&record)
	if result.Error != nil {
		http.Error(w, "Invalid or expired reset token", http.StatusBadRequest)
		return
	}

	// Hash the new password.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash new password", http.StatusInternalServerError)
		return
	}

	// Update user password.
	if result := db.DB.Model(&user.User{}).Where("id = ?", record.UserID).Update("password", string(hashedPassword)); result.Error != nil {
		http.Error(w, "Failed to update password", http.StatusInternalServerError)
		return
	}

	// Mark OTP record as used.
	db.DB.Model(&record).Update("used", true)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Password reset successful. Please log in with your new password.",
	})
}
