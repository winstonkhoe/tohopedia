package migration

import (
	"tohopedia/config"
	"tohopedia/graph/model"
)

func MigrateTable() {
	db := config.GetDB()

	db.AutoMigrate(&model.User{})
}