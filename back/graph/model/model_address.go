package model

type Address struct {
	ID         string `json:"id" gorm:"type:varchar(255); primaryKey"`
	Label      string `json:"label"  gorm:"type:varchar(255); not null"`
	Receiver   string `json:"receiver" gorm:"type:varchar(255); not null"`
	Phone      string `json:"phone" gorm:"type:varchar(255); not null"`
	City       string `json:"city" gorm:"type:varchar(255); not null"`
	PostalCode string `json:"postalCode" gorm:"type:varchar(255); not null"`
	Address    string `json:"address" gorm:"type:varchar(255); not null"`
}