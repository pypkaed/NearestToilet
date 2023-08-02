import { Component, AfterViewInit } from '@angular/core';

declare const ymaps: any; // Declare the 'ymaps' variable

@Component({
  selector: 'app-yandex-map',
  templateUrl: './yandex-map.component.html',
  styleUrls: ['./yandex-map.component.css']
})
export class YandexMapComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
    // Load Yandex Maps API and then initialize the map
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=388abf98-82fb-4cf2-b914-9fc28c8886c0&lang=en_US';

    script.async = true;
    script.onload = () => ymaps.ready(this.initMap); // Initialize map once the API is loaded
    document.body.appendChild(script);
  }

  private initMap(): void {
    // Check if the 'ymaps' variable is available
    if (typeof ymaps === 'undefined') {
      console.error('Yandex Maps API not loaded.');
      return;
    }

    // Create the Yandex Map
    const map = new ymaps.Map('yandexMap', {
      center: [55.751244, 37.618423], // Replace with your desired center coordinates
      zoom: 10 // Adjust the zoom level as needed
    });

    // Add any other map configurations or markers as needed
    // For example:
    // const placemark = new ymaps.Placemark([55.751244, 37.618423], { hintContent: 'Hello World!' });
    // map.geoObjects.add(placemark);
  }
}
