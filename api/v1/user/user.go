package user

import "time"

// User struct mirrors the 'users' table in Drizzle schema
// User struct mirrors the 'users' table
type User struct {
	ID         string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Email      string    `json:"email" gorm:"unique;not null"`
	FullName   string    `json:"fullName" gorm:"column:fullName;not null"`
	Password   string    `json:"-" gorm:"not null"`
	Department string    `json:"department" gorm:"not null"`
	RoleID     string    `json:"roleId" gorm:"column:roleId;type:uuid;not null"`
	Role       Role      `json:"role" gorm:"foreignKey:RoleID"`
	CreatedAt  time.Time `json:"createdAt" gorm:"column:createdAt;autoCreateTime"`
}

func (User) TableName() string {
	return "users"
}

type Role struct {
	ID       string `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	RoleName string `json:"roleName" gorm:"column:roleName;not null"`
}

func (Role) TableName() string {
	return "roles"
}

type CreateUserRequest struct {
	Email      string `json:"email"`
	FullName   string `json:"fullName"`
	Department string `json:"department"`
	RoleID     string `json:"roleId"`
}
