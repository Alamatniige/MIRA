package assignments

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"mira-api/internal/db"
	"mira-api/middleware"
	asset "mira-api/v1/assets"
	"mira-api/v1/notifications"
	userv1 "mira-api/v1/user"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func authenticatedUserIDFromContext(r *http.Request) (string, bool) {
	if userID, ok := r.Context().Value(middleware.UserIDKey).(string); ok && strings.TrimSpace(userID) != "" {
		return userID, true
	}

	if fallback, ok := r.Context().Value("userID").(string); ok && strings.TrimSpace(fallback) != "" {
		return fallback, true
	}

	return "", false
}

func deriveAssignmentStatus(acknowledged bool, returnedAt *time.Time, rejectedAt *time.Time) string {
	if rejectedAt != nil {
		return "REJECTED"
	}

	if returnedAt != nil {
		return "RETURNED"
	}

	if acknowledged {
		return "CONFIRMED"
	}

	return "PENDING"
}

func normalizeAssetCondition(value string) string {
	return strings.Join(strings.Fields(strings.ReplaceAll(strings.ReplaceAll(strings.TrimSpace(strings.ToLower(value)), "_", " "), "-", " ")), " ")
}

// Assign assets to user
func AssignAsset(w http.ResponseWriter, r *http.Request) {
	var req AssignAssetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.UserID == "" {
		if id, ok := authenticatedUserIDFromContext(r); ok {
			req.UserID = id
		}
	}

	if req.AssetID == "" || req.UserID == "" {
		http.Error(w, "AssetID and UserID are required", http.StatusBadRequest)
		return
	}

	issuerID, ok := authenticatedUserIDFromContext(r)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
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

	if asset.AssignmentStatus != "Available" {
		tx.Rollback()
		http.Error(w, "Asset is not available for assignment", http.StatusConflict)
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

	if err := tx.Model(&asset).Updates(map[string]interface{}{"isAssigned": true, "assignmentStatus": "Pending"}).Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to update asset status", http.StatusInternalServerError)
		return
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}

	go notifications.Emit(
		notifications.TypeAssetAssigned,
		"Asset assigned",
		fmt.Sprintf("%s assigned %s (%s).", issuer.FullName, asset.AssetName, asset.Tag),
		issuer.FullName,
	)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(assignment)
}

func RequestAssignment(w http.ResponseWriter, r *http.Request) {
	requestorID, ok := authenticatedUserIDFromContext(r)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req AssignAssetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.AssetID == "" {
		http.Error(w, "assetId is required", http.StatusBadRequest)
		return
	}

	tx := db.DB.Begin()
	if tx.Error != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	var assetRecord asset.Asset
	if err := tx.First(&assetRecord, "id = ?", req.AssetID).Error; err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "Asset not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	if assetRecord.AssignmentStatus != "Available" {
		tx.Rollback()
		http.Error(w, "Asset is not available for assignment", http.StatusConflict)
		return
	}

	assignment := AssetAssignment{
		AssetID:        req.AssetID,
		UserID:         requestorID,
		IssuedByUserID: &requestorID,
		Notes:          req.Notes,
	}

	if err := tx.Create(&assignment).Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to create assignment request", http.StatusInternalServerError)
		return
	}

	if err := tx.Model(&assetRecord).Updates(map[string]interface{}{"isAssigned": true, "assignmentStatus": "Pending"}).Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to update asset status", http.StatusInternalServerError)
		return
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}

	requestorName := requestorID
	var requestor userv1.User
	if err := db.DB.Select("id", `"fullName"`).First(&requestor, "id = ?", requestorID).Error; err == nil {
		if strings.TrimSpace(requestor.FullName) != "" {
			requestorName = requestor.FullName
		}
	}

	go notifications.Emit(
		notifications.TypeAssetRequest,
		"New assignment request",
		fmt.Sprintf("%s requested asset %s (%s).", requestorName, assetRecord.AssetName, assetRecord.Tag),
		requestorName,
	)

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

	userID, ok := authenticatedUserIDFromContext(r)
	if !ok {
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
	if err := tx.Where("\"assetId\" = ? AND \"userId\" = ? AND \"returnedDate\" IS NULL AND \"rejectedAt\" IS NULL", req.AssetID, userID).First(&assignment).Error; err != nil {
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

	if err := tx.Model(&asset).Updates(map[string]interface{}{"isAssigned": false, "assignmentStatus": "Available"}).Error; err != nil {
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

// RejectAssignment rejects an active assignment and frees the asset for reassignment.
func RejectAssignment(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	if id == "" {
		http.Error(w, "Missing assignment ID", http.StatusBadRequest)
		return
	}

	var req RejectAssignmentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	reason := strings.TrimSpace(req.Reason)
	if reason == "" {
		http.Error(w, "Rejection reason is required", http.StatusBadRequest)
		return
	}

	rejectedByUserID, ok := authenticatedUserIDFromContext(r)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	tx := db.DB.Begin()
	if tx.Error != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	var assignment AssetAssignment
	if err := tx.First(&assignment, "id = ?", id).Error; err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "Assignment not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	if assignment.ReturnedDate != nil {
		tx.Rollback()
		http.Error(w, "Assignment is already returned", http.StatusConflict)
		return
	}

	if assignment.RejectedAt != nil {
		tx.Rollback()
		http.Error(w, "Assignment is already rejected", http.StatusConflict)
		return
	}

	rejectedAt := time.Now()
	updates := map[string]interface{}{
		"rejectedAt":       rejectedAt,
		"rejectedByUserId": rejectedByUserID,
		"rejectionReason":  reason,
		"acknowledged":     false,
	}

	if err := tx.Model(&assignment).Updates(updates).Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to reject assignment", http.StatusInternalServerError)
		return
	}

	if err := tx.Model(&asset.Asset{}).Where("id = ?", assignment.AssetID).Updates(map[string]interface{}{"isAssigned": false, "assignmentStatus": "Available"}).Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to update asset status", http.StatusInternalServerError)
		return
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":         "Assignment rejected",
		"assignmentId":    assignment.ID,
		"rejectedAt":      rejectedAt,
		"rejectionReason": reason,
	})
}

