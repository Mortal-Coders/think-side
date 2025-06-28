#!/bin/bash

export DATABASE_URL=host=database-server user=postgres password=********* dbname=think_side port=5432 sslmode=enable

run:
	go run cmd/server/main.go