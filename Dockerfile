FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main ./cmd/server/main.go


FROM alpine:latest
WORKDIR /app

COPY --from=builder /app/main .
COPY web ./web

ENV DATABASE_URL='host=database-server user=postgres password=* dbname=think_side port=5432 sslmode=disable'
EXPOSE 8080

CMD ["./main"]
