package report

import (
	"encoding/json"
	"mira-api/internal/db"
	"net/http"
)

// GetAssetInventory returns all assets.
func GetAssetInventory(w http.ResponseWriter, r *http.Request) {
	var assets []Asset
	if result := db.DB.Find(&assets); result.Error != nil {
		http.Error(w, "Error fetching asset inventory: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(assets)
}

// GetAssetUsageReport returns only assigned assets.
func GetAssetUsageReport(w http.ResponseWriter, r *http.Request) {
	var assets []Asset
	if result := db.DB.Where(&Asset{IsAssigned: true}).Find(&assets); result.Error != nil {
		http.Error(w, "Error fetching asset usage report: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(assets)
}

// GetIssueAndMaintenanceReport returns issue reports enriched with asset tag/name
// and the reporter's full name via LEFT JOIN.
func GetIssueAndMaintenanceReport(w http.ResponseWriter, r *http.Request) {
	var reports []ReportDetail
	result := db.DB.Raw(`
		SELECT
			ir.id,
			ir."assetId",
			COALESCE(a.tag, '')           AS asset_tag,
			COALESCE(a."assetName", '')   AS asset_name,
			ir."reportedBy",
			COALESCE(u."fullName", '')    AS user_name,
			ir.description,
			ir.status,
			ir."reportAt",
			ir.image,
			ir."adminNote"
		FROM "issueReports" ir
		LEFT JOIN assets a ON a.id = ir."assetId"
		LEFT JOIN users  u ON u.id = ir."reportedBy"
		ORDER BY ir."reportAt" DESC
	`).Scan(&reports)
	if result.Error != nil {
		http.Error(w, "Error fetching issue reports: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reports)
}

// GetFloorMap returns all floors with their rooms and a live asset count per room.
// Rooms are linked to floors via the assetRoom.floorId column added in migration
// 20260317000000_reports_location_schema.sql.
func GetFloorMap(w http.ResponseWriter, r *http.Request) {
	type floorRoomRow struct {
		FloorID    int64  `gorm:"column:floor_id"`
		FloorName  string `gorm:"column:floor_name"`
		FloorLevel int    `gorm:"column:floor_level"`
		RoomID     *int64 `gorm:"column:room_id"`
		RoomName   string `gorm:"column:room_name"`
		X          int    `gorm:"column:x"`
		Y          int    `gorm:"column:y"`
		Width      int    `gorm:"column:width"`
		Height     int    `gorm:"column:height"`
		AssetCount int    `gorm:"column:asset_count"`
	}

	var rows []floorRoomRow
	result := db.DB.Raw(`
		SELECT
			f.id                        AS floor_id,
			f.name                      AS floor_name,
			COALESCE(f.level, 0)        AS floor_level,
			r.id                        AS room_id,
			COALESCE(r.name, '')        AS room_name,
			COALESCE(r.x, 20)           AS x,
			COALESCE(r.y, 20)           AS y,
			COALESCE(r.width, 100)      AS width,
			COALESCE(r.height, 80)      AS height,
			COUNT(a.id)::int            AS asset_count
		FROM "assetFloor" f
		LEFT JOIN "assetRoom" r ON r."floorId" = f.id
		LEFT JOIN assets       a ON a.room = r.id
		GROUP BY f.id, f.name, f.level, r.id, r.name, r.x, r.y, r.width, r.height
		ORDER BY COALESCE(f.level, 0) ASC, r.id ASC
	`).Scan(&rows)
	if result.Error != nil {
		http.Error(w, "Error fetching floor map: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	// Group rows by floor while preserving level order.
	floorIndex := make(map[int64]int)
	floors := []FloorMapItem{}

	for _, row := range rows {
		idx, exists := floorIndex[row.FloorID]
		if !exists {
			floors = append(floors, FloorMapItem{
				FloorID:   row.FloorID,
				FloorName: row.FloorName,
				Level:     row.FloorLevel,
				Rooms:     []RoomMapItem{},
			})
			idx = len(floors) - 1
			floorIndex[row.FloorID] = idx
		}
		if row.RoomID != nil {
			floors[idx].Rooms = append(floors[idx].Rooms, RoomMapItem{
				RoomID:     *row.RoomID,
				RoomName:   row.RoomName,
				X:          row.X,
				Y:          row.Y,
				Width:      row.Width,
				Height:     row.Height,
				AssetCount: row.AssetCount,
			})
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(floors)
}
