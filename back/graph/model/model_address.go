package model

type Address struct {
	ID         string `json:"id"`
	Label      string `json:"label"`
	Receiver   string `json:"receiver"`
	Phone      string `json:"phone"`
	City       string `json:"city"`
	PostalCode string `json:"postalCode"`
	Address    string `json:"address"`
	UserId	   string `json:"userId" gorm:"size:191"`	
	User       *User  `json:"user"`
}
