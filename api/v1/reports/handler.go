package report

import (
	"encoding/json"
	"mira-api/internal/db"
	"net/http"
)

// Get Asset Inventory
func GetAssetInventory(w http.ResponseWriter, r *http.Request) {
	var assets []Asset
	if result := db.DB.Find(&assets); result.Error != nil {
		http.Error(w, "Error fetching asset inventory: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(assets)
}

// Get Asset Usage Report
func GetAssetUsageReport(w http.ResponseWriter, r *http.Request) {
	var assets []Asset
	// Fetching only assets that are currently assigned for a usage report
	if result := db.DB.Where(&Asset{IsAssigned: true}).Find(&assets); result.Error != nil {
		http.Error(w, "Error fetching asset usage report: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(assets)
}

// Get Issue and Maintenance Report
func GetIssueAndMaintenanceReport(w http.ResponseWriter, r *http.Request) {
	var reports []Report
	if result := db.DB.Find(&reports); result.Error != nil {
		http.Error(w, "Error fetching issue and maintenance report: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reports)
}
