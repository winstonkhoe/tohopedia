package model

import "time"

type EmailToken struct {
	ID       string    `json:"id"`
	UserId    string    `json:"userId" gorm:"size:191"`
	User     *User     `json:"user"`
	Email    string    `json:"email"`
	ValidTo  time.Time `json:"validTo"`
	Redeemed bool      `json:"redeemed"`
}

type PasswordToken struct {
	ID       string    `json:"id"`
	Email    string    `json:"email"`
	ValidTo  time.Time `json:"validTo"`
	Redeemed bool      `json:"redeemed"`
}

type TopayToken struct {
	ID      string    `json:"id"`
	Code    string    `json:"code"`
	UserId    string    `json:"userId" gorm:"size:191"`
	User    *User     `json:"user"`
	Value   int       `json:"value"`
	ValidTo time.Time `json:"validTo"`
	Redeemed bool     `json:"redeemed"`
}