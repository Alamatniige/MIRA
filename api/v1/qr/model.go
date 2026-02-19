package qr

type QR struct {
	ID          string `json:"id"`
	AssetID     string `json:"assetId"`
	QrValue     string `json:"qrValue"`
	GeneratedAt string `json:"generatedAt"`
}
