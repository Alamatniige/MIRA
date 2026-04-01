package history

import "time"

// HistoryItem represents a single activity in the user's history timeline.
type HistoryItem struct {
	ID          string    `json:"id"`
	AssetID     string    `json:"assetId"`
	AssetName   string    `json:"assetName"`
	Action      string    `json:"action"`    // e.g., "Assigned", "Issue Reported"
	Type        string    `json:"type"`      // "assigned" or "reported"
	Timestamp   time.Time `json:"timestamp"`
	Description string    `json:"description"`
}
