package report

import (
	"mira-api/middleware"

	"github.com/gorilla/mux"
)

func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/reports", middleware.AuthMiddleware(GetIssueAndMaintenanceReport)).Methods("GET")
	r.HandleFunc("/reports/assets", middleware.AuthMiddleware(GetAssetInventory)).Methods("GET")
	r.HandleFunc("/reports/assets/usage", middleware.AuthMiddleware(GetAssetUsageReport)).Methods("GET")
}
