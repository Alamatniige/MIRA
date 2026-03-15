package assignments

import (
	"encoding/json"
	"errors"
	"mira-api/internal/db"
	"mira-api/middleware"
	asset "mira-api/v1/assets"
	userv1 "mira-api/v1/user"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

// Assign assets to user
func AssignAsset(w http.ResponseWriter, r *http.Request) {
	var req AssignAssetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.UserID == "" {
		if id, ok := r.Context().Value("userID").(string); ok {
			req.UserID = id
		}
	}

	if req.AssetID == "" || req.UserID == "" {
		http.Error(w, "AssetID and UserID are required", http.StatusBadRequest)
		return
	}

	issuerID, ok := r.Context().Value(middleware.UserIDKey).(string)
	if !ok || issuerID == "" {
		if fallback, fallbackOk := r.Context().Value("userID").(string); fallbackOk && fallback != "" {
			issuerID = fallback
		} else {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
	}

	tx := db.DB.Begin()
	if tx.Error != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	var asset asset.Asset
	if err := tx.First(&asset, "id = ?", req.AssetID).Error; err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "Asset not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	if asset.IsAssigned {
		tx.Rollback()
		http.Error(w, "Asset is not available", http.StatusConflict)
		return
	}

	var issuer userv1.User
	if err := tx.Select("id", `"fullName"`).First(&issuer, "id = ?", issuerID).Error; err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "Issuer not found", http.StatusUnauthorized)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	assignment := AssetAssignment{
		AssetID:              req.AssetID,
		UserID:               req.UserID,
		IssuedByUserID:       &issuerID,
		IssuedByNameSnapshot: issuer.FullName,
		Notes:                req.Notes,
	}

	if err := tx.Create(&assignment).Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to assign asset", http.StatusInternalServerError)
		return
	}

	if err := tx.Model(&asset).Update("isAssigned", true).Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to update asset status", http.StatusInternalServerError)
		return
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(assignment)
}

// Return Assigned asset
func ReturnAsset(w http.ResponseWriter, r *http.Request) {
	var req AssignAssetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userID, ok := r.Context().Value("userID").(string)
	if !ok || userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	if req.AssetID == "" {
		http.Error(w, "AssetID is required", http.StatusBadRequest)
		return
	}

	tx := db.DB.Begin()
	if tx.Error != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	var asset asset.Asset
	if err := tx.First(&asset, "id = ?", req.AssetID).Error; err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "Asset not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	var assignment AssetAssignment
	if err := tx.Where("\"assetId\" = ? AND \"userId\" = ? AND \"returnedDate\" IS NULL", req.AssetID, userID).First(&assignment).Error; err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "Active assignment not found for this user", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	if err := tx.Model(&assignment).Update("returnedDate", time.Now()).Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to update assignment", http.StatusInternalServerError)
		return
	}

	if err := tx.Model(&asset).Update("isAssigned", false).Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to update asset status", http.StatusInternalServerError)
		return
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":      "Asset returned successfully",
		"returnedDate": assignment.ReturnedDate,
		"asset":        asset,
	})
}

