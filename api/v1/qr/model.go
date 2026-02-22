package qr

import "time"

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
