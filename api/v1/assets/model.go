package asset

import "time"

type Asset struct {
	ID            string    `json:"id"`
	AssetName     string    `json:"assetName"`
	AssetType     string    `json:"assetType"`
	SerialNumber  string    `json:"serialNumber"`
	Specification string    `json:"specification"`
	Location      string    `json:"location"`
	CurrentStatus string    `json:"currentStatus"`
	CreatedAt     time.Time `json:"createdAt"`
}
