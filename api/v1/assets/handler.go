package asset

import (
	"encoding/json"
	"net/http"

	"mira-api/internal/db"

	"gorm.io/gorm"
)

// Fetch all registered assets
func GetAssets(w http.ResponseWriter, r *http.Request) {
	var assets []Asset
	if result := db.DB.Find(&assets); result.Error != nil {
		http.Error(w, "Error fetching assets: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(assets)
}

// Fetch asset details
func GetAssetDetails(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var asset Asset

	if result := db.DB.First(&asset, "id = ?", id); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Asset not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching asset details: "+result.Error.Error(), http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(asset)
}

// Add asset
func AddAsset(w http.ResponseWriter, r *http.Request) {
	var req CreateAssetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	newAsset := Asset{
		AssetName:     req.AssetName,
		AssetType:     req.AssetType,
		SerialNumber:  req.SerialNumber,
		Specification: req.Specification,
		Location:      req.Location,
		CurrentStatus: req.CurrentStatus,
	}

	if result := db.DB.Create(&newAsset); result.Error != nil {
		http.Error(w, "Error adding asset: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newAsset)
}

// Update asset
func UpdateAsset(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var asset Asset

	if result := db.DB.First(&asset, "id = ?", id); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Asset not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching asset details: "+result.Error.Error(), http.StatusInternalServerError)
		}
		return
	}

	var req CreateAssetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	asset.AssetName = req.AssetName
	asset.AssetType = req.AssetType
	asset.SerialNumber = req.SerialNumber
	asset.Specification = req.Specification
	asset.Location = req.Location

	if result := db.DB.Save(&asset); result.Error != nil {
		http.Error(w, "Error updating asset: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(asset)
}

// Update status
func UpdateAssetStatus(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var asset Asset

	if result := db.DB.First(&asset, "id = ?", id); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Asset not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching asset details: "+result.Error.Error(), http.StatusInternalServerError)
		}
		return
	}

	var req UpdateStatus
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if result := db.DB.Model(&asset).Update("currentStatus", req.CurrentStatus); result.Error != nil {
		http.Error(w, "Error updating asset status: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(asset)

}

// Delete status
func DeleteAsset(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var asset Asset

	if result := db.DB.First(&asset, "id = ?", id); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Asset not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching asset details: "+result.Error.Error(), http.StatusInternalServerError)
		}
		return
	}

	if result := db.DB.Delete(&asset); result.Error != nil {
		http.Error(w, "Error deleting asset: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(asset)
}
