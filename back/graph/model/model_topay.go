package model

type Topay struct {
	ID      string `json:"id"`
	UserId    string    `json:"userId" gorm:"size:191"`
	User    *User  `json:"user"`
	Balance int    `json:"balance"`
	Coin    int    `json:"coin"`
}

