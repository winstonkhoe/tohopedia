package model

import "time"


// type Transaction struct {
// 	ID       string               `json:"id"`
// 	Details  []*TransactionDetail `json:"details"`
// 	Address  *Address             `json:"address"`
// 	Shipment *Shipment            `json:"shipment"`
// 	User     *User                `json:"user"`
// 	Coupon   *TransactionCoupon   `json:"coupon"`
// 	Date     time.Time            `json:"date"`
// 	Status   int                  `json:"status"`
// }
type Transaction struct {
	ID         string               `json:"id"`
	Details    []*TransactionDetail `json:"details"`
	AddressId  string               `json:"addressId" gorm:"size:191"`
	Address    *Address             `json:"address"`
	ShipmentId string               `json:"shipmentId" gorm:"size:191"`
	Shipment   *Shipment            `json:"shipment"`
	ShopId     string               `json:"shopId" gorm:"size:191"`
	Shop       *Shop                `json:"shop"`
	UserId     string               `json:"userId" gorm:"size:191"`
	User       *User                `json:"user"`
	TransactionCoupon     *TransactionCoupon   `json:"coupon"`
	Date       time.Time            `json:"date"`
	Status     int                  `json:"status"`
}

type TransactionDetail struct {
	ID                  string       `json:"id"`
	TransactionId string       `json:"transactionId" gorm:"size:191"`
	Transaction   *Transaction `json:"transaction"`
	ProductId           string       `json:"productId" gorm:"size:191"`
	Product             *Product     `json:"product"`
	Quantity            int          `json:"quantity"`
}

type TransactionCoupon struct {
	ID     string  `json:"id"`
	TransactionId string       `json:"transactionId" gorm:"size:191"`
	Transaction   *Transaction `json:"transaction"`
	CouponId           string       `json:"couponId" gorm:"size:191"`
	Coupon *Coupon `json:"coupon"`
}
// type TransactionCoupon struct {
// 	ID                string       `json:"id"`
// 	TransactionHeader *Transaction `json:"transactionHeader"`
// 	Coupon            *Coupon      `json:"coupon"`
// }

// type TransactionDetail struct {
// 	ID                string       `json:"id"`
// 	TransactionHeader *Transaction `json:"transactionHeader"`
// 	Product           *Product     `json:"product"`
// 	Quantity          int          `json:"quantity"`
// }

type Ulasan struct {
	ID                	string             `json:"id"`
	TransactionDetailId string       `json:"transactionDetailId" gorm:"size:191"`
	TransactionDetail *TransactionDetail `json:"transactionDetail"`
	UserId     			string               `json:"userId" gorm:"size:191"`
	User              *User              `json:"user"`
	Rating            int                `json:"rating"`
	Message           *string            `json:"message"`
	Anonymous         bool               `json:"anonymous"`
}
