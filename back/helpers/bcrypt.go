package helpers

import "golang.org/x/crypto/bcrypt"

func HashPassword(s string) string {
	hashed, _ := bcrypt.GenerateFromPassword([]byte(s), bcrypt.DefaultCost)
	return string(hashed)
}

func ComparePassword(hashed string, normal string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hashed), []byte(normal)) == nil
}