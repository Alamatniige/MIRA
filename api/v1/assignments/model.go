package assignment

import "time"

type Assignment struct {
	ID           string    `json:"id"`
	AssetID      string    `json:"assetId"`
	UserID       string    `json:"userId"`
	AssignedDate time.Time `json:"assignedDate"`
	ReturnedDate time.Time `json:"returnedDate"`
	Acknowledged bool      `json:"acknowledged"`
}
