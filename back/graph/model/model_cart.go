package model

type Cart struct {
	ID       	string  	`json:"id"`
	ProductID  	string 		`json:"productId" gorm:"size:191"`
	Product  	*Product 	`json:"product"`
	UserId		string		`json:"userId" gorm:"size:191"`
	User		*User		`json:"user"`
	Quantity 	int      	`json:"quantity"`
}