package asset

import (
	"time"
)

// Asset struct mirrors the 'assets' table
type Asset struct {
	ID            string      `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Tag           string      `json:"tag" gorm:"column:tag;not null"`
	AssetName     string      `json:"assetName" gorm:"column:assetName;not null"`
	AssetType     *int        `json:"assetType" gorm:"column:assetType;type:integer;null"`
	AssetTypeRel  *AssetType  `json:"assetTypeRel,omitempty" gorm:"foreignKey:AssetType;references:ID"`
	SerialNumber  string      `json:"serialNumber" gorm:"column:serialNumber;not null"`
	Specification string      `json:"specification" gorm:"not null"`
	Room          *int        `json:"room" gorm:"column:room;type:integer;null"`
	RoomRel       *AssetRoom  `json:"roomRel,omitempty" gorm:"foreignKey:Room;references:ID"`
	Floor         *int        `json:"floor" gorm:"column:floor;type:integer;null"`
	FloorRel      *AssetFloor `json:"floorRel,omitempty" gorm:"foreignKey:Floor;references:ID"`
	CurrentStatus    string `json:"currentStatus" gorm:"column:currentStatus;not null"`
	AssignmentStatus string `json:"assignmentStatus" gorm:"column:assignmentStatus;not null;default:Available"`
	IsAssigned       bool   `json:"isAssigned" gorm:"column:isAssigned;default:false;not null"`
	Image         []string       `json:"image" gorm:"column:image;type:jsonb;serializer:json"`
	CreatedAt     time.Time      `json:"createdAt" gorm:"column:createdAt;autoCreateTime"`
}

type AssetType struct {
	ID        int       `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"not null"`
	CreatedAt time.Time `json:"createdAt" gorm:"column:created_at;autoCreateTime"`
}

func (AssetType) TableName() string {
	return "assetType"
}

type AssetFloor struct {
	ID        int       `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"not null"`
	Level     *int      `json:"level" gorm:"column:level"`
	CreatedAt time.Time `json:"createdAt" gorm:"column:created_at;autoCreateTime"`
}

func (AssetFloor) TableName() string {
	return "assetFloor"
}

type AssetRoom struct {
	ID        int       `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"not null"`
	FloorId   *int      `json:"floorId" gorm:"column:floorId"`
	X         int       `json:"x" gorm:"column:x;default:20"`
	Y         int       `json:"y" gorm:"column:y;default:20"`
	Width     int       `json:"width" gorm:"column:width;default:100"`
	Height    int       `json:"height" gorm:"column:height;default:80"`
	CreatedAt time.Time `json:"createdAt" gorm:"column:created_at;autoCreateTime"`
}

func (AssetRoom) TableName() string {
	return "assetRoom"
}

type CreateAssetRequest struct {
	AssetName     string `json:"assetName"`
	AssetType     *int   `json:"assetType"`
	SerialNumber  string `json:"serialNumber"`
	Specification string `json:"specification"`
	Room          *int   `json:"room"`
	Floor         *int   `json:"floor"`
	Tag           string   `json:"tag"`
	CurrentStatus string   `json:"currentStatus"`
	Image         []string `json:"image"`
}

type CreateAssetTypeRequest struct {
	Name string `json:"name"`
}

type CreateAssetFloorRequest struct {
	Name  string `json:"name"`
	Level *int   `json:"level"`
}

type UpdateAssetFloorRequest struct {
	Name  *string `json:"name"`
	Level *int    `json:"level"`
}

type CreateAssetRoomRequest struct {
	Name    string `json:"name"`
	FloorId *int   `json:"floorId"`
	X       *int   `json:"x"`
	Y       *int   `json:"y"`
	Width   *int   `json:"width"`
	Height  *int   `json:"height"`
}

type UpdateAssetRoomRequest struct {
	Name    *string `json:"name"`
	FloorId *int    `json:"floorId"`
	X       *int    `json:"x"`
	Y       *int    `json:"y"`
	Width   *int    `json:"width"`
	Height  *int    `json:"height"`
}

func (Asset) TableName() string {
	return "assets"
}

type AssetStatusHistory struct {
	ID        string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	AssetID   string    `json:"assetId" gorm:"column:assetId;type:uuid;not null"`
	Status    string    `json:"status" gorm:"not null"`
	Remarks   string    `json:"remarks" gorm:"not null"`
	UpdatedBy string    `json:"updatedBy" gorm:"column:updatedBy;type:uuid;not null"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"column:updatedAt;autoCreateTime"`
}

func (AssetStatusHistory) TableName() string {
	return "assetStatusHistory"
}

type UpdateStatus struct {
	CurrentStatus string `json:"currentStatus"`
}
