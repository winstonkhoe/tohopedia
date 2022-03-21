package model

import "time"

type Reksadana struct {
	ID        string    `json:"id"`
	Price     int       `json:"price"`
	CreatedAt time.Time `json:"createdAt"`
}

