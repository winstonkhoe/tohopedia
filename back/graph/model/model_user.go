package model

type User struct {
	ID           string         `json:"id"`
	Name         string         `json:"name"`
	Email        string         `json:"email"`
	Password     string         `json:"password"`
	Phone        string         `json:"phone"`
	Gender       int            `json:"gender"`
	Dob          string         `json:"dob"`
	Image        string         `json:"image"`
	Role         string         `json:"role"`
	IsSuspended  bool           `json:"isSuspended"`
	Shop         *Shop          `json:"shop"`
	Carts        []*Cart        `json:"carts"`
	Addresses    []*Address     `json:"addresses"`
	Transactions []*Transaction `json:"transactions"`
	Topay        *Topay         `json:"topay"`
}