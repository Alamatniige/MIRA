package history

import (
	"encoding/json"
	"mira-api/internal/db"
	"mira-api/middleware"
	"net/http"
)

// GetMyHistoryAll returns both assignments and reported issues for the current user.
func GetMyHistoryAll(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(string)
	if !ok || userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var items []HistoryItem
	err := db.DB.Raw(`
		(SELECT 
			aa.id AS id, 
			aa."assetId" AS asset_id, 
			a."assetName" AS asset_name, 
			CASE 
				WHEN aa."returnedDate" IS NOT NULL THEN 'Returned'
				WHEN aa."rejectedAt" IS NOT NULL THEN 'Rejected'
				WHEN aa."confirmedAt" IS NOT NULL THEN 'Assigned'
				ELSE 'Pending'
			END AS action, 
			'assigned' AS type, 
			aa."assignedDate" AS timestamp, 
			COALESCE(aa.notes, '') AS description
		FROM "assetsAssignment" aa
		JOIN assets a ON a.id = aa."assetId"
		WHERE aa."userId" = ?)
		UNION ALL
		(SELECT 
			ir.id AS id, 
			ir."assetId" AS asset_id, 
			a."assetName" AS asset_name, 
			'Issue Reported' AS action, 
			'reported' AS type, 
			ir."reportAt" AS timestamp, 
			ir.description AS description
		FROM "issueReports" ir
		JOIN assets a ON a.id = ir."assetId"
		WHERE ir."reportedBy" = ?)
		ORDER BY timestamp DESC
	`, userID, userID).Scan(&items).Error

	if err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

// GetMyHistoryAssigned returns only asset assignments for the current user.
func GetMyHistoryAssigned(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(string)
	if !ok || userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var items []HistoryItem
	err := db.DB.Raw(`
		SELECT 
			aa.id AS id, 
			aa."assetId" AS asset_id, 
			a."assetName" AS asset_name, 
			CASE 
				WHEN aa."returnedDate" IS NOT NULL THEN 'Returned'
				WHEN aa."rejectedAt" IS NOT NULL THEN 'Rejected'
				WHEN aa."confirmedAt" IS NOT NULL THEN 'Assigned'
				ELSE 'Pending'
			END AS action, 
			'assigned' AS type, 
			aa."assignedDate" AS timestamp, 
			COALESCE(aa.notes, '') AS description
		FROM "assetsAssignment" aa
		JOIN assets a ON a.id = aa."assetId"
		WHERE aa."userId" = ?
		ORDER BY timestamp DESC
	`, userID).Scan(&items).Error

	if err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

// GetMyHistoryReported returns only issues reported by the current user.
func GetMyHistoryReported(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(string)
	if !ok || userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var items []HistoryItem
	err := db.DB.Raw(`
		SELECT 
			ir.id AS id, 
			ir."assetId" AS asset_id, 
			a."assetName" AS asset_name, 
			'Issue Reported' AS action, 
			'reported' AS type, 
			ir."reportAt" AS timestamp, 
			ir.description AS description
		FROM "issueReports" ir
		JOIN assets a ON a.id = ir."assetId"
		WHERE ir."reportedBy" = ?
		ORDER BY timestamp DESC
	`, userID).Scan(&items).Error

	if err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}
