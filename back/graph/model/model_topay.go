package model

import "time"

type Topay struct {
	ID      string `json:"id"`
	UserId    string    `json:"userId" gorm:"size:191"`
	User    *User  `json:"user"`
	Balance int    `json:"balance"`
	Coin    int    `json:"coin"`
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