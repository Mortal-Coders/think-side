package main

import (
	"github.com/mortal-coders/think-side/internal/db"
	"log"
	"os"
)

func main() {

	dsn := os.Getenv("DATABASE_URL")
	log.Println("Connecting to database:", dsn)
	database := db.NewConnection(dsn)
	db.Migrate(database)
}