// GetMyActiveAssignments returns active (not yet returned) assignments for the authenticated user.
func GetMyActiveAssignments(w http.ResponseWriter, r *http.Request) {
	userID, ok := authenticatedUserIDFromContext(r)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	type row struct {
		ID               string     `gorm:"column:id"`
		AssetID          string     `gorm:"column:assetId"`
		Tag              string     `gorm:"column:tag"`
		AssetName        string     `gorm:"column:assetName"`
		Department       string     `gorm:"column:department"`
		Acknowledged     bool       `gorm:"column:acknowledged"`
		Notes            string     `gorm:"column:notes"`
		AssignedDate     time.Time  `gorm:"column:assignedDate"`
		ConfirmedAt      *time.Time `gorm:"column:confirmedAt"`
		RejectedAt       *time.Time `gorm:"column:rejectedAt"`
		RejectedByUserID *string    `gorm:"column:rejectedByUserId"`
		RejectionReason  string     `gorm:"column:rejectionReason"`
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
			a."assignedDate",
			a."confirmedAt",
			a."rejectedAt",
			a."rejectedByUserId",
			a."rejectionReason"
		FROM "assetsAssignment" a
		JOIN assets ast ON ast.id = a."assetId"
		JOIN users u ON u.id = a."userId"
		WHERE a."userId" = ?
		  AND a."returnedDate" IS NULL
		  AND a."rejectedAt" IS NULL
		  AND a.acknowledged = true
		ORDER BY a."assignedDate" DESC
	`, userID).Scan(&rows).Error

	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	result := make([]AssignmentResponse, 0, len(rows))
	for _, row := range rows {
		status := deriveAssignmentStatus(row.Acknowledged, nil, row.RejectedAt)

		result = append(result, AssignmentResponse{
			ID:               row.ID,
			AssetID:          row.AssetID,
			AssetTag:         row.Tag,
			AssetName:        row.AssetName,
			Department:       row.Department,
			Status:           status,
			Notes:            row.Notes,
			AssignedAt:       row.AssignedDate,
			ConfirmedAt:      row.ConfirmedAt,
			RejectedAt:       row.RejectedAt,
			RejectedByUserID: row.RejectedByUserID,
			RejectionReason:  row.RejectionReason,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(result)
}

// GetMyPendingAssignments returns pending (not yet confirmed) assignment requests for the authenticated user.
func GetMyPendingAssignments(w http.ResponseWriter, r *http.Request) {
	userID, ok := authenticatedUserIDFromContext(r)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	type row struct {
		ID               string     `gorm:"column:id"`
		AssetID          string     `gorm:"column:assetId"`
		Tag              string     `gorm:"column:tag"`
		AssetName        string     `gorm:"column:assetName"`
		Department       string     `gorm:"column:department"`
		Acknowledged     bool       `gorm:"column:acknowledged"`
		Notes            string     `gorm:"column:notes"`
		AssignedDate     time.Time  `gorm:"column:assignedDate"`
		ConfirmedAt      *time.Time `gorm:"column:confirmedAt"`
		RejectedAt       *time.Time `gorm:"column:rejectedAt"`
		RejectedByUserID *string    `gorm:"column:rejectedByUserId"`
		RejectionReason  string     `gorm:"column:rejectionReason"`
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
			a."assignedDate",
			a."confirmedAt",
			a."rejectedAt",
			a."rejectedByUserId",
			a."rejectionReason"
		FROM "assetsAssignment" a
		JOIN assets ast ON ast.id = a."assetId"
		JOIN users u ON u.id = a."userId"
		WHERE a."userId" = ?
		  AND a."returnedDate" IS NULL
		  AND a."rejectedAt" IS NULL
		  AND a.acknowledged = false
		ORDER BY a."assignedDate" DESC
	`, userID).Scan(&rows).Error

	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	result := make([]AssignmentResponse, 0, len(rows))
	for _, row := range rows {
		status := deriveAssignmentStatus(row.Acknowledged, nil, row.RejectedAt)

		result = append(result, AssignmentResponse{
			ID:               row.ID,
			AssetID:          row.AssetID,
			AssetTag:         row.Tag,
			AssetName:        row.AssetName,
			Department:       row.Department,
			Status:           status,
			Notes:            row.Notes,
			AssignedAt:       row.AssignedDate,
			ConfirmedAt:      row.ConfirmedAt,
			RejectedAt:       row.RejectedAt,
			RejectedByUserID: row.RejectedByUserID,
			RejectionReason:  row.RejectionReason,
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
		ConfirmedAt          *time.Time `gorm:"column:confirmedAt"`
		ReturnedDate         *time.Time `gorm:"column:returnedDate"`
		RejectedAt           *time.Time `gorm:"column:rejectedAt"`
		RejectedByUserID     *string    `gorm:"column:rejectedByUserId"`
		RejectionReason      string     `gorm:"column:rejectionReason"`
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
			a."confirmedAt",
			a."returnedDate",
			a."rejectedAt",
			a."rejectedByUserId",
			a."rejectionReason",
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
		status := deriveAssignmentStatus(r.Acknowledged, r.ReturnedDate, r.RejectedAt)

		issuerName := "Unknown issuer"
		if r.IssuedByNameSnapshot != nil && *r.IssuedByNameSnapshot != "" {
			issuerName = *r.IssuedByNameSnapshot
		} else if r.IssuerLiveName != nil && *r.IssuerLiveName != "" {
			issuerName = *r.IssuerLiveName
		}

		result = append(result, AssignmentResponse{
			ID:               r.ID,
			AssetID:          r.AssetID,
			AssetTag:         r.Tag,
			AssetName:        r.AssetName,
			Assignee:         r.FullName,
			IssuedByUserID:   r.IssuedByUserID,
			IssuerName:       issuerName,
			Department:       r.Department,
			Status:           status,
			Notes:            r.Notes,
			AssignedAt:       r.AssignedDate,
			ConfirmedAt:      r.ConfirmedAt,
			ReturnedAt:       r.ReturnedDate,
			RejectedAt:       r.RejectedAt,
			RejectedByUserID: r.RejectedByUserID,
			RejectionReason:  r.RejectionReason,
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

	if assignment.ReturnedDate != nil {
		http.Error(w, "Assignment is already returned", http.StatusConflict)
		return
	}

	if assignment.RejectedAt != nil {
		http.Error(w, "Assignment is already rejected", http.StatusConflict)
		return
	}

	if err := db.DB.Model(&assignment).Updates(map[string]interface{}{
		"acknowledged": true,
		"confirmedAt":  time.Now(),
	}).Error; err != nil {
		http.Error(w, "Failed to confirm assignment", http.StatusInternalServerError)
		return
	}

	if err := db.DB.Model(&asset.Asset{}).Where("id = ?", assignment.AssetID).Update("assignmentStatus", "Unavailable").Error; err != nil {
		log.Printf("assignment %s confirmed but failed to update asset assignmentStatus: %v", assignment.ID, err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Assignment confirmed"})
}
