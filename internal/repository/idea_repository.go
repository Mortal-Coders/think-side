package repository

import (
	"github.com/mortal-coders/think-side/internal/model"
	"gorm.io/gorm"
)

type IdeaRepository interface {
	Create(idea *model.Idea) error
	GetByID(id string) (*model.Idea, error)
	AddProp(id string, prop *model.Prop) error
}

type ideaRepo struct {
	db *gorm.DB
}

func NewIdeaRepository(db *gorm.DB) IdeaRepository {
	return &ideaRepo{db: db}
}

func (i *ideaRepo) Create(idea *model.Idea) error {
	return i.db.Create(idea).Error
}

func (i *ideaRepo) GetByID(id string) (*model.Idea, error) {
	var idea model.Idea
	err := i.db.Preload("Category").Preload("Pros", "is_pro = ?", true).Preload("Cons", "is_pro = ?", false).First(&idea, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &idea, nil
}

func (i *ideaRepo) AddProp(id string, prop *model.Prop) error {
	prop.ID = id
	return i.db.Create(prop).Error
}
