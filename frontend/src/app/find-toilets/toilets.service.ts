import { Injectable } from '@angular/core';
import { ToiletModel } from "../../assets/toilet.model";
import { ToiletsMathService } from "./toilets-math.service";

const MAX_TOILET_POINTS = 20;

@Injectable({
  providedIn: 'root'
})
export class ToiletsService {

  constructor(
    private toiletsMathService: ToiletsMathService,
  ) { }

  public getNearestToilets(ymaps: any, searchPoint: any, toilets: ToiletModel[]) {

    const nearestToilets = new ymaps.GeoObjectCollection();

    toilets.sort((a, b): number => {
      return this.toiletsMathService.compareToiletDistance(searchPoint, a, b);
    });

    const toiletsNum = toilets.length < MAX_TOILET_POINTS
      ? toilets.length
      : MAX_TOILET_POINTS;

    for (let i = 0; i < toiletsNum; i++) {
      const toilet = toilets[i];

      nearestToilets.add(new ymaps.Placemark(
        [toilet.lat, toilet.lon],
        { balloonContentBody: this.getToiletInfo(toilet) }
      ))
    }

    return nearestToilets;
  }

  // TODO: здесь можно сделать красивые баллуны :)
  private getToiletInfo(toilet: ToiletModel): string {
    let res: string = 'Toilet info<br>';

    if (!toilet.tags) {
      res += 'none';
      return res;
    }
    for (const [key, value] of Object.entries(toilet.tags)) {
      res += `${key}: ${value}<br>`
    }

    return res;
  }
}
