package qr

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"mira-api/internal/db"
	"mira-api/middleware"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/skip2/go-qrcode"
)

// Generate QR Code
func GenerateQrCode(w http.ResponseWriter, r *http.Request) {
	var req GenerateQrRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.AssetID == "" {
		http.Error(w, "AssetID is required", http.StatusBadRequest)
		return
	}

	qrContent := fmt.Sprintf("mira-asset:%s", req.AssetID)
	png, err := qrcode.Encode(qrContent, qrcode.Medium, 256)
	if err != nil {
		http.Error(w, "Failed to generate QR code image", http.StatusInternalServerError)
		return
	}

	base64QR := base64.StdEncoding.EncodeToString(png)

	qrCode := QrCode{
		AssetID: req.AssetID,
		QrValue: base64QR,
	}

	if err := db.DB.Create(&qrCode).Error; err != nil {
		http.Error(w, "Failed to save QR code", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(qrCode)
}

// Scan QR Code
type ScanRequest struct {
	ScannedData string `json:"scannedData"`
}

func getGlobalReturnQrToken() string {
	token := strings.TrimSpace(os.Getenv("GLOBAL_RETURN_QR_TOKEN"))
	if token == "" {
		return "global-return-v1"
	}
	return token
}

func buildGlobalReturnQrPayload() string {
	return ReturnQrPrefix + getGlobalReturnQrToken()
}

// GenerateGlobalReturnQr returns one static QR payload used for return-flow entry.
func GenerateGlobalReturnQr(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ReturnQrGenerateResponse{
		Payload: buildGlobalReturnQrPayload(),
		Token:   getGlobalReturnQrToken(),
		Intent:  "asset-return",
	})
}

// ValidateGlobalReturnQr validates scanned payload for the global return QR flow.
func ValidateGlobalReturnQr(w http.ResponseWriter, r *http.Request) {
	var req ReturnQrValidateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	expected := buildGlobalReturnQrPayload()
	if strings.TrimSpace(req.ScannedData) != expected {
		http.Error(w, "Invalid return QR Code", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ReturnQrValidateResponse{
		Valid:   true,
		Intent:  "asset-return",
		Payload: expected,
	})
}

func ScanQrCode(w http.ResponseWriter, r *http.Request) {
	var req ScanRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// 1. Verify it's a Mira QR Code
	if len(req.ScannedData) < 11 || req.ScannedData[:11] != "mira-asset:" {
		http.Error(w, "Invalid or unrecognized QR Code", http.StatusBadRequest)
		return
	}

	// 2. Extract the Asset ID
	assetID := req.ScannedData[11:]

	if assetID == "" {
		http.Error(w, "Malformed QR Code, missing Asset ID", http.StatusBadRequest)
		return
	}

	// 3. Find the QR Code record
	var qrCode QrCode
	if err := db.DB.Where("assetId = ?", assetID).First(&qrCode).Error; err != nil {
		http.Error(w, "QR code not found", http.StatusNotFound)
		return
	}

	// 4. Return the QR Code details
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(qrCode)
}

// ScanGlobalReturnQr validates the scanned global return QR payload and returns
// the authenticated user's active (non-returned, non-rejected) assignments so
// the mobile client can present an asset picker.
//
// POST /qr/return/scan (requires auth)
// Body: { "scannedData": "mira-return:<token>" }
func ScanGlobalReturnQr(w http.ResponseWriter, r *http.Request) {
	var req ReturnQrScanRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.ScannedData) != buildGlobalReturnQrPayload() {
		http.Error(w, "Invalid return QR Code", http.StatusBadRequest)
		return
	}

	userID, ok := r.Context().Value(middleware.UserIDKey).(string)
	if !ok || strings.TrimSpace(userID) == "" {
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
			a."assignedDate"
		FROM "assetsAssignment" a
		JOIN assets ast ON ast.id = a."assetId"
		JOIN users u ON u.id = a."userId"
		WHERE a."userId" = ?
		  AND a."returnedDate" IS NULL
		  AND a."rejectedAt" IS NULL
		ORDER BY a."assignedDate" DESC
	`, userID).Scan(&rows).Error
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	assignments := make([]ReturnableAssignment, 0, len(rows))
	for _, row := range rows {
		status := "PENDING"
		if row.Acknowledged {
			status = "CONFIRMED"
		}
		assignments = append(assignments, ReturnableAssignment{
			ID:         row.ID,
			AssetID:    row.AssetID,
			AssetTag:   row.Tag,
			AssetName:  row.AssetName,
			Department: row.Department,
			Status:     status,
			AssignedAt: row.AssignedDate,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ReturnQrScanResponse{
		Valid:       true,
		Intent:      "asset-return",
		Assignments: assignments,
	})
}
