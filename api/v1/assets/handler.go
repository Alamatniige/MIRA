package asset

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"

	"mira-api/internal/db"
	"mira-api/v1/qr"

	"github.com/gorilla/mux"
	"github.com/skip2/go-qrcode"
	"gorm.io/gorm"
)

// Fetch all registered assets
func GetAssets(w http.ResponseWriter, r *http.Request) {
	var assets []Asset
	if result := db.DB.Preload("AssetTypeRel").Find(&assets); result.Error != nil {
		http.Error(w, "Error fetching assets: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(assets)
}

// Fetch asset details
func GetAssetDetails(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	var asset Asset

	if result := db.DB.Preload("AssetTypeRel").First(&asset, "id = ?", id); result.Error != nil {
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

	// Save the new asset to generate UUID
	if result := db.DB.Create(&newAsset); result.Error != nil {
		http.Error(w, "Error adding asset: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	// Generate QR Code containing the Asset ID
	qrContent := fmt.Sprintf("mira-asset:%s", newAsset.ID)
	png, err := qrcode.Encode(qrContent, qrcode.Medium, 256)
	var generatedQr qr.QrCode
	if err == nil {
		base64QR := base64.StdEncoding.EncodeToString(png)
		generatedQr = qr.QrCode{
			AssetID: newAsset.ID,
			QrValue: base64QR,
		}
		db.DB.Create(&generatedQr)
	}

	w.WriteHeader(http.StatusCreated)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"asset":  newAsset,
		"qrCode": generatedQr,
	})
}

// Add asset type
func AddAssetType(w http.ResponseWriter, r *http.Request) {
	var req CreateAssetTypeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	newAssetType := AssetType{
		Name: req.Name,
	}

	if result := db.DB.Create(&newAssetType); result.Error != nil {
		http.Error(w, "Error adding asset type: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newAssetType)
}

// Update asset
func UpdateAsset(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
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
	vars := mux.Vars(r)
	id := vars["id"]
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
	vars := mux.Vars(r)
	id := vars["id"]
	var asset Asset

	if result := db.DB.First(&asset, "id = ?", id); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Asset not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching asset details: "+result.Error.Error(), http.StatusInternalServerError)
		}
		return
	}

	// Clean up foreign key references across tables before deleting the asset
	if err := db.DB.Exec("DELETE FROM \"assetsAssignment\" WHERE \"assetId\" = ?", id).Error; err != nil {
		http.Error(w, "Error deleting asset assignments: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if err := db.DB.Exec("DELETE FROM \"qrCodes\" WHERE \"assetId\" = ?", id).Error; err != nil {
		http.Error(w, "Error deleting qr codes: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if err := db.DB.Exec("DELETE FROM \"issueReports\" WHERE \"assetId\" = ?", id).Error; err != nil {
		http.Error(w, "Error deleting issue reports: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if err := db.DB.Exec("DELETE FROM \"assetStatusHistory\" WHERE \"assetId\" = ?", id).Error; err != nil {
		http.Error(w, "Error deleting status history: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if result := db.DB.Delete(&asset); result.Error != nil {
		http.Error(w, "Error deleting asset: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(asset)
}
