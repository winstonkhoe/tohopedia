package model

type User struct {
	ID    		string 	   `json:"id" gorm:"type:varchar(255); primaryKey"`
	Name  		string 	   `json:"name" gorm:"type:varchar(100); not null"`
	Email 		string 	   `json:"email" gorm:"type:varchar(100); not null"`
	Password 	string 	   `json:"password" gorm:"type:varchar(100); not null"`
	Phone       string     `json:"phone"`
	Gender      string     `json:"gender"`
	Dob         string     `json:"dob"`
	ProfilePic  string     `json:"profilePic"`
	Role        string     `json:"role"`
	IsSuspended bool       `json:"isSuspended"`
	ShopID		string	   `json:"shopId" gorm:"size:191"`
	Shop        *Shop      `json:"shop"`
	Carts       []*Cart    `json:"carts"`
	Addresses   []*Address `json:"addresses"`
}