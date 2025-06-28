package db

import (
	"github.com/mortal-coders/think-side/internal/model"
	"gorm.io/gorm"
	"log"
)

func Migrate(database *gorm.DB) {
	err := database.AutoMigrate(&model.Idea{}, &model.Prop{}, &model.Category{})
	if err != nil {
		log.Fatal("Failed to migrate database: ", err)
	}
}
