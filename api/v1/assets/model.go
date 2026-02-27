package asset

import "time"

// Asset struct mirrors the 'assets' table
type Asset struct {
	ID            string     `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	AssetName     string     `json:"assetName" gorm:"column:assetName;not null"`
	AssetType     *int       `json:"assetType" gorm:"column:assetType;type:integer;null"`
	AssetTypeRel  *AssetType `json:"assetTypeRel,omitempty" gorm:"foreignKey:AssetType;references:ID"`
	SerialNumber  string     `json:"serialNumber" gorm:"column:serialNumber;not null"`
	Specification string     `json:"specification" gorm:"not null"`
	Location      string     `json:"location" gorm:"not null"`
	CurrentStatus string     `json:"currentStatus" gorm:"column:currentStatus;not null"`
	IsAssigned    bool       `json:"isAssigned" gorm:"column:isAssigned;default:false;not null"`
	CreatedAt     time.Time  `json:"createdAt" gorm:"column:createdAt;autoCreateTime"`
}

type AssetType struct {
	ID   int    `json:"id" gorm:"primaryKey"`
	Name string `json:"name" gorm:"not null"`
}

func (AssetType) TableName() string {
	return "assetType"
}

type CreateAssetRequest struct {
	AssetName     string `json:"assetName"`
	AssetType     *int   `json:"assetType"`
	SerialNumber  string `json:"serialNumber"`
	Specification string `json:"specification"`
	Location      string `json:"location"`
	CurrentStatus string `json:"currentStatus"`
}

type CreateAssetTypeRequest struct {
	Name string `json:"name"`
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
