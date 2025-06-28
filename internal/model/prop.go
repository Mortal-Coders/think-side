package model

type Prop struct {
	ID      string `gorm:"primaryKey"`
	Content string
	IdeaID  string // Foreign key back to Idea
	IsPro   bool   // true = Pro, false = Con
}
