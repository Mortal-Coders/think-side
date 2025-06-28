package model

import "time"

type Idea struct {
	ID         string `gorm:"primaryKey"`
	Title      string
	DeleteCode string
	CreatedAt  time.Time

	// Foreign Key (CategoryID)
	CategoryID string
	Category   Category `gorm:"foreignKey:CategoryID"`

	// Relations
	Pros []Prop `gorm:"foreignKey:IdeaID;where:IsPro = true"`
	Cons []Prop `gorm:"foreignKey:IdeaID;where:IsPro = false"`
}
