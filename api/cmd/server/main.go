package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

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
	env := os.Getenv("APP_ENV")
	envFile := ".env.local"
	if env == "production" {
		envFile = ".env.production"
	}

	if err := godotenv.Load(envFile); err != nil {
		if err := godotenv.Load("../../" + envFile); err != nil {
			log.Printf("Warning: Could not find %s file. Ensure it exists in 'api/'\n", envFile)
		}
	} else {
		log.Printf("Loaded environment variables from %s\n", envFile)
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

	// 4. Initialize Supabase client (for storage / non-auth features)
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

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Welcome to MIRA API!")
	})

	// 6. Start the server
	port := "8080"
	log.Printf("Server starting on port %s...", port)
	// Apply CORS middleware
	handler := middleware.CORSMiddleware(r)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatal("ListenAndServe error: ", err)
	}
}
