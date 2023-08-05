import { Injectable } from '@angular/core';
import { ToiletModel } from "../../assets/toilet.model";
import { ToiletsService } from "../find-toilets/toilets.service";
import { YandexMapBalloonsService } from "./yandex-map-balloons.service";

declare const ymaps: any;

@Injectable({
  providedIn: 'root'
})
export class YandexMapService {
  map!: any;

  constructor(
    private toiletsService: ToiletsService,
    private yandexMapBalloonsService: YandexMapBalloonsService,
  ) { }

  loadMap() {
    // load Yandex Maps API and then initialize the map
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=388abf98-82fb-4cf2-b914-9fc28c8886c0&lang=ru_RU';
    script.async = true;

    script.onload = () => {
      console.log("script loaded")
      ymaps.ready(() => this.initMap());
    }

    document.body.appendChild(script);
  }

  private initMap(): void {
    this.map = new ymaps.Map('yandexMap', {
      center: [59.9386, 30.3141], // St. Petersburg
      zoom: 15
    });

    this.yandexMapBalloonsService.setMap(this.map, ymaps);
    this.map.events.add('click', (e: any) => {
      this.yandexMapBalloonsService.onClickEvent(e);
    })
  }

  public showNearestToiletPoints(searchPoint: any, toilets: ToiletModel[]) {
    const nearestToilets = this.toiletsService.getNearestToilets(ymaps, searchPoint, toilets);
    this.map.geoObjects.add(nearestToilets);

    console.log("mapped the points")
  }
}
