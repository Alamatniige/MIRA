package activity

import (
	"log"
	"mira-api/internal/db"
)

// RecordAuditLog saves an administrative action to the auditLogs table.
// It runs in a goroutine to avoid blocking the main request.
func RecordAuditLog(logEntry AuditLog) {
	go func() {
		if err := db.DB.Create(&logEntry).Error; err != nil {
			log.Printf("Failed to record audit log: %v", err)
		}
	}()
}

// RecordAssetLog saves an asset-related event to the assetLogs table.
// It runs in a goroutine to avoid blocking the main request.
func RecordAssetLog(logEntry AssetLog) {
	go func() {
		if err := db.DB.Create(&logEntry).Error; err != nil {
			log.Printf("Failed to record asset log: %v", err)
		}
	}()
}
