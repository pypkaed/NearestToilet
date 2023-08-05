import { Injectable } from '@angular/core';
import {ToiletModel} from "../../assets/toilet.model";

@Injectable({
  providedIn: 'root'
})
export class ToiletsMathService {

  constructor() { }

  public calculateDistance(searchPoint: any, toilet: ToiletModel) {
    return Math.sqrt(
      Math.pow(searchPoint.lat - toilet.lat, 2)
      + Math.pow(searchPoint.lon - toilet.lon, 2)
    );
  }
  public compareToiletDistance(searchPoint: any, a: ToiletModel, b: ToiletModel) {
    if (this.calculateDistance(searchPoint, a) > this.calculateDistance(searchPoint, b)) {
      return 1;
    }
    if (this.calculateDistance(searchPoint, a) < this.calculateDistance(searchPoint, b)) {
      return -1;
    }
    return 0;
  }
  public areCoordsCorrect(lat: number, lon: number): boolean {
    if (Math.abs(lat) > 90) {
      console.error("Latitude should be between -90 and 90");
      return false;
    }
    if (Math.abs(lon) > 180) {
      console.error("Longitude should be between -180 and 180");
      return false;
    }

    return true;
  }
}
