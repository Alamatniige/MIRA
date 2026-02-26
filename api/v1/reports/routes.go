package report

import (
	"mira-api/middleware"
	"net/http"
)

func RegisterRoutes() {
	http.HandleFunc("GET /reports", middleware.AuthMiddleware(GetIssueAndMaintenanceReport))
	http.HandleFunc("GET /reports/assets", middleware.AuthMiddleware(GetAssetInventory))
	http.HandleFunc("GET /reports/assets/usage", middleware.AuthMiddleware(GetAssetUsageReport))
}
