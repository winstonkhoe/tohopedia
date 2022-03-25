package config

import (
	// "fmt"
	"io"
	"log"
	"os"
	"time"

	// "github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

var (
	db *gorm.DB
)

func GetDB() *gorm.DB {
	return db
}

func init() {
	// godotenv.Load()
	connectDatabase()
}

func connectDatabase() {
	// databaseConfig := "b1edca0b2f39e2:c095cddd@tcp(us-cdbr-east-05.cleardb.net)/heroku_2f17d7f0b02a5c2?reconnect=true"
	// databaseConfig := "b1edca0b2f39e2:c095cddd@tcp(us-cdbr-east-05.cleardb.net)/heroku_2f17d7f0b02a5c2"
	databaseConfig := "b1edca0b2f39e2:c095cddd@tcp(us-cdbr-east-05.cleardb.net)/heroku_2f17d7f0b02a5c2?charset=utf8mb4&multiStatements=true&parseTime=True"
	// databaseConfig := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?multiStatements=true&parseTime=true",
	// 	os.Getenv("DB_USERNAME"),
	// 	os.Getenv("DB_PASSWORD"),
	// 	os.Getenv("DB_HOST"),
	// 	os.Getenv("DB_PORT"),
	// 	os.Getenv("DB_DATABASE"),
	// )

	var err error
	db, err = gorm.Open(mysql.Open(databaseConfig), initConfig())

	if err != nil {
		panic("Fail To Connect Database")
	}
}

//InitConfig Initialize Config
func initConfig() *gorm.Config {
	return &gorm.Config{
		// Logger:         initLog(),
		NamingStrategy: initNamingStrategy(),
	}
}

//InitLog Connection Log Configuration
func initLog() logger.Interface {
	f, _ := os.Create("gorm.log")
	newLogger := logger.New(log.New(io.MultiWriter(f), "\r\n", log.LstdFlags), logger.Config{
		Colorful:      true,
		LogLevel:      logger.Info,
		SlowThreshold: time.Second,
	})
	return newLogger
}

//InitNamingStrategy Init NamingStrategy
func initNamingStrategy() *schema.NamingStrategy {
	return &schema.NamingStrategy{
		SingularTable: false,
		TablePrefix:   "",
	}
}