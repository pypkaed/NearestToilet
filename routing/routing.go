package routing

import (
	"github.com/gorilla/mux"
	"nearestToilet/controllers"
	"net/http"
)

func Router() *mux.Router {
	router := mux.NewRouter()

	router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			enableCORS(&w, "http://localhost:4200")
			next.ServeHTTP(w, r)
		})
	})

	router.HandleFunc("/", controllers.Main)
	router.HandleFunc("/toilets", controllers.GetNearestToilets).Methods("GET").Queries("lat", "{lat}", "lon", "{lon}")

	return router
}

func enableCORS(w *http.ResponseWriter, origin string) {
	(*w).Header().Set("Access-Control-Allow-Origin", origin)
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}
