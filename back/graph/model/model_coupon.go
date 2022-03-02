package model

type Coupon struct {
	ID             string `json:"id"`
	Code           string `json:"code"`
	Discount       int    `json:"discount"`
	MinimumPayment int    `json:"minimumPayment"`
	MaxDiscount    int    `json:"maxDiscount"`
	ShopId           string  `json:"shopId" gorm:"size:191"`
	Shop           *Shop  `json:"shop"`
}