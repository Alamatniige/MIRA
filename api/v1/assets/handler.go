package asset

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"mira-api/internal/db"
	"mira-api/v1/qr"
	"mira-api/v1/supabase"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/skip2/go-qrcode"
	"gorm.io/gorm"
)

// Fetch all registered assets
func GetAssets(w http.ResponseWriter, r *http.Request) {
	var assets []Asset
	if result := db.DB.Preload("AssetTypeRel").Preload("RoomRel").Preload("FloorRel").Find(&assets); result.Error != nil {
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

	if result := db.DB.Preload("AssetTypeRel").Preload("RoomRel").Preload("FloorRel").First(&asset, "id = ?", id); result.Error != nil {
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
		Room:          req.Room,
		Floor:         req.Floor,
		CurrentStatus: req.CurrentStatus,
		Tag:           req.Tag,
		Image:         req.Image,
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

// Add asset floor
func AddAssetFloor(w http.ResponseWriter, r *http.Request) {
	var req CreateAssetFloorRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	newAssetFloor := AssetFloor{
		Name: req.Name,
	}

	if result := db.DB.Create(&newAssetFloor); result.Error != nil {
		http.Error(w, "Error adding asset floor: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newAssetFloor)
}

// Add asset room
func AddAssetRoom(w http.ResponseWriter, r *http.Request) {
	var req CreateAssetRoomRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	newAssetRoom := AssetRoom{
		Name: req.Name,
	}

	if result := db.DB.Create(&newAssetRoom); result.Error != nil {
		http.Error(w, "Error adding asset room: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newAssetRoom)
}

// Fetch all asset types
func GetAssetTypes(w http.ResponseWriter, r *http.Request) {
	var types []AssetType
	if result := db.DB.Find(&types); result.Error != nil {
		http.Error(w, "Error fetching asset types: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(types)
}

// Fetch all asset floors
func GetAssetFloors(w http.ResponseWriter, r *http.Request) {
	var floors []AssetFloor
	if result := db.DB.Find(&floors); result.Error != nil {
		http.Error(w, "Error fetching asset floors: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(floors)
}

// Fetch all asset rooms
func GetAssetRooms(w http.ResponseWriter, r *http.Request) {
	var rooms []AssetRoom
	if result := db.DB.Find(&rooms); result.Error != nil {
		http.Error(w, "Error fetching asset rooms: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(rooms)
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
	asset.Room = req.Room
	asset.Floor = req.Floor
	asset.Image = req.Image

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

// Upload asset images
func UploadAssetImage(w http.ResponseWriter, r *http.Request) {
	// Parse multipart form (max 50MB for multiple files)
	if err := r.ParseMultipartForm(50 << 20); err != nil {
		http.Error(w, "Failed to parse form: "+err.Error(), http.StatusBadRequest)
		return
	}

	files := r.MultipartForm.File["images"]
	if len(files) == 0 {
		http.Error(w, "No images found in request", http.StatusBadRequest)
		return
	}

	supabaseURL := os.Getenv("SUPABASE_URL")
	var uploadedUrls []string

	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			http.Error(w, "Error retrieving file: "+err.Error(), http.StatusBadRequest)
			return
		}

		// Generate unique filename
		ext := filepath.Ext(fileHeader.Filename)
		filename := uuid.New().String() + ext

		// Upload to Supabase storage bucket "asset"
		resp := supabase.Client.Storage.From("asset").Upload(filename, file, nil)
		file.Close() // Close immediately after upload

		if resp.Message != "" {
			http.Error(w, "Failed to upload image: "+resp.Message, http.StatusInternalServerError)
			return
		}

		// Construct public URL
		publicURL := fmt.Sprintf("%s/storage/v1/object/public/asset/%s", supabaseURL, filename)
		uploadedUrls = append(uploadedUrls, publicURL)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"imageUrls": uploadedUrls})
}

