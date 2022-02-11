package model

import "time"

type Shop struct {
	ID              string     `json:"id" gorm:"type:varchar(255); primaryKey"`
	Name            string     `json:"name" gorm:"type:varchar(100); not null"`
	Slug            string     `json:"slug" gorm:"type:varchar(100); not null"`
	Phone           string     `json:"phone" gorm:"type:varchar(100); not null"`
	Slogan          string     `json:"slogan" gorm:"type:varchar(100);"`
	Description     string     `json:"description" gorm:"type:varchar(100);"`
	Image           string     `json:"image" gorm:"type:varchar(255);"`
	OpenTime        time.Time  `json:"openTime"`
	CloseTime       time.Time  `json:"closeTime"`
	IsOpen          bool       `json:"isOpen" gorm:"type:boolean; not null"`
	ReputationPoint int        `json:"reputationPoint" gorm:"type:int(100); not null"`
	UserId			string	   `json:"userId" gorm:"size:191"`
	User            *User      `json:"user"`
	ProductID 		string 	   `json:"productId" gorm:"size:191"`
	Products        []*Product `json:"products"`
	City           	string     `json:"city" gorm:"type:varchar(100); not null"`
	PostalCode		string     `json:"postalCode" gorm:"type:varchar(100); not null"`
	Address         string     `json:"address" gorm:"type:varchar(100); not null"`
}