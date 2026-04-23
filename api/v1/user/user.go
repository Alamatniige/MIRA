package user

import (
	"time"

	"gorm.io/datatypes"
)

// User struct mirrors the 'users' table in Drizzle schema
// User struct mirrors the 'users' table
type User struct {
	ID          string     `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Email       string     `json:"email" gorm:"unique;not null"`
	FullName    string     `json:"fullName" gorm:"column:fullName;not null"`
	Password    string     `json:"-" gorm:"not null"`
	Department  string     `json:"department" gorm:"not null"`
	RoleID      string     `json:"roleId" gorm:"column:roleId;type:smallint;not null"`
	PhoneNumber string     `json:"phoneNumber" gorm:"column:phoneNumber;not null"`
	Status      string     `json:"status" gorm:"column:status;default:active;not null"`
	AvatarUrl   *string    `json:"avatarUrl" gorm:"column:avatarUrl"`
	LastActive      *time.Time `json:"lastActive" gorm:"column:lastActive"`
	CurrentSessionID *string    `json:"currentSessionId" gorm:"column:currentSessionId"`
	AssetsCount     int        `json:"assetsCount" gorm:"column:assetsCount;->"`
	Role            Role       `json:"role" gorm:"foreignKey:RoleID"`
	CreatedAt       time.Time  `json:"createdAt" gorm:"column:createdAt;autoCreateTime"`
}

func (User) TableName() string {
	return "users"
}

type Role struct {
	ID             string         `json:"id" gorm:"primaryKey;type:int"`
	RoleName       string         `json:"name" gorm:"column:roleName;not null"`
	PermittedPages datatypes.JSON `json:"permittedPages" gorm:"column:permittedPages;type:jsonb;default:'[]'"`
}

func (Role) TableName() string {
	return "roles"
}

type CreateUserRequest struct {
	Email       string `json:"email"`
	FullName    string `json:"fullName"`
	Department  string `json:"department"`
	RoleID      string `json:"roleId"`
	PhoneNumber string `json:"phoneNumber"`
}
