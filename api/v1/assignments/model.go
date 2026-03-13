package assignments

import "time"

type AssetAssignment struct {
	ID           string     `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	AssetID      string     `json:"assetId" gorm:"column:assetId;type:uuid;not null"`
	UserID       string     `json:"userId" gorm:"column:userId;type:uuid;not null"`
	AssignedDate time.Time  `json:"assignedDate" gorm:"column:assignedDate;autoCreateTime"`
	ReturnedDate *time.Time `json:"returnedDate" gorm:"column:returnedDate;type:timestamp;default:null"`
	Acknowledged bool       `json:"acknowledged" gorm:"default:false;not null"`
	Notes        string     `json:"notes" gorm:"column:notes;type:text"`
}

func (AssetAssignment) TableName() string {
	return "assetsAssignment"
}

type AssignAssetRequest struct {
	AssetID string `json:"assetId"`
	UserID  string `json:"userId"`
	Notes   string `json:"notes"`
}

// AssignmentResponse is the enriched shape returned to the frontend.
type AssignmentResponse struct {
	ID         string     `json:"id"`
	AssetID    string     `json:"assetId"`
	AssetTag   string     `json:"assetTag"`
	AssetName  string     `json:"assetName"`
	Assignee   string     `json:"assignee"`
	Department string     `json:"department"`
	Status     string     `json:"status"`
	Notes      string     `json:"notes"`
	AssignedAt time.Time  `json:"assignedAt"`
	ReturnedAt *time.Time `json:"returnedAt,omitempty"`
}
