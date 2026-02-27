package user

import (
	"encoding/json"
	"net/http"

	"mira-api/internal/db"
	"mira-api/v1/supabase"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"gorm.io/gorm"
)

func GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	var users []User
	if result := db.DB.Limit(1).Find(&users); result.Error != nil {
		http.Error(w, "Error fetching users: "+result.Error.Error(), http.StatusInternalServerError)
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

	ctx := r.Context()
	inviteResp, err := supabase.AdminClient.Auth.InviteUserByEmail(ctx, req.Email)
	if err != nil {
		http.Error(w, "Error inviting user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	newUser := User{
		ID:         inviteResp.ID,
		Email:      req.Email,
		FullName:   req.FullName,
		Department: req.Department,
		RoleID:     req.RoleID,
		Password:   "",
	}

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
	if result := db.DB.Preload("Role").Find(&users); result.Error != nil {
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
