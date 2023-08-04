import { Injectable } from '@angular/core';
import { ToiletModel } from "../../assets/toilet.model";
import { Subject } from "rxjs";

declare const ymaps: any;

@Injectable({
  providedIn: 'root'
})
export class YandexMapService {
  map!: any;
  geoObjects!: any;

  constructor() { }

  loadMap() {
    // load Yandex Maps API and then initialize the map
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=388abf98-82fb-4cf2-b914-9fc28c8886c0&lang=en_US';
    script.async = true;

    script.onload = () => {
      console.log("script loaded")
      ymaps.ready(() => this.initMap());
    }

    document.body.appendChild(script);
  }

  public buttonClicked = new Subject<{lat: number; lon: number}>();

  private initMap(): void {
    this.map = new ymaps.Map('yandexMap', {
      // TODO: allow location; if not, then default
      center: [55.751244, 37.618423],
      zoom: 15
    });

    this.geoObjects = new ymaps.GeoObjectCollection();

    // add search through find panel
    let searchControl = new ymaps.control.SearchControl({
      options: {
        provider: 'yandex#search'
      }
    });
    this.map.controls.add(searchControl);

    // add search through click
    this.map.events.add('click', (e: any) => {
      this.onClickEvent(e);
    })
  }

  private onButtonClicked(lat: number, lon: number) {
    this.buttonClicked.next({ lat, lon });

    this.map.balloon.close();
  }

  public onClickEvent(e: any) {
    const coords = e.get('coords');
    const lat: number = coords[0];
    const lon: number = coords[1];

    const balloonContent = `<button id="find-toilets-button">НАЙДИ СРАЛЬНИК</button>`

    this.map.balloon.open(coords, {
      contentBody: balloonContent
    });

    // add global event listener because it's outside Angular's scope
    this.addClickEventListener(lat, lon);
  }

  public showToiletPoints(toilets: ToiletModel[]) {
    // clear previous output
    this.map.geoObjects.removeAll();

    this.geoObjects = this.getNearestToilets(toilets);
    this.map.geoObjects.add(this.geoObjects)

    console.log("mapped the points")
  }

  private getNearestToilets(toilets: ToiletModel[]) {
    const nearestToilets = ymaps.GeoObjectCollection();

    const toiletsNum = toilets.length < 10 ? toilets.length : 10;

    // TODO: show NEAREST toilets, not first ones lol
    for (let i = 0; i < toiletsNum; i++) {
      const toilet = toilets[i];

      nearestToilets.add(new ymaps.Placemark(
        [toilet.lat, toilet.lon],
        { balloonContentBody: JSON.stringify(toilet.tags) }
      ))
    }

    return nearestToilets;
  }

  private addClickEventListener(lat: number, lon: number) {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.id === 'find-toilets-button') {
        this.onButtonClicked(lat, lon);
      }
    }

    document.addEventListener('click', handleClick);

    this.map.balloon.events.add('userclose', () => {
      document.removeEventListener('click', handleClick)
    })
  }
}
