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
	db.AutoMigrate(&model.User{})
	// if err != nil {
	// 	fmt.Println(err)
	// }
	db.AutoMigrate(&model.Category{})
	// if err != nil {
	// 	fmt.Println(err)
	// }
	db.AutoMigrate(&model.Product{})
	db.AutoMigrate(&model.ProductImage{})
	db.AutoMigrate(&model.Cart{})
	db.AutoMigrate(&model.Address{})
}