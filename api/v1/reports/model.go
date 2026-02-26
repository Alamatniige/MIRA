package report

import "time"

type Report struct {
	ID          string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	AssetID     string    `json:"assetId" gorm:"column:assetId;type:uuid;not null"`
	IssueID     string    `json:"issueId" gorm:"column:issueId;type:uuid;not null"`
	ReportedBy  string    `json:"reportedBy" gorm:"column:reportedBy;type:uuid;not null"`
	Description string    `json:"description" gorm:"not null"`
	Status      string    `json:"status" gorm:"not null"`
	ReportAt    time.Time `json:"reportAt" gorm:"column:reportAt;autoCreateTime"`
}

func (Report) TableName() string {
	return "reports"
}

type Asset struct {
	ID            string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	AssetName     string    `json:"assetName" gorm:"column:assetName;not null"`
	AssetType     string    `json:"assetType" gorm:"column:assetType;not null"`
	SerialNumber  string    `json:"serialNumber" gorm:"column:serialNumber;not null"`
	Specification string    `json:"specification" gorm:"not null"`
	Location      string    `json:"location" gorm:"not null"`
	CurrentStatus string    `json:"currentStatus" gorm:"column:currentStatus;not null"`
	IsAssigned    bool      `json:"isAssigned" gorm:"column:isAssigned;default:false;not null"`
	CreatedAt     time.Time `json:"createdAt" gorm:"column:createdAt;autoCreateTime"`
}

func (Asset) TableName() string {
	return "assets"
}
