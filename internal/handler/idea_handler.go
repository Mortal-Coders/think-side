package handler

import (
	"encoding/json"
	"github.com/mortal-coders/think-side/internal/model"
	"github.com/mortal-coders/think-side/internal/service"
	"github.com/valyala/fasthttp"
	"time"
)

type IdeaHandler struct {
	svc     service.IdeaService
	encoder service.Encoder
}

func NewIdeaHandler(s service.IdeaService, e service.Encoder) *IdeaHandler {
	return &IdeaHandler{svc: s, encoder: e}
}

func (h *IdeaHandler) Create(ctx *fasthttp.RequestCtx) {
	var input model.Idea
	if err := json.Unmarshal(ctx.PostBody(), &input); err != nil {
		ctx.SetStatusCode(fasthttp.StatusBadRequest)
		ctx.SetBodyString("Bad Request")
		return
	}

	input.ID, _ = h.encoder.Encode(time.Now().UnixNano())

	if err := h.svc.CreateIdea(&input); err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Could not save")
		return
	}

	ctx.SetStatusCode(fasthttp.StatusCreated)
	resp, _ := json.Marshal(input)
	ctx.SetBody(resp)
}

func (h *IdeaHandler) GetIdea(ctx *fasthttp.RequestCtx) {
	id := ctx.UserValue("id").(string)

	idea, err := h.svc.GetIdea(id)
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusNotFound)
		ctx.SetBodyString("Idea not found")
		return
	}

	resp, err := json.Marshal(idea)
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Error encoding response")
		return
	}

	ctx.SetContentType("application/json")
	ctx.SetStatusCode(fasthttp.StatusOK)
	ctx.SetBody(resp)
}

func (h *IdeaHandler) AddProp(ctx *fasthttp.RequestCtx) {
	id := ctx.UserValue("id").(string)

	var prop model.Prop
	if err := json.Unmarshal(ctx.PostBody(), &prop); err != nil {
		ctx.SetStatusCode(fasthttp.StatusBadRequest)
		ctx.SetBodyString("Invalid JSON")
		return
	}

	// Güvenlik: ID'yi dışarıdan alıyoruz, override edelim
	prop.IdeaID = id
	prop.ID, _ = h.encoder.Encode(time.Now().UnixMilli())

	if err := h.svc.AddProp(prop.ID, &prop); err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Could not add prop")
		return
	}

	ctx.SetStatusCode(fasthttp.StatusCreated)
	ctx.SetBodyString("Prop added")
}
