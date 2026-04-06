package asset

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"mira-api/internal/db"
	"mira-api/middleware"
	"mira-api/v1/notifications"
	"mira-api/v1/qr"
	userv1 "mira-api/v1/user"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/skip2/go-qrcode"
	"gorm.io/gorm"
)

func normalizeStatusToken(value string) string {
	cleaned := strings.TrimSpace(strings.ToLower(value))
	cleaned = strings.ReplaceAll(cleaned, "_", " ")
	cleaned = strings.ReplaceAll(cleaned, "-", " ")
	cleaned = strings.Join(strings.Fields(cleaned), " ")
	return cleaned
}

// canonicalizeCurrentStatus maps any incoming status string to one of the three
// canonical condition values: "Good", "Under Review", or "Under Maintenance".
func canonicalizeCurrentStatus(value string) string {
	token := normalizeStatusToken(value)
	switch token {
	case "good", "available":
		return "Good"
	case "under maintenance", "maintenance":
		return "Under Maintenance"
	case "under review":
		return "Under Review"
	}
	return strings.TrimSpace(value)
}

// canonicalizeAssignmentStatus maps any stored assignmentStatus to one of the
// canonical values: "Available", "Pending", or "Unavailable".
// The legacy value "Approved" (written by old code) is treated as "Unavailable".
func canonicalizeAssignmentStatus(value string) string {
	token := strings.TrimSpace(strings.ToLower(value))
	switch token {
	case "available":
		return "Available"
	case "pending":
		return "Pending"
	case "unavailable", "approved":
		return "Unavailable"
	}
	return strings.TrimSpace(value)
}

func statusMatchesFilter(assetStatus, filterStatus string) bool {
	filterToken := normalizeStatusToken(filterStatus)
	if filterToken == "" {
		return true
	}
	return normalizeStatusToken(assetStatus) == filterToken
}

func removedAssetImageObjectPaths(existingImages, updatedImages []string) []string {
	if len(existingImages) == 0 {
		return nil
	}

	updatedSet := make(map[string]struct{}, len(updatedImages))
	for _, imageURL := range updatedImages {
		updatedSet[imageURL] = struct{}{}
	}

	removedPaths := make([]string, 0)
	for _, imageURL := range existingImages {
		if _, exists := updatedSet[imageURL]; exists {
			continue
		}

		objectPath, err := assetStorageObjectPath(imageURL)
		if err != nil {
			log.Printf("failed to parse asset image URL %q: %v", imageURL, err)
			continue
		}

		removedPaths = append(removedPaths, objectPath)
	}

	return removedPaths
}

func assetStorageObjectPath(publicURL string) (string, error) {
	parsedURL, err := url.Parse(publicURL)
	if err != nil {
		return "", err
	}

	const publicPrefix = "/storage/v1/object/public/asset/"
	if !strings.Contains(parsedURL.Path, publicPrefix) {
		return "", fmt.Errorf("unexpected asset image URL path: %s", parsedURL.Path)
	}

	objectPath := strings.TrimPrefix(parsedURL.Path, publicPrefix)
	if objectPath == parsedURL.Path || objectPath == "" {
		return "", fmt.Errorf("asset image URL does not contain an object path")
	}

	return objectPath, nil
}

func deleteAssetStorageObjects(objectPaths []string) error {
	if len(objectPaths) == 0 {
		return nil
	}

	supabaseURL := strings.TrimRight(os.Getenv("SUPABASE_URL"), "/")
	serviceRoleKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")
	if supabaseURL == "" || serviceRoleKey == "" {
		return fmt.Errorf("supabase storage cleanup is unavailable because SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured")
	}

	httpClient := &http.Client{}
	for _, objectPath := range objectPaths {
		deleteURL := fmt.Sprintf("%s/storage/v1/object/asset/%s", supabaseURL, escapeStorageObjectPath(objectPath))
		request, err := http.NewRequest(http.MethodDelete, deleteURL, nil)
		if err != nil {
			return err
		}

		request.Header.Set("Authorization", "Bearer "+serviceRoleKey)
		request.Header.Set("apikey", serviceRoleKey)

		response, err := httpClient.Do(request)
		if err != nil {
			return err
		}

		responseBody, _ := io.ReadAll(response.Body)
		response.Body.Close()

		if response.StatusCode == http.StatusNotFound {
			continue
		}

		if response.StatusCode < http.StatusOK || response.StatusCode >= http.StatusMultipleChoices {
			return fmt.Errorf("failed to delete asset image %q from storage: %s", objectPath, strings.TrimSpace(string(responseBody)))
		}
	}

	return nil
}

