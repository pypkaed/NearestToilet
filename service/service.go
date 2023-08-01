package service

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
)

var radius float32
var osmUrl string

func init() {
	radius = 2000
	osmUrl = "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
}

func ChangeRadius(rad float32) {
	radius = rad
}

func GetNearestToilets(lat float32, lon float32) []Toilet {
	// overpass api query
	query := fmt.Sprintf(`
	[out:json];
	node["amenity"="toilets"](around:%f,%f,%f);
	out;`,
		radius, lat, lon)

	response := sendRequest(osmUrl, query)

	return parseToilets(response)
}

func parseToilets(res *http.Response) []Toilet {
	defer res.Body.Close()

	var data struct {
		Elements []Toilet `json:"elements"`
	}

	_ = json.NewDecoder(res.Body).Decode(&data)

	return data.Elements
}

func sendRequest(baseUrl string, query string) *http.Response {
	fullQuery := constructQuery(baseUrl, query)

	response, err := http.Get(fullQuery)
	handleErr(err)

	return response
}

func constructQuery(baseUrl string, query string) string {
	fullQuery, err := url.Parse(baseUrl)
	handleErr(err)

	params := url.Values{}
	params.Add("data", query)
	fullQuery.RawQuery = params.Encode()

	fmt.Println("Sending request to ", fullQuery)

	return fullQuery.String()
}

func handleErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
