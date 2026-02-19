package main

import (
	"fmt"
	"log"
	"mira-api/middleware"
	"mira-api/v1/auth"
	"mira-api/v1/supabase"
	"mira-api/v1/user"
	"net/http"

	"github.com/joho/godotenv"
)

func main() {
	// 1. Load environment variables
	// Try loading from root, then fall back to relative path if running from subdir
	if err := godotenv.Load(".env.local"); err != nil {
		if err := godotenv.Load("../../.env.local"); err != nil {
			log.Println("Warning: Could not find .env.local file. Ensure it exists in 'api/'")
		}
	}

	// 2. Initialize Supabase client
	supabase.Init()

	// 3. Register Routes
	auth.RegisterRoutes()
	user.RegisterRoutes()

	// Protected Routes
	http.HandleFunc("/users", middleware.AuthMiddleware(user.GetUser))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Welcome to MIRA API!")
	})

	// 4. Start the server
	port := "8080"
	log.Printf("Server starting on port %s...", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal("ListenAndServe error: ", err)
	}
}