// GetMyActiveAssignments returns active (not yet returned) assignments for the authenticated user.
func GetMyActiveAssignments(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("userID").(string)
	if !ok || userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	type row struct {
		ID           string    `gorm:"column:id"`
		AssetID      string    `gorm:"column:assetId"`
		Tag          string    `gorm:"column:tag"`
		AssetName    string    `gorm:"column:assetName"`
		Department   string    `gorm:"column:department"`
		Acknowledged bool      `gorm:"column:acknowledged"`
		Notes        string    `gorm:"column:notes"`
		AssignedDate time.Time `gorm:"column:assignedDate"`
	}

	var rows []row
	err := db.DB.Raw(`
		SELECT
			a.id,
			a."assetId",
			ast.tag,
			ast."assetName",
			u.department,
			a.acknowledged,
			a.notes,
			a."assignedDate"
		FROM "assetsAssignment" a
		JOIN assets ast ON ast.id = a."assetId"
		JOIN users u ON u.id = a."userId"
		WHERE a."userId" = ?
		  AND a."returnedDate" IS NULL
		ORDER BY a."assignedDate" DESC
	`, userID).Scan(&rows).Error

	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	result := make([]AssignmentResponse, 0, len(rows))
	for _, row := range rows {
		status := "PENDING"
		if row.Acknowledged {
			status = "CONFIRMED"
		}

		result = append(result, AssignmentResponse{
			ID:         row.ID,
			AssetID:    row.AssetID,
			AssetTag:   row.Tag,
			AssetName:  row.AssetName,
			Department: row.Department,
			Status:     status,
			Notes:      row.Notes,
			AssignedAt: row.AssignedDate,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(result)
}

// Fetch all assignments enriched with asset and user details
func GetAllAssets(w http.ResponseWriter, r *http.Request) {
	type row struct {
		ID                   string     `gorm:"column:id"`
		AssetID              string     `gorm:"column:assetId"`
		Tag                  string     `gorm:"column:tag"`
		AssetName            string     `gorm:"column:assetName"`
		FullName             string     `gorm:"column:fullName"`
		Department           string     `gorm:"column:department"`
		Acknowledged         bool       `gorm:"column:acknowledged"`
		Notes                string     `gorm:"column:notes"`
		AssignedDate         time.Time  `gorm:"column:assignedDate"`
		ReturnedDate         *time.Time `gorm:"column:returnedDate"`
		IssuedByUserID       *string    `gorm:"column:issuedByUserId"`
		IssuedByNameSnapshot *string    `gorm:"column:issuedByNameSnapshot"`
		IssuerLiveName       *string    `gorm:"column:issuerLiveName"`
	}

	var rows []row
	err := db.DB.Raw(`
		SELECT
			a.id,
			a."assetId",
			ast.tag,
			ast."assetName",
			u."fullName",
			u.department,
			a.acknowledged,
			a.notes,
			a."assignedDate",
			a."returnedDate",
			a."issuedByUserId",
			a."issuedByNameSnapshot",
			iu."fullName" as "issuerLiveName"
		FROM "assetsAssignment" a
		JOIN assets ast ON ast.id = a."assetId"
		JOIN users u ON u.id = a."userId"
		LEFT JOIN users iu ON iu.id = a."issuedByUserId"
		ORDER BY a."assignedDate" DESC
	`).Scan(&rows).Error

	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	result := make([]AssignmentResponse, 0, len(rows))
	for _, r := range rows {
		status := "PENDING"
		if r.ReturnedDate != nil {
			status = "RETURNED"
		} else if r.Acknowledged {
			status = "CONFIRMED"
		}

		issuerName := "Unknown issuer"
		if r.IssuedByNameSnapshot != nil && *r.IssuedByNameSnapshot != "" {
			issuerName = *r.IssuedByNameSnapshot
		} else if r.IssuerLiveName != nil && *r.IssuerLiveName != "" {
			issuerName = *r.IssuerLiveName
		}

		result = append(result, AssignmentResponse{
			ID:             r.ID,
			AssetID:        r.AssetID,
			AssetTag:       r.Tag,
			AssetName:      r.AssetName,
			Assignee:       r.FullName,
			IssuedByUserID: r.IssuedByUserID,
			IssuerName:     issuerName,
			Department:     r.Department,
			Status:         status,
			Notes:          r.Notes,
			AssignedAt:     r.AssignedDate,
			ReturnedAt:     r.ReturnedDate,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(result)
}

// ConfirmAssignment sets acknowledged = true for a given assignment
func ConfirmAssignment(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	if id == "" {
		http.Error(w, "Missing assignment ID", http.StatusBadRequest)
		return
	}

	var assignment AssetAssignment
	if err := db.DB.First(&assignment, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "Assignment not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	if err := db.DB.Model(&assignment).Update("acknowledged", true).Error; err != nil {
		http.Error(w, "Failed to confirm assignment", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Assignment confirmed"})
}
