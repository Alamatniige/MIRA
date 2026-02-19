package issue

import "time"

type Issue struct {
	ID          string    `json:"id"`
	AssetID     string    `json:"assetId"`
	ReportedBy  string    `json:"reportedBy"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	ReportedAt  time.Time `json:"reportedAt"`
}
