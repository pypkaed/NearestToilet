import { Component, OnInit } from '@angular/core';
import { ToiletModel } from "../../assets/toilet.model";
import { YandexMapService } from "./yandex-map.service";
import { FindToiletsService } from "../find-toilets/find-toilets.service";

@Component({
  selector: 'app-yandex-map',
  templateUrl: './yandex-map.component.html',
  styleUrls: ['./yandex-map.component.css']
})
export class YandexMapComponent implements OnInit {
  toilets!: ToiletModel[];
  toiletsNotFoundMsg!: string;
  constructor(
    private yandexMapService: YandexMapService,
    private findToiletsService: FindToiletsService,
  ) { }

  ngOnInit() {
    this.yandexMapService.loadMap();
    this.yandexMapService.buttonClicked.subscribe((coords) => {
      this.showToilets(coords.lat, coords.lon);
    })
  }

  public showToilets(lat: number, lon: number) {
    if (!this.areCoordsCorrect(lat, lon)) {
      // TODO: show error to user
      return;
    }

    this.toiletsNotFoundMsg = '';

    console.log("sending request")
    this.findToiletsService.findNearestToilets(lat, lon)
      .subscribe({
        next: (response: ToiletModel[]) => this.handleShowToilets(response),
        error: (err: Error) => this.handleError(err),
      })
  }

  private handleShowToilets(response: ToiletModel[]) {
    this.toilets = response;
    console.log("received request with " + response.length + " toilets")

    if (this.toilets.length === 0) {
      // TODO: show this as a balloon? or something?
      this.toiletsNotFoundMsg = "No toilets nearby, loshara";
      return;
    }
    this.yandexMapService.showToiletPoints(this.toilets);
  }

  private handleError(err: Error) {
    // TODO: show this to user
    console.error(err);
  }
  private areCoordsCorrect(lat: number, lon: number): boolean {
    if (Math.abs(lat) > 90) {
      // TODO: show this to the user
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
