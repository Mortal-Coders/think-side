package model

type Category struct {
	ID         string `gorm:"primaryKey"`
	LeftLabel  string
	RightLabel string

	Ideas []Idea `gorm:"foreignKey:CategoryID"`
}
