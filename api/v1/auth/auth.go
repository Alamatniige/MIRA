package auth

import "time"

type Auth struct {
	ID        string    `json:"id" mapstructure:"id"`
	Email     string    `json:"email" mapstructure:"email"`
	Password  string    `json:"-" mapstructure:"password"`
	CreatedAt time.Time `json:"created_at" mapstructure:"createdAt"`
}
