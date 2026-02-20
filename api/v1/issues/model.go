package issues

import "time"

type IssueReport struct {
	ID          string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	AssetID     string    `json:"assetId" gorm:"column:assetId;type:uuid;not null"`
	ReportedBy  string    `json:"reportedBy" gorm:"column:reportedBy;type:uuid;not null"`
	Description string    `json:"description" gorm:"not null"`
	Status      string    `json:"status" gorm:"not null"`
	ReportAt    time.Time `json:"reportAt" gorm:"column:reportAt;autoCreateTime"`
}

func (IssueReport) TableName() string {
	return "issueReports"
}
