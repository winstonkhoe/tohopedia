package model

import "time"

type Cart struct {
	ID        string    `json:"id"`
	ProductID string    `json:"productId" gorm:"size:191"`
	Product   *Product  `json:"product"`
	UserId    string    `json:"userId" gorm:"size:191"`
	User      *User     `json:"user"`
	Quantity  int       `json:"quantity"`
	CreatedAt time.Time `json:"createdAt"`
	Checked		bool	`json:"checked"`
}