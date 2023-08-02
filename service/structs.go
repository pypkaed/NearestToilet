package service

type Coords struct {
	Latitude  float32 `json:"lat"`
	Longitude float32 `json:"lon"`
}

type Toilet struct {
	Latitude  float32           `json:"lat"`
	Longitude float32           `json:"lon"`
	Tags      map[string]string `json:"tags"`
}
