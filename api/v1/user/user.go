package user

import "time"

// User struct mirrors the 'users' table in Drizzle schema
type User struct {
	ID         string    `json:"id" mapstructure:"id"`
	Email      string    `json:"email" mapstructure:"email"`
	FullName   string    `json:"fullName" mapstructure:"fullName"`
	Password   string    `json:"-" mapstructure:"password"`
	Department string    `json:"department" mapstructure:"department"`
	RoleID     string    `json:"roleId" mapstructure:"roleId"`
	CreatedAt  time.Time `json:"createdAt" mapstructure:"createdAt"`
}
