package notifications

import "time"

type NotificationType string

const (
	TypeReportSubmitted    NotificationType = "REPORT_SUBMITTED"
	TypeRequestPending     NotificationType = "REQUEST_PENDING"
	TypeRequestAccepted    NotificationType = "REQUEST_ACCEPTED"
	TypeRequestRejected    NotificationType = "REQUEST_REJECTED"
	TypeAssetRegistered    NotificationType = "asset_registered"
	TypeAssetAssigned      NotificationType = "asset_assigned"
	TypeAssetUpdated       NotificationType = "asset_updated"
	TypeAssetDeleted       NotificationType = "asset_deleted"
	TypeAssetStatusChanged NotificationType = "asset_status_changed"
	TypeIssueAcknowledged  NotificationType = "issue_acknowledged"
	TypeIssueResolved      NotificationType = "issue_resolved"
)

type Notification struct {
	ID          string           `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Type        NotificationType `json:"type" gorm:"column:type;not null"`
	RecipientID string           `json:"recipient_id" gorm:"column:recipient_id;type:uuid;not null;index"`
	ActorID     *string          `json:"actor_id" gorm:"column:actor_id;type:uuid"`
	AssetID     string           `json:"asset_id" gorm:"column:asset_id;type:uuid"`
	Title       string           `json:"title" gorm:"column:title;not null"`
	Message     string           `json:"message" gorm:"column:message;not null"`
	IsRead      bool             `json:"is_read" gorm:"column:is_read;default:false;not null"`
	CreatedAt   time.Time        `json:"created_at" gorm:"column:createdAt;autoCreateTime;index"`
}

func (Notification) TableName() string {
	return "notifications"
}
