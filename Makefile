#!/bin/bash

export DATABASE_URL=host=database-server user=postgres password=********* dbname=think_side port=5432 sslmode=enable

run:
	go run cmd/server/main.go

build:
	docker build -t think-side:v1 .

up:
	docker run --network=host -p 8080:8080 think-side:v1