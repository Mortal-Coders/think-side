package repository

import (
	"github.com/mortal-coders/think-side/internal/model"
	"gorm.io/gorm"
)

type CategoryRepository interface {
	Create(category *model.Category) error
	List() ([]model.Category, error)
	GetByID(id string) (*model.Category, error)
}

type categoryRepo struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) CategoryRepository {
	return &categoryRepo{db: db}
}

func (r *categoryRepo) Create(category *model.Category) error {
	return r.db.Create(category).Error
}

func (r *categoryRepo) List() ([]model.Category, error) {
	var categories []model.Category
	err := r.db.Find(&categories).Error
	return categories, err
}

func (r *categoryRepo) GetByID(id string) (*model.Category, error) {
	var category model.Category
	err := r.db.First(&category, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}
