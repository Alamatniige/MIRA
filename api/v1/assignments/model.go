package assignments

import "time"

type AssetAssignment struct {
	ID           string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	AssetID      string    `json:"assetId" gorm:"column:assetId;type:uuid;not null"`
	UserID       string    `json:"userId" gorm:"column:userId;type:uuid;not null"`
	AssignedDate time.Time `json:"assignedDate" gorm:"column:assignedDate;autoCreateTime"`
	ReturnedDate time.Time `json:"returnedDate" gorm:"column:returnedDate"`
	Acknowledged bool      `json:"acknowledged" gorm:"default:false;not null"`
}

func (AssetAssignment) TableName() string {
	return "assetsAssignment"
}

type AssignAssetRequest struct {
	AssetID string `json:"assetId"`
	UserID  string `json:"userId"`
}
