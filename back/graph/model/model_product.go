package model

import "time"

type Category struct {
	ID   		string 		`json:"id"`
	Name 		string 		`json:"name"`
	Products    []*Product 	`json:"products"`
}

type Product struct {
	ID          string          `json:"id"`
	OriginalID	string			`json:"originalID"`
	Name        string          `json:"name"`
	Images      []*ProductImage `json:"images"`
	Description string          `json:"description"`
	Price       int             `json:"price"`
	Discount    int             `json:"discount"`
	Stock       int             `json:"stock"`
	Metadata    string          `json:"metadata"`
	CreatedAt   time.Time       `json:"createdAt"`
	ValidTo		time.Time		`json:"validTo"`
	CategoryID	string			`json:"categoryID" gorm:"size:191"`
	Category    *Category       `json:"category"`
	ShopID		string			`json:"shopID" gorm:"size:191"`
	Shop        *Shop           `json:"shop"`
}

type ProductImage struct {
	ID      	string   	`json:"id"`
	ProductID 	string 		`json:"productId" gorm:"size:191"`
	Product 	*Product 	`json:"product"`
	Image   	string   	`json:"image"`
}

