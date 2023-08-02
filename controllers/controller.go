package controllers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"log"
	"nearestToilet/service"
	"net/http"
	"strconv"
)

func Main(resp http.ResponseWriter, req *http.Request) {
	http.Redirect(resp, req, "/toilets", http.StatusPermanentRedirect)
}

func GetNearestToilets(resp http.ResponseWriter, req *http.Request) {
	resp.Header().Set("Content-Type", "application/json")
	resp.Header().Set("Access-Control-Allow-Methods", "GET")

	params := mux.Vars(req)

	var latitude, _ = strconv.ParseFloat(params["lat"], 32)
	var longitude, _ = strconv.ParseFloat(params["lon"], 32)

	toilets := service.GetNearestToilets(
		float32(latitude),
		float32(longitude))

	err := json.NewEncoder(resp).Encode(toilets)
	handleErr(err)
}

func handleErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
