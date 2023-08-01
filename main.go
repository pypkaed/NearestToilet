package main

import (
	"fmt"
	"log"
	"nearestToilet/routing"
	"net/http"
)

func main() {
	fmt.Println("Starting server")
	router := routing.Router()

	fmt.Println("Listening to http://localhost:3000")
	log.Fatal(http.ListenAndServe(":3000", router))
}
