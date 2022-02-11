package model

import "time"

type Category struct {
	ID   string `json:"id" gorm:"type:varchar(255); primaryKey"`
	Name string `json:"name" gorm:"type:varchar(255); not null"`
}

type Product struct {
	ID          string          `json:"id" gorm:"type:varchar(255); primaryKey"`
	Name        string          `json:"name" gorm:"type:varchar(255); not null"`
	Images      []*ProductImage `json:"images"`
	Description string          `json:"description" gorm:"type:longtext(2000);"`
	Price       int             `json:"price" gorm:"type:bigint; not null"`
	Discount    int             `json:"discount" gorm:"type:int;"`
	Stock       int             `json:"stock" gorm:"type:int;"`
	Metadata    string          `json:"metadata" gorm:"type:varchar(255)`
	CreatedAt   time.Time       `json:"createdAt"`
	CategoryID	string			`json:"categoryId" gorm:"size:191"`
	Category    *Category       `json:"category"`
	ShopID		string			`json:"shopId" gorm:"size:191"`
	Shop        *Shop           `json:"shop"`
}

type ProductImage struct {
	ID      	string   	`json:"id" gorm:"type:varchar(255); primaryKey"`
	ProductID 	string 		`json:"productId" gorm:"size:191"`
	Product 	*Product 	`json:"product"`
	Image   	string   	`json:"image" gorm:"type:varchar(255);"`
}

