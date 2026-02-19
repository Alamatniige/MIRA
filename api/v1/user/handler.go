package user

import (
	"encoding/json"
	"net/http"

	"mira-api/v1/supabase"
)

func GetUser(w http.ResponseWriter, r *http.Request) {
	// TODO: Get ID from context after AuthMiddleware injects it.
	// For now, let's just return a placeholder or all users (as it was).
	// Ideally: id := r.Context().Value("user_id").(string)

	var users []User
	err := supabase.Client.DB.From("users").Select("*").Limit(1).Execute(&users)
	if err != nil {
		http.Error(w, "Error fetching users: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func AddUser(w http.ResponseWriter, r *http.Request) {
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Error decoding user: "+err.Error(), http.StatusBadRequest)
		return
	}

	err = supabase.Client.DB.From("users").Insert(user).Execute(&user)
	if err != nil {
		http.Error(w, "Error adding user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	var users []User
	err := supabase.Client.DB.From("users").Select("*").Execute(&users)
	if err != nil {
		http.Error(w, "Error fetching users: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func GetUserDetails(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var users []User
	err := supabase.Client.DB.From("users").Select("*").Eq("id", id).Execute(&users)
	if err != nil {
		http.Error(w, "Error fetching user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if len(users) == 0 {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users[0])
}
