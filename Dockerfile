FROM golang:1.20

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . ./

RUN GOOS=linux go build -o app main.go

EXPOSE 3000

CMD ["./app"]