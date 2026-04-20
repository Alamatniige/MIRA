package activity

import (
	"time"

	"gorm.io/datatypes"
)

// AuditLog represents a system-wide administrative action
type AuditLog struct {
	ID          string         `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	ActorID     string         `json:"actorId" gorm:"column:actorId;type:uuid;not null"`
	Action      string         `json:"action" gorm:"column:action;not null"` // e.g., 'USER_DEACTIVATED'
	TargetID    string         `json:"targetId" gorm:"column:targetId;type:uuid"`     // ID of user/role affected
	TargetType  string         `json:"targetType" gorm:"column:targetType"` // 'user', 'role', 'asset'
	Description string         `json:"description" gorm:"column:description"`
	Metadata    datatypes.JSON `json:"metadata" gorm:"column:metadata"`     // { "old": {...}, "new": {...} }
	IPAddress   string         `json:"ipAddress" gorm:"column:ipAddress"`
	CreatedAt   time.Time      `json:"createdAt" gorm:"column:createdAt;autoCreateTime"`
}

func (AuditLog) TableName() string {
	return "auditLogs"
}

// AssetLog represents a lifecycle event for a specific asset
type AssetLog struct {
	ID          string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	AssetID     string    `json:"assetId" gorm:"column:assetId;type:uuid;not null"`
	ActorID     string    `json:"actorId" gorm:"column:actorId;type:uuid;not null"`
	Action      string    `json:"action" gorm:"column:action;not null"`    // 'ASSIGNED', 'RETURNED', etc.
	Description string    `json:"description" gorm:"column:description"`
	Timestamp   time.Time `json:"timestamp" gorm:"column:timestamp;autoCreateTime"`
}

func (AssetLog) TableName() string {
	return "assetLogs"
}
