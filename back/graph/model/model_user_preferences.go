package model

type UserPreferences struct {
	ID         string    `json:"id"`
	UserId     string    `json:"userId" gorm:"size:191"`
	User       *User     `json:"user"`
	CategoryId string    `json:"categoryId" gorm:"size:191"`
	Category   *Category `json:"category"`
	Score      int       `json:"score"`
}