import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ToiletModel } from "../../assets/toilet.model";
import { YandexMapService } from "./yandex-map.service";
import { FindToiletsService } from "../find-toilets/find-toilets.service";
import { YandexMapBalloonsService } from "./yandex-map-balloons.service";
import { ToiletsMathService } from "../find-toilets/toilets-math.service";

@Component({
  selector: 'app-yandex-map',
  templateUrl: './yandex-map.component.html',
  styleUrls: ['./yandex-map.component.css']
})
export class YandexMapComponent implements OnInit {
  toilets!: ToiletModel[];
  toiletsNotFoundMsg!: string | null;
  incorrectCoordsMsg!: string | null;
  connectionErrorMsg!: string | null;
  constructor(
    private yandexMapService: YandexMapService,
    private yandexMapBalloonService: YandexMapBalloonsService,
    private toiletsMathService: ToiletsMathService,
    private findToiletsService: FindToiletsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.yandexMapService.loadMap();
    this.yandexMapBalloonService.buttonClicked.subscribe((coords) => {
      this.showToilets(coords.lat, coords.lon);
    })
  }

  public showToilets(lat: number, lon: number) {
    if (!this.toiletsMathService.areCoordsCorrect(lat, lon)) {
      this.incorrectCoordsMsg = 'Каким-то образом ты смог обмануть карту и указать неправильные координаты.' +
        ' Молодец, обосрись.';
      this.cdr.detectChanges()
      return;
    }

    console.log("sending request")
    this.findToiletsService.findNearestToilets(lat, lon)
      .subscribe({
        next: (response: ToiletModel[]) => {
          this.handleShowToilets({ lat, lon }, response)
        },
        error: (err: Error) => this.handleError(err),
      })
  }

  private handleShowToilets(searchPoint: any, response: ToiletModel[]) {
    this.toilets = response;
    console.log("received request with " + response.length + " toilets")

    if (this.toilets.length === 0) {
      this.toiletsNotFoundMsg = 'Поздравляю, туалетов в радиусе 3 км не существует. ' +
        'В целом, ты в таких ебенях, что можешь покакать прямо на улице.';
      // because it's inside a subscription we need to detect the changes manually
      this.cdr.detectChanges();
      this.resetErrorMessages()
      return;
    }
    this.yandexMapService.showNearestToiletPoints(
      searchPoint,
      this.toilets);

    this.resetErrorMessages()
  }

  private handleError(err: Error) {
    this.connectionErrorMsg = 'Сервер лёг. F твоей жопе.';
    this.cdr.detectChanges()
    console.error(err);

    this.resetErrorMessages()
  }
  private resetErrorMessages() {
    setTimeout(() => {
      this.toiletsNotFoundMsg = null;
      this.incorrectCoordsMsg = null;
      this.connectionErrorMsg = null;
      this.cdr.detectChanges();
    }, 3000);
  }
}
