package handler

import (
	"github.com/mortal-coders/think-side/internal/model"
	"github.com/mortal-coders/think-side/internal/service"
	"github.com/valyala/fasthttp"
	"html/template"
)

type PageHandler struct {
	svc             service.IdeaService
	categoryService service.CategoryService
	tmpl            *template.Template
}

func NewPageHandler(svc service.IdeaService, category service.CategoryService) *PageHandler {
	tmpl := template.Must(template.ParseFiles("./web/templates/index.html"))
	return &PageHandler{svc: svc, tmpl: tmpl, categoryService: category}
}

func (h *PageHandler) ServeIdeaPage(ctx *fasthttp.RequestCtx) {
	var idea *model.Idea
	idRaw := ctx.UserValue("id")
	categories, _ := h.categoryService.ListCategories()

	if idRaw != nil {
		id := idRaw.(string)
		found, err := h.svc.GetIdea(id)
		if err == nil {
			idea = found // varsa gösterilecek veri bu
		} else {
			idea = h.emptyIdea()
		}
	} else {
		idea = h.emptyIdea()
	}

	ctx.Response.Header.SetContentType("text/html; charset=utf-8")
	h.tmpl.Execute(ctx.Response.BodyWriter(), map[string]any{
		"Idea":       idea,
		"Categories": categories,
	})
}

func (h *PageHandler) emptyIdea() *model.Idea {
	return &model.Idea{
		Title:    "",
		Pros:     []model.Prop{},
		Cons:     []model.Prop{},
		Category: model.Category{ID: "arti/eksi", LeftLabel: "Artılar", RightLabel: "Eksiler"},
	}
}
