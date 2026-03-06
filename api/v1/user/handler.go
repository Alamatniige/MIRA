package user

import (
	"bytes"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"mira-api/internal/db"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"

	"gorm.io/gorm"
)

func GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	var users []User
	// Fetching the first user with their role and asset count
	if result := db.DB.Model(&User{}).
		Select("users.*, (SELECT COUNT(*) FROM \"assetsAssignment\" WHERE \"assetsAssignment\".\"userId\" = users.id AND \"assetsAssignment\".\"returnedDate\" IS NULL) as assetsCount").
		Preload("Role").
		Limit(1).
		Find(&users); result.Error != nil {
		http.Error(w, "Error fetching user: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func AddUser(w http.ResponseWriter, r *http.Request) {
	var req CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Generate a secure random temporary password
	tempPassword, err := generateTempPassword()
	if err != nil {
		http.Error(w, "Error generating temp password", http.StatusInternalServerError)
		return
	}

	// Hash it before storing in the DB
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(tempPassword), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	newUser := User{
		ID:          uuid.New().String(),
		Email:       req.Email,
		FullName:    req.FullName,
		Department:  req.Department,
		RoleID:      req.RoleID,
		Password:    string(hashedPassword),
		PhoneNumber: req.PhoneNumber,
	}

	// Trigger custom email invite via Next.js API asynchronously (pass plaintext password)
	go func(u User, plainPw string) {
		roleName := "Staff" // Default fallback
		if u.RoleID == "1" {
			roleName = "Admin"
		}

		payload := map[string]interface{}{
			"email":        u.Email,
			"name":         u.FullName,
			"role":         roleName,
			"department":   u.Department,
			"tempPassword": plainPw,
		}
		payloadBytes, _ := json.Marshal(payload)

		nextjsURL := os.Getenv("NEXT_PUBLIC_APP_URL")
		if nextjsURL == "" {
			nextjsURL = "http://localhost:3000"
		}

		req, err := http.NewRequest("POST", nextjsURL+"/api/emails/invite", bytes.NewBuffer(payloadBytes))
		if err == nil {
			req.Header.Set("Content-Type", "application/json")
			client := &http.Client{Timeout: 10 * time.Second}
			client.Do(req)
		}
	}(newUser, tempPassword)

	if result := db.DB.Create(&newUser); result.Error != nil {
		http.Error(w, "Error adding user to local DB: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newUser)
}

func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	var users []User
	if result := db.DB.Model(&User{}).
		Select("users.*, (SELECT COUNT(*) FROM \"assetsAssignment\" WHERE \"assetsAssignment\".\"userId\" = users.id AND \"assetsAssignment\".\"returnedDate\" IS NULL) as assetsCount").
		Preload("Role").
		Find(&users); result.Error != nil {
		http.Error(w, "Error fetching users: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func GetUserDetails(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if id == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	if _, err := uuid.Parse(id); err != nil {
		http.Error(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	var user User
	if result := db.DB.Preload("Role").First(&user, "id = ?", id); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching user: "+result.Error.Error(), http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if id == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	if _, err := uuid.Parse(id); err != nil {
		http.Error(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	var user User
	if result := db.DB.First(&user, "id = ?", id); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching user: "+result.Error.Error(), http.StatusInternalServerError)
		}
		return
	}

	if result := db.DB.Delete(&user); result.Error != nil {
		http.Error(w, "Error deleting user: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
func UpdateUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if id == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	var user User
	if result := db.DB.First(&user, "id = ?", id); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching user: "+result.Error.Error(), http.StatusInternalServerError)
		}
		return
	}

	var updateData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Remove fields that shouldn't be updated via this endpoint if any
	delete(updateData, "id")
	delete(updateData, "email")
	delete(updateData, "role") // Roles should be updated via a different mechanism usually

	if result := db.DB.Model(&user).Updates(updateData); result.Error != nil {
		http.Error(w, "Error updating user: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func GetRoles(w http.ResponseWriter, r *http.Request) {
	var roles []Role
	if result := db.DB.Find(&roles); result.Error != nil {
		http.Error(w, "Error fetching roles: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(roles)
}

// generateTempPassword creates a cryptographically random 12-character alphanumeric password.
func generateTempPassword() (string, error) {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, 12)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	for i := range b {
		b[i] = charset[int(b[i])%len(charset)]
	}
	return fmt.Sprintf("%s!", string(b)), nil
}
