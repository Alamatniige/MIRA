package notifications

import "time"

type NotificationType string

const (
	TypeReportCreated        NotificationType = "report_created"
	TypeAssetAssigned        NotificationType = "asset_assigned"
	TypeAssetRegistered      NotificationType = "asset_registered"
	TypeAssetRequest         NotificationType = "asset_request"
	TypeMaintenanceScheduled NotificationType = "maintenance_scheduled"
)

type Notification struct {
	ID          string           `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Type        NotificationType `json:"type" gorm:"column:type;not null"`
	Title       string           `json:"title" gorm:"column:title;not null"`
	Description string           `json:"description" gorm:"column:description;not null"`
	PerformedBy string           `json:"performedBy" gorm:"column:performedBy;not null;default:''"`
	Read        bool             `json:"read" gorm:"column:read;default:false;not null"`
	CreatedAt   time.Time        `json:"createdAt" gorm:"column:createdAt;autoCreateTime"`
}

func (Notification) TableName() string {
	return "notifications"
}
