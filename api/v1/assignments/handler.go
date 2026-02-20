package assignments

import (
	"encoding/json"
	"errors"
	"mira-api/internal/db"
	asset "mira-api/v1/assets"
	"net/http"
	"time"

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

	assignment := AssetAssignment{
		AssetID: req.AssetID,
		UserID:  req.UserID,
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

	if req.UserID == "" {
		if id, ok := r.Context().Value("userID").(string); ok {
			req.UserID = id
		}
	}

	if req.AssetID == "" || req.UserID == "" {
		http.Error(w, "AssetID and UserID are required", http.StatusBadRequest)
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
	if err := tx.Where("\"assetId\" = ? AND \"userId\" = ? AND \"returnedDate\" IS NULL", req.AssetID, req.UserID).First(&assignment).Error; err != nil {
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
