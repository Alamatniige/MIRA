package qr

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"mira-api/internal/db"
	"net/http"

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
