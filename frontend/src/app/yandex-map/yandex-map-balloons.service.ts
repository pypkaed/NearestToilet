import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class YandexMapBalloonsService {
  private map: any;
  private ymaps: any;
  public buttonClicked = new Subject<{lat: number; lon: number}>();

  constructor() { }

  public setMap(map: any, ymaps: any) {
    this.map = map;
    this.ymaps = ymaps;
  }

  public onClickEvent(e: any) {
    const coords = e.get('coords');
    const lat: number = coords[0];
    const lon: number = coords[1];

    const balloonContent = `<button id="find-toilets-button">НАЙДИ СРАЛЬНИК</button>`

    this.map.balloon.open(coords, {
      contentBody: balloonContent
    });

    /*
     * add global event listener because the balloon is
     * outside of Angular's scope
    */
    this.addClickEventListener(lat, lon);
  }

  private onButtonClicked(lat: number, lon: number) {
    // clear previous output
    this.map.geoObjects.removeAll();

    this.buttonClicked.next({ lat, lon });

    this.map.geoObjects.add(
      new this.ymaps.Placemark(
        [lat, lon], {
          balloonContent: "Я НЕРЕАЛЬНО ХОЧУ СРАТЬ"
        },
        {
          iconColor: 'red'
        }));

    this.map.balloon.close();
  }

  private addClickEventListener(lat: number, lon: number) {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.id === 'find-toilets-button') {
        this.onButtonClicked(lat, lon);
      }
    }

    document.addEventListener('click', handleClick);

    this.map.balloon.events.add('close', () => {
      document.removeEventListener('click', handleClick)
    })
  }
}
