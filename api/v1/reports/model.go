package report

import "time"

// Report maps to the issueReports table.
type Report struct {
	ID          string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	AssetID     string    `json:"assetId" gorm:"column:assetId;type:uuid;not null"`
	ReportedBy  string    `json:"reportedBy" gorm:"column:reportedBy;type:uuid;not null"`
	Description string    `json:"description" gorm:"not null"`
	Status      string    `json:"status" gorm:"not null"`
	ReportAt    time.Time `json:"reportAt" gorm:"column:reportAt"`
}

func (Report) TableName() string {
	return "issueReports"
}

// ReportDetail is the enriched view returned by the reports list endpoint,
// joining issueReports with assets and users.
type ReportDetail struct {
	ID          string    `json:"id"`
	AssetID     string    `json:"assetId"`
	AssetTag    string    `json:"assetTag"`
	AssetName   string    `json:"assetName"`
	ReportedBy  string    `json:"reportedBy"`
	UserName    string    `json:"userName"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	ReportAt    time.Time `json:"reportAt"`
}

// Asset maps to the assets table.
type Asset struct {
	ID            string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	AssetName     string    `json:"assetName" gorm:"column:assetName;not null"`
	AssetType     *int64    `json:"assetType" gorm:"column:assetType"`
	SerialNumber  string    `json:"serialNumber" gorm:"column:serialNumber;not null"`
	Specification string    `json:"specification" gorm:"not null"`
	Room          *int64    `json:"room" gorm:"column:room"`
	Floor         *int64    `json:"floor" gorm:"column:floor"`
	CurrentStatus string    `json:"currentStatus" gorm:"column:currentStatus;not null"`
	IsAssigned    bool      `json:"isAssigned" gorm:"column:isAssigned;default:false;not null"`
	CreatedAt     time.Time `json:"createdAt" gorm:"column:createdAt;autoCreateTime"`
}

func (Asset) TableName() string {
	return "assets"
}

// RoomMapItem holds a room with its canvas layout and live asset count.
type RoomMapItem struct {
	RoomID     int64  `json:"roomId"`
	RoomName   string `json:"roomName"`
	X          int    `json:"x"`
	Y          int    `json:"y"`
	Width      int    `json:"width"`
	Height     int    `json:"height"`
	AssetCount int    `json:"assetCount"`
}

// FloorMapItem represents one floor with its rooms, used by the floor map visualization.
type FloorMapItem struct {
	FloorID   int64         `json:"floorId"`
	FloorName string        `json:"floorName"`
	Level     int           `json:"level"`
	Rooms     []RoomMapItem `json:"rooms"`
}
