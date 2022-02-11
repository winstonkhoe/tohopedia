package model

type Cart struct {
	ID       	string  	`json:"id" gorm:"type:varchar(255); primaryKey"`
	ProductID  	string 		`json:"productId" gorm:"size:191"`
	Product  	*Product 	`json:"product"`
	Quantity 	int      	`json:"quantity" gorm:"type:int; not null"`
}