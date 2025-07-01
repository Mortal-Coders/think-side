package handler

import (
	"encoding/json"
	"time"

	"github.com/mortal-coders/think-side/internal/model"
	"github.com/mortal-coders/think-side/internal/service"

	"github.com/valyala/fasthttp"
)

type CategoryHandler struct {
	svc     service.CategoryService
	encoder service.Encoder
}

func NewCategoryHandler(s service.CategoryService, e service.Encoder) *CategoryHandler {
	return &CategoryHandler{svc: s, encoder: e}
}

func (h *CategoryHandler) Create(ctx *fasthttp.RequestCtx) {
	var input model.Category
	if err := json.Unmarshal(ctx.PostBody(), &input); err != nil {
		ctx.SetStatusCode(fasthttp.StatusBadRequest)
		ctx.SetBodyString("Invalid input")
		return
	}

	input.ID, _ = h.encoder.Encode(time.Now().UnixMicro())

	if err := h.svc.CreateCategory(&input); err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Could not save category")
		return
	}

	ctx.SetStatusCode(fasthttp.StatusCreated)
	resp, _ := json.Marshal(input)
	ctx.SetBody(resp)
}

func (h *CategoryHandler) List(ctx *fasthttp.RequestCtx) {
	categories, err := h.svc.ListCategories()
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Failed to fetch categories")
		return
	}

	resp, _ := json.Marshal(categories)
	ctx.SetContentType("application/json")
	ctx.SetStatusCode(fasthttp.StatusOK)
	ctx.SetBody(resp)
}

func (h *CategoryHandler) Get(ctx *fasthttp.RequestCtx) {
	id := ctx.UserValue("id").(string)
	category, err := h.svc.GetCategoryByID(id)
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusNotFound)
		ctx.SetBodyString("Category not found")
		return
	}

	resp, _ := json.Marshal(category)
	ctx.SetContentType("application/json")
	ctx.SetStatusCode(fasthttp.StatusOK)
	ctx.SetBody(resp)
}
