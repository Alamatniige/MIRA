package main

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	// Replace "YourNewPassword" with your desired password
	hash, _ := bcrypt.GenerateFromPassword([]byte("Admin123!"), 12)
	fmt.Println(string(hash))
}
