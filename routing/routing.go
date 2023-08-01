package routing

import (
	"github.com/gorilla/mux"
	"nearestToilet/controllers"
)

func Router() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/", controllers.Main)
	router.HandleFunc("/toilets", controllers.GetNearestToilets).Methods("GET")

	return router
}
