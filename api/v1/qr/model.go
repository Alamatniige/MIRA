package qr

import "time"

const ReturnQrPrefix = "mira-return:"

type QrCode struct {
	ID         string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	AssetID    string    `json:"assetId" gorm:"column:assetId;type:uuid;not null;uniqueIndex"`
	QrValue    string    `json:"qrValue" gorm:"column:qrValue;not null"`
	GenerateAt time.Time `json:"generateAt" gorm:"column:generateAt;autoCreateTime"`
}

func (QrCode) TableName() string {
	return "qrCodes"
}

// Request payload for endpoint
type GenerateQrRequest struct {
	AssetID string `json:"assetId"`
}

type ReturnQrGenerateResponse struct {
	Payload string `json:"payload"`
	Token   string `json:"token"`
	Intent  string `json:"intent"`
}

type ReturnQrValidateRequest struct {
	ScannedData string `json:"scannedData"`
}

type ReturnQrValidateResponse struct {
	Valid   bool   `json:"valid"`
	Intent  string `json:"intent,omitempty"`
	Payload string `json:"payload,omitempty"`
}
