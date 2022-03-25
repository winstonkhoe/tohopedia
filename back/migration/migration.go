package migration

import (
	"tohopedia/config"
	"tohopedia/graph/model"
)

func MigrateTable() {
	db := config.GetDB()

	// err := db.AutoMigrate(&model.Shop{})
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// db.AutoMigrate(&model.User{})
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// db.AutoMigrate(&model.Category{})
	// db.AutoMigrate(&model.Reksadana{})
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// db.AutoMigrate(&model.Product{})
	// db.AutoMigrate(&model.ProductImage{})
	// db.AutoMigrate(&model.Cart{})
	// db.AutoMigrate(&model.Wishlist{})
	// db.AutoMigrate(&model.Address{})
	db.AutoMigrate(&model.ShipmentType{})
	db.AutoMigrate(&model.Shipment{})
	db.AutoMigrate(&model.Coupon{})
	db.AutoMigrate(&model.Transaction{})
	db.AutoMigrate(&model.TransactionDetail{})
	db.AutoMigrate(&model.TransactionCoupon{})
	// fmt.Println(err)
	db.AutoMigrate(&model.Review{})
	db.AutoMigrate(&model.Topay{})
	db.AutoMigrate(&model.TopayToken{})
	db.AutoMigrate(&model.UserPreferences{})
	// db.AutoMigrate(&model.Chat{})
	
	db.AutoMigrate(&model.ChatHeader{})
	db.AutoMigrate(&model.ChatDetails{})
	db.AutoMigrate(&model.EmailToken{})
	db.AutoMigrate(&model.PasswordToken{})
	db.AutoMigrate(&model.ReviewImage{})
	
}