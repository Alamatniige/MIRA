package activity

import (
	"time"

	"mira-api/internal/db"
)

func TouchUserLastActive(userID string, timestamp time.Time) error {
	if userID == "" {
		return nil
	}

	return db.DB.Table("users").
		Where("id = ?", userID).
		Update("lastActive", timestamp).
		Error
}
