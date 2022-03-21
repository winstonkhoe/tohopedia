// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type ChatSenderReceiver interface {
	IsChatSenderReceiver()
}

type AuthOps struct {
	Login    interface{} `json:"login"`
	Register interface{} `json:"register"`
}

type NewAddress struct {
	Label      string `json:"label"`
	Receiver   string `json:"receiver"`
	Phone      string `json:"phone"`
	City       string `json:"city"`
	PostalCode string `json:"postalCode"`
	Address    string `json:"address"`
}

type NewCart struct {
	ProductID string  `json:"productId"`
	Quantity  int     `json:"quantity"`
	Note      *string `json:"note"`
}

type NewCoupon struct {
	Code           string `json:"code"`
	Discount       int    `json:"discount"`
	MinimumPayment int    `json:"minimumPayment"`
	MaxDiscount    int    `json:"maxDiscount"`
}

type NewProduct struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Price       int      `json:"price"`
	Stock       int      `json:"stock"`
	Discount    int      `json:"discount"`
	Metadata    *string  `json:"metadata"`
	CategoryID  string   `json:"categoryId"`
	Images      []string `json:"images"`
}

type NewReview struct {
	TransactionDetailID string    `json:"transactionDetailId"`
	ShopID              string    `json:"shopId"`
	Rating              int       `json:"rating"`
	Message             *string   `json:"message"`
	Anonymous           bool      `json:"anonymous"`
	Images              []*string `json:"images"`
}

type NewShipment struct {
	Name           string `json:"name"`
	Duration       int    `json:"duration"`
	ShipmentTypeID string `json:"shipmentTypeId"`
	Price          int    `json:"price"`
}

type NewShop struct {
	Name       string `json:"name"`
	Slug       string `json:"slug"`
	Phone      string `json:"phone"`
	City       string `json:"city"`
	PostalCode string `json:"postalCode"`
	Address    string `json:"address"`
}

type NewTransaction struct {
	AddressID  string   `json:"addressId"`
	ShipmentID string   `json:"shipmentId"`
	ShopID     string   `json:"shopId"`
	ProductIds []string `json:"productIds"`
	Quantity   []int    `json:"quantity"`
	Method     string   `json:"method"`
	CouponID   *string  `json:"couponId"`
	Total      int      `json:"total"`
}

type NewTransactionDetail struct {
	TransactionHeaderID string `json:"transactionHeaderId"`
	ProductID           string `json:"productId"`
	Quantity            int    `json:"quantity"`
}

type NewUser struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type NewWishlist struct {
	ProductID string `json:"productId"`
}
