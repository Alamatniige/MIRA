package dashboard

import "time"

type DashboardStats struct {
	TotalAssets        int64 `json:"totalAssets"`
	ActiveAssets       int64 `json:"activeAssets"`
	AssignedAssets      int64 `json:"assignedAssets"`
	UnderMaintenance   int64 `json:"underMaintenance"`
	UnassignedAssets    int64 `json:"unassignedAssets"`
	ActivePercentage    float64 `json:"activePercentage"`
}

type RoomStat struct {
	Label string  `json:"label"`
	Value int64   `json:"value"`
	Width string  `json:"width"`
}

type ActivityItem struct {
	ID            string    `json:"id"`
	Tag           string    `json:"tag"`
	AssetName     string    `json:"assetName"`
	Assignee      string    `json:"assignee"`
	Department    string    `json:"department"`
	Status        string    `json:"status"`
	StatusVariant string    `json:"statusVariant"`
	Date          time.Time `json:"date"`
	Initials      string    `json:"initials"`
}

type DashboardResponse struct {
	Data   interface{} `json:"data"`
	Error  string      `json:"error,omitempty"`
	Status int         `json:"status"`
}
