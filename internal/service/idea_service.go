package service

import (
	"github.com/mortal-coders/think-side/internal/model"
	"github.com/mortal-coders/think-side/internal/repository"
)

type IdeaService interface {
	CreateIdea(*model.Idea) error
	GetIdea(string) (*model.Idea, error)
	AddProp(string, *model.Prop) error
}

type ideaService struct {
	repo repository.IdeaRepository
}

func NewIdeaService(r repository.IdeaRepository) IdeaService {
	return &ideaService{repo: r}
}

func (s *ideaService) CreateIdea(i *model.Idea) error {
	return s.repo.Create(i)
}

func (s *ideaService) GetIdea(id string) (*model.Idea, error) {
	return s.repo.GetByID(id)
}

func (s *ideaService) AddProp(id string, p *model.Prop) error {
	return s.repo.AddProp(id, p)
}