func escapeStorageObjectPath(objectPath string) string {
	parts := strings.Split(objectPath, "/")
	for index, part := range parts {
		parts[index] = url.PathEscape(part)
	}

	return strings.Join(parts, "/")
}

// Fetch all registered assets
func GetAssets(w http.ResponseWriter, r *http.Request) {
	var assets []Asset
	if result := db.DB.Preload("AssetTypeRel").Preload("RoomRel").Preload("FloorRel").Find(&assets); result.Error != nil {
		http.Error(w, "Error fetching assets: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	statusQuery := r.URL.Query().Get("status")
	if strings.TrimSpace(statusQuery) != "" {
		filtered := make([]Asset, 0, len(assets))
		for _, asset := range assets {
			if statusMatchesFilter(asset.CurrentStatus, statusQuery) {
				asset.CurrentStatus = canonicalizeCurrentStatus(asset.CurrentStatus)
				filtered = append(filtered, asset)
			}
		}
		assets = filtered
	} else {
		for i := range assets {
			assets[i].CurrentStatus = canonicalizeCurrentStatus(assets[i].CurrentStatus)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(assets)
}

// Fetch asset details
func GetAssetDetails(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	var asset Asset

	result := db.DB.Preload("AssetTypeRel").Preload("RoomRel").Preload("FloorRel").First(&asset, "id = ?", id)
	if result.Error == gorm.ErrRecordNotFound {
		// Fallback: try matching by tag (for old QR formats)
		result = db.DB.Preload("AssetTypeRel").Preload("RoomRel").Preload("FloorRel").First(&asset, `"tag" = ?`, id)
	}
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Asset not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching asset details: "+result.Error.Error(), http.StatusInternalServerError)
		}
		return
	}

	asset.CurrentStatus = canonicalizeCurrentStatus(asset.CurrentStatus)
	asset.AssignmentStatus = canonicalizeAssignmentStatus(asset.AssignmentStatus)

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
		AssetName:        req.AssetName,
		AssetType:        req.AssetType,
		SerialNumber:     req.SerialNumber,
		Specification:    req.Specification,
		Room:             req.Room,
		Floor:            req.Floor,
		CurrentStatus:    "Good",
		AssignmentStatus: "Available",
		IsAssigned:       false,
		Tag:              req.Tag,
		Image:            req.Image,
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

	actorName := "Unknown"
	actorID, _ := r.Context().Value(middleware.UserIDKey).(string)
	if actorID != "" {
		var actor userv1.User
		if err := db.DB.Select("id", `"fullName"`).First(&actor, "id = ?", actorID).Error; err == nil {
			actorName = actor.FullName
		}
	}

	// Notify all admins about the new asset
	var admins []userv1.User
	if err := db.DB.Where(`"roleId" = ?`, "1").Find(&admins).Error; err == nil {
		for _, admin := range admins {
			go notifications.Emit(
				admin.ID,
				actorID,
				newAsset.ID,
				notifications.TypeAssetRegistered,
				"New Asset Registered",
				fmt.Sprintf("%s registered %s (%s).", actorName, newAsset.AssetName, newAsset.Tag),
			)
		}
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
		Name:  req.Name,
		Level: req.Level,
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
		Name:    req.Name,
		FloorId: req.FloorId,
		X:       20,
		Y:       20,
		Width:   100,
		Height:  80,
	}
	if req.X != nil {
		newAssetRoom.X = *req.X
	}
	if req.Y != nil {
		newAssetRoom.Y = *req.Y
	}
	if req.Width != nil {
		newAssetRoom.Width = *req.Width
	}
	if req.Height != nil {
		newAssetRoom.Height = *req.Height
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

// Update asset floor
func UpdateAssetFloor(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var floor AssetFloor
	if result := db.DB.First(&floor, "id = ?", id); result.Error != nil {
		http.Error(w, "Floor not found", http.StatusNotFound)
		return
	}

	var req UpdateAssetFloorRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Name != nil {
		floor.Name = *req.Name
	}
	if req.Level != nil {
		floor.Level = req.Level
	}

	if result := db.DB.Save(&floor); result.Error != nil {
		http.Error(w, "Error updating floor: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(floor)
}

// Delete asset floor
func DeleteAssetFloor(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var count int64
	if result := db.DB.Model(&Asset{}).Where(`"floor" = ?`, id).Count(&count); result.Error != nil {
		http.Error(w, "Error checking asset references: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}
	if count > 0 {
		http.Error(w, "Cannot delete floor: assets are currently assigned to this floor", http.StatusConflict)
		return
	}

	// Also check if any rooms reference this floor
	var roomCount int64
	if result := db.DB.Model(&AssetRoom{}).Where(`"floorId" = ?`, id).Count(&roomCount); result.Error != nil {
		http.Error(w, "Error checking room references: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}
	if roomCount > 0 {
		http.Error(w, "Cannot delete floor: rooms are assigned to this floor", http.StatusConflict)
		return
	}

	if result := db.DB.Delete(&AssetFloor{}, id); result.Error != nil {
		http.Error(w, "Error deleting floor: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Update asset room
func UpdateAssetRoom(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var room AssetRoom
	if result := db.DB.First(&room, "id = ?", id); result.Error != nil {
		http.Error(w, "Room not found", http.StatusNotFound)
		return
	}

	var req UpdateAssetRoomRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Name != nil {
		room.Name = *req.Name
	}
	if req.FloorId != nil {
		room.FloorId = req.FloorId
	}
	if req.X != nil {
		room.X = *req.X
	}
	if req.Y != nil {
		room.Y = *req.Y
	}
	if req.Width != nil {
		room.Width = *req.Width
	}
	if req.Height != nil {
		room.Height = *req.Height
	}

	if result := db.DB.Save(&room); result.Error != nil {
		http.Error(w, "Error updating room: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(room)
}

// Delete asset room
func DeleteAssetRoom(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var count int64
	if result := db.DB.Model(&Asset{}).Where(`"room" = ?`, id).Count(&count); result.Error != nil {
		http.Error(w, "Error checking asset references: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}
	if count > 0 {
		http.Error(w, "Cannot delete room: assets are currently assigned to this room", http.StatusConflict)
		return
	}

	if result := db.DB.Delete(&AssetRoom{}, id); result.Error != nil {
		http.Error(w, "Error deleting room: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
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

	removedImagePaths := removedAssetImageObjectPaths(asset.Image, req.Image)

	asset.AssetName = req.AssetName
	asset.AssetType = req.AssetType
	asset.SerialNumber = req.SerialNumber
	asset.Specification = req.Specification
	asset.Room = req.Room
	asset.Floor = req.Floor
	asset.CurrentStatus = canonicalizeCurrentStatus(req.CurrentStatus)
	asset.Image = req.Image

	if result := db.DB.Save(&asset); result.Error != nil {
		http.Error(w, "Error updating asset: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	if err := deleteAssetStorageObjects(removedImagePaths); err != nil {
		log.Printf("asset %s updated but failed to clean removed images from storage: %v", asset.ID, err)
	}

	// Notify all admins about the updated asset
	actorID, _ := r.Context().Value(middleware.UserIDKey).(string)
	actorName := actorID
	var actor userv1.User
	if err := db.DB.Select("id", `"fullName"`).First(&actor, "id = ?", actorID).Error; err == nil {
		if strings.TrimSpace(actor.FullName) != "" {
			actorName = actor.FullName
		}
	}
	var admins []userv1.User
	if err := db.DB.Where(`"roleId" = ?`, "1").Find(&admins).Error; err == nil {
		for _, admin := range admins {
			go notifications.Emit(
				admin.ID,
				actorID,
				asset.ID,
				notifications.TypeAssetUpdated,
				"Asset Updated",
				fmt.Sprintf("%s updated asset %s (%s).", actorName, asset.AssetName, asset.Tag),
			)
		}
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

	normalizedStatus := canonicalizeCurrentStatus(req.CurrentStatus)

	statusUpdates := map[string]interface{}{
		"currentStatus": normalizedStatus,
	}
	switch normalizedStatus {
	case "Under Maintenance":
		statusUpdates["assignmentStatus"] = "Unavailable"
		statusUpdates["isAssigned"] = false
	case "Good":
		statusUpdates["assignmentStatus"] = "Available"
		statusUpdates["isAssigned"] = false
	case "Under Review":
		statusUpdates["assignmentStatus"] = "Unavailable"
	}

	if result := db.DB.Model(&asset).Updates(statusUpdates); result.Error != nil {
		http.Error(w, "Error updating asset status: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	asset.CurrentStatus = normalizedStatus
	if as, ok := statusUpdates["assignmentStatus"].(string); ok {
		asset.AssignmentStatus = as
	}

	// Notify all admins about the status change
	actorID, _ := r.Context().Value(middleware.UserIDKey).(string)
	actorName := actorID
	var actor userv1.User
	if err := db.DB.Select("id", `"fullName"`).First(&actor, "id = ?", actorID).Error; err == nil {
		if strings.TrimSpace(actor.FullName) != "" {
			actorName = actor.FullName
		}
	}
	var admins []userv1.User
	if err := db.DB.Where(`"roleId" = ?`, "1").Find(&admins).Error; err == nil {
		for _, admin := range admins {
			go notifications.Emit(
				admin.ID,
				actorID,
				asset.ID,
				notifications.TypeAssetStatusChanged,
				"Asset Status Changed",
				fmt.Sprintf("%s changed the status of %s (%s) to %s.", actorName, asset.AssetName, asset.Tag, asset.CurrentStatus),
			)
		}
	}
	// If the asset is currently assigned, also notify the assignee
	if asset.IsAssigned {
		var activeAssignment struct {
			UserID string `gorm:"column:userId"`
		}
		if err := db.DB.Raw(`SELECT "userId" FROM "assetsAssignment" WHERE "assetId" = ? AND "returnedDate" IS NULL AND "rejectedAt" IS NULL ORDER BY "assignedDate" DESC LIMIT 1`, asset.ID).Scan(&activeAssignment).Error; err == nil && activeAssignment.UserID != "" && activeAssignment.UserID != actorID {
			go notifications.Emit(
				activeAssignment.UserID,
				actorID,
				asset.ID,
				notifications.TypeAssetStatusChanged,
				"Asset Status Changed",
				fmt.Sprintf("The status of your assigned asset %s (%s) was changed to %s.", asset.AssetName, asset.Tag, asset.CurrentStatus),
			)
		}
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

	// Notify all admins BEFORE cascade cleanup so asset FK is still valid
	actorID, _ := r.Context().Value(middleware.UserIDKey).(string)
	actorName := actorID
	var actor userv1.User
	if err := db.DB.Select("id", `"fullName"`).First(&actor, "id = ?", actorID).Error; err == nil {
		if strings.TrimSpace(actor.FullName) != "" {
			actorName = actor.FullName
		}
	}
	var admins []userv1.User
	if err := db.DB.Where(`"roleId" = ?`, "1").Find(&admins).Error; err == nil {
		for _, admin := range admins {
			notifications.Emit(
				admin.ID,
				actorID,
				asset.ID,
				notifications.TypeAssetDeleted,
				"Asset Deleted",
				fmt.Sprintf("%s deleted asset %s (%s).", actorName, asset.AssetName, asset.Tag),
			)
		}
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

	supabaseURL := strings.TrimRight(os.Getenv("SUPABASE_URL"), "/")
	serviceRoleKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")
	if supabaseURL == "" || serviceRoleKey == "" {
		http.Error(w, "Storage is not configured: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY", http.StatusInternalServerError)
		return
	}

	httpClient := &http.Client{}
	var uploadedUrls []string

	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			http.Error(w, "Error retrieving file: "+err.Error(), http.StatusBadRequest)
			return
		}

		fileBytes, err := io.ReadAll(file)
		file.Close()
		if err != nil {
			http.Error(w, "Error reading file: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Generate unique filename
		ext := filepath.Ext(fileHeader.Filename)
		filename := uuid.New().String() + ext
		contentType := http.DetectContentType(fileBytes)

		// Upload directly to Supabase Storage REST API using service role key
		uploadURL := fmt.Sprintf("%s/storage/v1/object/asset/%s", supabaseURL, filename)
		req, err := http.NewRequest(http.MethodPost, uploadURL, bytes.NewReader(fileBytes))
		if err != nil {
			http.Error(w, "Error creating upload request: "+err.Error(), http.StatusInternalServerError)
			return
		}
		req.Header.Set("Authorization", "Bearer "+serviceRoleKey)
		req.Header.Set("apikey", serviceRoleKey)
		req.Header.Set("Content-Type", contentType)

		resp, err := httpClient.Do(req)
		if err != nil {
			http.Error(w, "Error uploading file: "+err.Error(), http.StatusInternalServerError)
			return
		}
		respBody, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
			http.Error(w, "Failed to upload image: "+string(respBody), http.StatusInternalServerError)
			return
		}

		// Construct public URL
		publicURL := fmt.Sprintf("%s/storage/v1/object/public/asset/%s", supabaseURL, filename)
		uploadedUrls = append(uploadedUrls, publicURL)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"imageUrls": uploadedUrls})
}
