package main

import (
	"github.com/fasthttp/router"
	"github.com/mortal-coders/think-side/internal/db"
	"github.com/mortal-coders/think-side/internal/handler"
	"github.com/mortal-coders/think-side/internal/repository"
	"github.com/mortal-coders/think-side/internal/service"
	"github.com/valyala/fasthttp"
	"log"
	"os"
)

func main() {

	dsn := os.Getenv("DATABASE_URL")
	log.Println("Connecting to database:", dsn)
	database := db.NewConnection(dsn)
	db.Migrate(database)

	r := router.New()

	idea := handler.NewIdeaHandler(service.NewIdeaService(repository.NewIdeaRepository(database)))
	category := handler.NewCategoryHandler(service.NewCategoryService(repository.NewCategoryRepository(database)))

	r.POST("/ideas", idea.Create)
	r.GET("/ideas/{id}", idea.GetIdea)
	r.POST("/ideas/{id}/prop", idea.AddProp)

	r.POST("/categories", category.Create)
	r.GET("/categories", category.List)
	r.GET("/categories/{id}", category.Get)

	err := fasthttp.ListenAndServe(":8080", r.Handler)
	if err != nil {
		log.Fatal(err)
	}
}
