package service

type Coords struct {
	Latitude  float32 `json:"latitude"`
	Longitude float32 `json:"longitude"`
}

type Toilet struct {
	//Name   string `json:"name"`
	//Coords Coords `json:"coords"`
	Type      string            `json:"type"`
	Id        int               `json:"id"`
	Latitude  float32           `json:"lat"`
	Longitude float32           `json:"lon"`
	Tags      map[string]string `json:"tags""`
}
