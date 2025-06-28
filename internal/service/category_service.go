package service

import (
	"github.com/mortal-coders/think-side/internal/model"
	"github.com/mortal-coders/think-side/internal/repository"
)

type CategoryService interface {
	CreateCategory(*model.Category) error
	ListCategories() ([]model.Category, error)
	GetCategoryByID(id string) (*model.Category, error)
}

type categoryService struct {
	repo repository.CategoryRepository
}

func NewCategoryService(r repository.CategoryRepository) CategoryService {
	return &categoryService{repo: r}
}

func (s *categoryService) CreateCategory(c *model.Category) error {
	return s.repo.Create(c)
}

func (s *categoryService) ListCategories() ([]model.Category, error) {
	return s.repo.List()
}

func (s *categoryService) GetCategoryByID(id string) (*model.Category, error) {
	return s.repo.GetByID(id)
}
