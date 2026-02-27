package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/joho/godotenv"

	"mira-api/internal/db"
	"mira-api/middleware"
	asset "mira-api/v1/assets"
	"mira-api/v1/assignments"
	"mira-api/v1/auth"
	"mira-api/v1/issues"
	"mira-api/v1/qr"
	report "mira-api/v1/reports"
	"mira-api/v1/supabase"
	"mira-api/v1/user"

	mux "github.com/gorilla/mux"
)

func main() {
	// 1. Load environment variables
	if err := godotenv.Load(".env.local"); err != nil {
		if err := godotenv.Load("../../.env.local"); err != nil {
			log.Println("Warning: Could not find .env.local file. Ensure it exists in 'api/'")
		}
	}

	// 2. Initialize Database (GORM)
	db.Init()

	// 3. Auto Migrate
	err := db.DB.AutoMigrate(
		&user.Role{},
		&user.User{},
		&asset.Asset{},
		&asset.AssetStatusHistory{},
		&assignments.AssetAssignment{},
		&issues.IssueReport{},
		&qr.QrCode{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// 4. Initialize Supabase client (for Auth only)
	supabase.Init()

	r := mux.NewRouter()

	// 5. Register Routes
	auth.RegisterRoutes(r)
	user.RegisterRoutes(r)
	asset.RegisterRoutes(r)
	assignments.RegisterRoutes(r)
	qr.RegisterRoutes(r)
	issues.RegisterRoutes(r)
	report.RegisterRoutes(r)

	// Protected Routes
	r.HandleFunc("/users", middleware.AuthMiddleware(user.GetCurrentUser))

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Welcome to MIRA API!")
	})

	// 6. Start the server
	port := "8080"
	log.Printf("Server starting on port %s...", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal("ListenAndServe error: ", err)
	}
}
