package issues

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mira-api/internal/db"
	"mira-api/middleware"
	assetv1 "mira-api/v1/assets"
	"mira-api/v1/notifications"
	userv1 "mira-api/v1/user"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

// GET all issues
func GetIssues(w http.ResponseWriter, r *http.Request) {
	var issues []IssueReport
	if result := db.DB.Find(&issues); result.Error != nil {
		http.Error(w, "Error fetching issues: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(issues)
}

// POST create issue
func CreateIssue(w http.ResponseWriter, r *http.Request) {
	var req CreateIssueRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Prefer the authenticated user's ID over whatever was sent in the body
	reportedBy := strings.TrimSpace(req.ReportedBy)
	if actorID, ok := r.Context().Value(middleware.UserIDKey).(string); ok && strings.TrimSpace(actorID) != "" {
		reportedBy = actorID
	}

	newIssue := IssueReport{
		AssetID:     req.AssetID,
		ReportedBy:  reportedBy,
		Description: req.Description,
		Image:       req.Image,
		Status:      "Open",
	}

	if result := db.DB.Create(&newIssue); result.Error != nil {
		http.Error(w, "Error creating issue: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	// If an image is provided, update the issue with the image URL
	if strings.TrimSpace(req.Image) != "" {
		newIssue.Image = req.Image
		db.DB.Model(&newIssue).Update("image", req.Image)
	}

	// Mark the asset as Under Review and block further assignment
	db.DB.Model(&assetv1.Asset{}).Where("id = ?", req.AssetID).Updates(map[string]interface{}{
		"currentStatus":    "Under Review",
		"assignmentStatus": "Unavailable",
	})

	actorName := "Unknown"
	if actorID, ok := r.Context().Value(middleware.UserIDKey).(string); ok && actorID != "" {
		var actor userv1.User
		if err := db.DB.Select("id", `"fullName"`).First(&actor, "id = ?", actorID).Error; err == nil {
			actorName = actor.FullName
		}
	}

	go notifications.Emit(
		notifications.TypeReportCreated,
		"New issue reported",
		fmt.Sprintf("%s reported an issue for asset %s.", actorName, newIssue.AssetID),
		actorName,
	)

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newIssue)
}

// PUT update issue
func UpdateIssue(w http.ResponseWriter, r *http.Request) {
	var req IssueReport
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	vars := mux.Vars(r)
	id := vars["id"]

	var issue IssueReport
	if result := db.DB.First(&issue, "id = ?", id); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Issue not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching issue: "+result.Error.Error(), http.StatusInternalServerError)
		}
		return
	}

	if result := db.DB.Model(&issue).Updates(req); result.Error != nil {
		http.Error(w, "Error updating issue: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	// If the issue is being confirmed as in-progress, escalate the asset to Under Maintenance
	if strings.ToLower(req.Status) == "in_progress" {
		db.DB.Model(&assetv1.Asset{}).Where("id = ?", issue.AssetID).Update("currentStatus", "Under Maintenance")
	} else if strings.ToLower(req.Status) == "resolved" {
		var asset assetv1.Asset
		if err := db.DB.First(&asset, "id = ?", issue.AssetID).Error; err == nil {
			updates := map[string]interface{}{
				"currentStatus": "Good",
			}
			// Only make it Available if it is NOT currently assigned to someone
			if !asset.IsAssigned {
				updates["assignmentStatus"] = "Available"
			}
			db.DB.Model(&asset).Updates(updates)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(issue)
}

// DELETE delete issue
func DeleteIssue(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var issue IssueReport
	if result := db.DB.First(&issue, "id = ?", id); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Issue not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching issue: "+result.Error.Error(), http.StatusInternalServerError)
		}
		return
	}

	if result := db.DB.Delete(&issue); result.Error != nil {
		http.Error(w, "Error deleting issue: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "DeleteIssue"})
}

// GET issues by asset id
func GetIssueByAssetID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	assetID := vars["assetId"]

	var issues []IssueReport
	if result := db.DB.Where(&IssueReport{AssetID: assetID}).Find(&issues); result.Error != nil {
		http.Error(w, "Error fetching issues: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(issues)
}

func uploadReportImage(w http.ResponseWriter, r *http.Request) {
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
		uploadURL := fmt.Sprintf("%s/storage/v1/object/reports/%s", supabaseURL, filename)
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
		publicURL := fmt.Sprintf("%s/storage/v1/object/public/reports/%s", supabaseURL, filename)
		uploadedUrls = append(uploadedUrls, publicURL)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"imageUrls": uploadedUrls})
}