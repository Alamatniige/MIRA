package dashboard

import (
	"encoding/json"
	"fmt"
	"mira-api/internal/db"
	"net/http"
	"strings"
	"time"

	assetv1 "mira-api/v1/assets"
)

func sendResponse(w http.ResponseWriter, data interface{}, err error, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	errMsg := ""
	if err != nil {
		errMsg = err.Error()
	}
	json.NewEncoder(w).Encode(DashboardResponse{
		Data:   data,
		Error:  errMsg,
		Status: status,
	})
}

func GetDashboardStats(w http.ResponseWriter, r *http.Request) {
	var total, active, assigned, maintenance, unassigned int64

	db.DB.Model(&assetv1.Asset{}).Count(&total)
	db.DB.Model(&assetv1.Asset{}).Where(`"currentStatus" IN (?, ?)`, "Good", "Available").Count(&active)
	db.DB.Model(&assetv1.Asset{}).Where(`"isAssigned" = ?`, true).Count(&assigned)
	db.DB.Model(&assetv1.Asset{}).Where(`"currentStatus" = ?`, "Under Maintenance").Count(&maintenance)

	// Unassigned = not assigned AND not under maintenance
	db.DB.Model(&assetv1.Asset{}).Where(`"isAssigned" = ? AND "currentStatus" NOT IN (?)`, false, "Under Maintenance").Count(&unassigned)

	activePercentage := 0.0
	if total > 0 {
		activePercentage = (float64(active) / float64(total)) * 100
	}

	stats := DashboardStats{
		TotalAssets:      total,
		ActiveAssets:     active,
		AssignedAssets:   assigned,
		UnderMaintenance: maintenance,
		UnassignedAssets: unassigned,
		ActivePercentage: activePercentage,
	}

	sendResponse(w, stats, nil, http.StatusOK)
}

func GetDashboardRooms(w http.ResponseWriter, r *http.Request) {
	type result struct {
		Room  string `gorm:"column:room_name"`
		Count int64  `gorm:"column:count"`
	}

	var results []result
	db.DB.Raw(`
		SELECT COALESCE(ar.name, 'Unknown') as room_name, COUNT(a.id) as count
		FROM assets a
		LEFT JOIN "assetRoom" ar ON ar.id = a.room
		GROUP BY room_name
		ORDER BY count DESC
	`).Scan(&results)

	var maxCount int64 = 0
	for _, res := range results {
		if res.Count > maxCount {
			maxCount = res.Count
		}
	}

	stats := make([]RoomStat, 0, len(results))
	for _, res := range results {
		width := "0%"
		if maxCount > 0 {
			width = fmt.Sprintf("%d%%", (res.Count*100)/maxCount)
		}
		stats = append(stats, RoomStat{
			Label: res.Room,
			Value: res.Count,
			Width: width,
		})
	}

	sendResponse(w, stats, nil, http.StatusOK)
}

func GetDashboardActivity(w http.ResponseWriter, r *http.Request) {
	type rawActivity struct {
		ID           string    `gorm:"column:id"`
		Tag          string    `gorm:"column:tag"`
		AssetName    string    `gorm:"column:asset_name"`
		Assignee     string    `gorm:"column:assignee"`
		Department   string    `gorm:"column:department"`
		Status       string    `gorm:"column:status"`
		ActivityDate time.Time `gorm:"column:activity_date"`
	}

	var results []rawActivity
	db.DB.Raw(`
		(SELECT 
			aa.id as id,
			a.tag as tag,
			a."assetName" as asset_name,
			u."fullName" as assignee,
			u.department as department,
			'Assigned' as status,
			aa."assignedDate" as activity_date
		FROM "assetsAssignment" aa
		JOIN assets a ON a.id = aa."assetId"
		JOIN users u ON u.id = aa."userId"
		WHERE aa."confirmedAt" IS NOT NULL AND aa."returnedAt" IS NULL)
		UNION ALL
		(SELECT 
			ash.id as id,
			a.tag as tag,
			a."assetName" as asset_name,
			'System' as assignee,
			'IT Operations' as department,
			ash.status as status,
			ash."updatedAt" as activity_date
		FROM "assetStatusHistory" ash
		JOIN assets a ON a.id = ash."assetId")
		ORDER BY activity_date DESC
		LIMIT 5
	`).Scan(&results)

	finalActivities := make([]ActivityItem, 0, len(results))
	for _, res := range results {
		variant := "default"
		status := strings.ToLower(res.Status)
		switch status {
		case "assigned", "good", "available":
			variant = "success"
		case "under maintenance", "maintenance", "under review":
			variant = "warning"
		case "returned":
			variant = "muted"
		}

		initials := ""
		if res.Assignee == "System" {
			initials = "SY"
		} else {
			parts := strings.Fields(res.Assignee)
			for _, p := range parts {
				if len(p) > 0 {
					initials += string(p[0])
				}
			}
		}
		if len(initials) > 2 {
			initials = initials[:2]
		}
		initials = strings.ToUpper(initials)

		finalActivities = append(finalActivities, ActivityItem{
			ID:            res.ID,
			Tag:           res.Tag,
			AssetName:     res.AssetName,
			Assignee:      res.Assignee,
			Department:    res.Department,
			Status:        res.Status,
			StatusVariant: variant,
			Date:          res.ActivityDate,
			Initials:      initials,
		})
	}

	sendResponse(w, finalActivities, nil, http.StatusOK)
}
