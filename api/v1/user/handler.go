package user

import (
	"bytes"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"mira-api/internal/db"
	"mira-api/middleware"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"

	"gorm.io/gorm"
)

const userWithAssetsCountSelect = "users.*, (SELECT COUNT(*) FROM \"assetsAssignment\" WHERE \"assetsAssignment\".\"userId\" = users.id AND \"assetsAssignment\".\"returnedDate\" IS NULL) as assetsCount"

const avatarStorageBucket = "avatar"

const legacyAvatarStorageBucket = "avatars"

func GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(string)
	if !ok || userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var user User
	result := db.DB.Model(&User{}).
		Select(userWithAssetsCountSelect).
		Preload("Role").
		Where("id = ?", userID).
		First(&user)
	if result.Error != nil {
		http.Error(w, "Error fetching user: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
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
		if err != nil {
			fmt.Printf("Error creating request for email invite: %v\n", err)
			return
		}

		req.Header.Set("Content-Type", "application/json")
		client := &http.Client{Timeout: 10 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			fmt.Printf("Error sending email invite request to Next.js: %v\n", err)
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			fmt.Printf("Received non-OK status %d from Next.js email invite endpoint\n", resp.StatusCode)
		} else {
			fmt.Printf("Successfully triggered email invite via Next.js api\n")
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
		Select(userWithAssetsCountSelect).
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
	if result := db.DB.Model(&User{}).
		Select(userWithAssetsCountSelect).
		Preload("Role").
		First(&user, "id = ?", id); result.Error != nil {
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

func avatarStorageObjectPath(publicURL string) (string, error) {
	parsedURL, err := url.Parse(publicURL)
	if err != nil {
		return "", err
	}

	publicPrefixes := []string{
		fmt.Sprintf("/storage/v1/object/public/%s/", avatarStorageBucket),
		fmt.Sprintf("/storage/v1/object/public/%s/", legacyAvatarStorageBucket),
	}

	for _, publicPrefix := range publicPrefixes {
		if !strings.HasPrefix(parsedURL.Path, publicPrefix) {
			continue
		}

		objectPath := strings.TrimPrefix(parsedURL.Path, publicPrefix)
		if objectPath == "" {
			return "", fmt.Errorf("avatar image URL does not contain an object path")
		}

		return objectPath, nil
	}

	return "", fmt.Errorf("unexpected avatar image URL path: %s", parsedURL.Path)
}

func escapeStorageObjectPath(objectPath string) string {
	parts := strings.Split(objectPath, "/")
	for index, part := range parts {
		parts[index] = url.PathEscape(part)
	}

	return strings.Join(parts, "/")
}

func deleteAvatarStorageObject(publicURL string) error {
	if strings.TrimSpace(publicURL) == "" {
		return nil
	}

	objectPath, err := avatarStorageObjectPath(publicURL)
	if err != nil {
		return err
	}

	supabaseURL := strings.TrimRight(os.Getenv("SUPABASE_URL"), "/")
	serviceRoleKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")
	if supabaseURL == "" || serviceRoleKey == "" {
		return fmt.Errorf("supabase storage cleanup is unavailable because SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured")
	}

	deleteURL := fmt.Sprintf("%s/storage/v1/object/%s/%s", supabaseURL, avatarStorageBucket, escapeStorageObjectPath(objectPath))
	request, err := http.NewRequest(http.MethodDelete, deleteURL, nil)
	if err != nil {
		return err
	}

	request.Header.Set("Authorization", "Bearer "+serviceRoleKey)
	request.Header.Set("apikey", serviceRoleKey)

	response, err := (&http.Client{}).Do(request)
	if err != nil {
		return err
	}

	responseBody, _ := io.ReadAll(response.Body)
	response.Body.Close()

	if response.StatusCode == http.StatusNotFound {
		return nil
	}

	if response.StatusCode < http.StatusOK || response.StatusCode >= http.StatusMultipleChoices {
		return fmt.Errorf("failed to delete avatar image %q from storage: %s", objectPath, strings.TrimSpace(string(responseBody)))
	}

	return nil
}

// Upload profile image
func UploadProfileImage(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(string)
	if !ok || userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Parse multipart form (max 10MB)
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Failed to parse form: "+err.Error(), http.StatusBadRequest)
		return
	}

	var existingUser User
	if err := db.DB.Select("avatarUrl").First(&existingUser, "id = ?", userID).Error; err != nil {
		http.Error(w, "Error fetching current avatar: "+err.Error(), http.StatusInternalServerError)
		return
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "No image found in request: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "Error reading file: "+err.Error(), http.StatusInternalServerError)
		return
	}

	supabaseURL := strings.TrimRight(os.Getenv("SUPABASE_URL"), "/")
	serviceRoleKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")
	if supabaseURL == "" || serviceRoleKey == "" {
		http.Error(w, "Storage is not configured", http.StatusInternalServerError)
		return
	}

	// Generate filename
	ext := filepath.Ext(header.Filename)
	if ext == "" {
		ext = ".jpg"
	}
	filename := uuid.New().String() + ext
	contentType := http.DetectContentType(fileBytes)

	objectPath := fmt.Sprintf("%s/%s", userID, filename)
	uploadURL := fmt.Sprintf("%s/storage/v1/object/%s/%s", supabaseURL, avatarStorageBucket, objectPath)
	req, err := http.NewRequest(http.MethodPost, uploadURL, bytes.NewReader(fileBytes))
	if err != nil {
		http.Error(w, "Error creating upload request: "+err.Error(), http.StatusInternalServerError)
		return
	}
	req.Header.Set("Authorization", "Bearer "+serviceRoleKey)
	req.Header.Set("apikey", serviceRoleKey)
	req.Header.Set("Content-Type", contentType)

	httpClient := &http.Client{}
	resp, err := httpClient.Do(req)
	if err != nil {
		http.Error(w, "Error uploading file: "+err.Error(), http.StatusInternalServerError)
		return
	}
	respBody, _ := io.ReadAll(resp.Body)
	resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		http.Error(w, "Failed to upload image: "+string(respBody), http.StatusInternalServerError)
		return
	}

	publicURL := fmt.Sprintf("%s/storage/v1/object/public/%s/%s", supabaseURL, avatarStorageBucket, objectPath)

	// Update User in DB
	if err := db.DB.Model(&User{}).Where("id = ?", userID).Update("avatarUrl", publicURL).Error; err != nil {
		http.Error(w, "Error saving avatar URL to database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if existingUser.AvatarUrl != nil && strings.TrimSpace(*existingUser.AvatarUrl) != "" {
		if err := deleteAvatarStorageObject(*existingUser.AvatarUrl); err != nil {
			log.Printf("failed to delete previous avatar for user %s: %v", userID, err)
		}
	}

	json.NewEncoder(w).Encode(map[string]interface{}{"avatarUrl": publicURL})
}

// CreateRole adds a new role
func CreateRole(w http.ResponseWriter, r *http.Request) {
	var req Role
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Postgres 'id' is a sequence (int). ID string="" causes SQLSTATE 22P02. Omit it.
	if result := db.DB.Omit("ID").Create(&req); result.Error != nil {
		http.Error(w, "Error creating role: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(req)
}

// UpdateRole updates an existing role
func UpdateRole(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if id == "" {
		http.Error(w, "Role ID is required", http.StatusBadRequest)
		return
	}

	var role Role
	if result := db.DB.First(&role, "id = ?", id); result.Error != nil {
		http.Error(w, "Role not found", http.StatusNotFound)
		return
	}

	var req Role
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	role.RoleName = req.RoleName
	role.PermittedPages = req.PermittedPages

	if result := db.DB.Save(&role); result.Error != nil {
		http.Error(w, "Error updating role: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(role)
}

// DeleteRole deletes an existing role
func DeleteRole(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if id == "" {
		http.Error(w, "Role ID is required", http.StatusBadRequest)
		return
	}

	// Check if role is used by any user
	var userCount int64
	db.DB.Model(&User{}).Where("roleId = ?", id).Count(&userCount)
	if userCount > 0 {
		http.Error(w, "Cannot delete role because it is currently assigned to users", http.StatusConflict)
		return
	}

	var role Role
	if result := db.DB.First(&role, "id = ?", id); result.Error != nil {
		http.Error(w, "Role not found", http.StatusNotFound)
		return
	}

	if result := db.DB.Delete(&role); result.Error != nil {
		http.Error(w, "Error deleting role: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
