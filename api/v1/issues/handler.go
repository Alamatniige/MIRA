package issues

import (
	"encoding/json"
	"mira-api/internal/db"
	"net/http"

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

	newIssue := IssueReport{
		AssetID:     req.AssetID,
		ReportedBy:  req.ReportedBy,
		Description: req.Description,
		Status:      "Open",
	}

	if result := db.DB.Create(&newIssue); result.Error != nil {
		http.Error(w, "Error creating issue: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

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

	id := r.PathValue("id")

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

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(issue)
}

// DELETE delete issue
func DeleteIssue(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

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
	assetID := r.PathValue("assetId")

	var issues []IssueReport
	if result := db.DB.Where(&IssueReport{AssetID: assetID}).Find(&issues); result.Error != nil {
		http.Error(w, "Error fetching issues: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(issues)
}
