import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ToiletModel} from "../../assets/toilet.model";

@Injectable({
  providedIn: 'root'
})
export class FindToiletsService {
  toilets!: ToiletModel[];
  constructor(
    private http: HttpClient,
  ) { }

  public findNearestToilets(lat: number, lon: number) {
    return this.http.get<ToiletModel[]>('http://localhost:3000/toilets?lat=' + lat + '&lon=' + lon)
  }
}
