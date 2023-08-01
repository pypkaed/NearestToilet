package controllers

import (
	"encoding/json"
	"log"
	"nearestToilet/service"
	"net/http"
)

func Main(resp http.ResponseWriter, req *http.Request) {
	resp.Write([]byte(`asshole`))
}

func GetNearestToilets(resp http.ResponseWriter, req *http.Request) {
	resp.Header().Set("Content-Type", "application/json")
	resp.Header().Set("Access-Control-Allow-Methods", "GET")

	var inputCoords service.Coords
	err := json.NewDecoder(req.Body).Decode(&inputCoords)
	handleErr(err)

	toilets := service.GetNearestToilets(inputCoords.Latitude, inputCoords.Longitude)
	json.NewEncoder(resp).Encode(toilets)
}

func handleErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
