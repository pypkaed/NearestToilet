import { Component } from '@angular/core';
import {ToiletModel} from "../../assets/toilet.model";
import {FindToiletsService} from "./find-toilets.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-find-toilets',
  templateUrl: './find-toilets.component.html',
  styleUrls: ['./find-toilets.component.css']
})
export class FindToiletsComponent {
  toilets!: ToiletModel[];
  coordsForm = this.formBuilder.group({
    latitude: 0,
    longitude: 0,
  })
  constructor(
    private findToiletsService: FindToiletsService,
    private formBuilder: FormBuilder,
  ) { }

  onSubmit(): void {
    const lat = this.coordsForm.get('latitude')?.value
    const lon = this.coordsForm.get('longitude')?.value

    if (typeof lat === 'number' && typeof lon === 'number') {
      console.log("sending request")
      this.findToiletsService.findNearestToilets(lat, lon).subscribe((response: ToiletModel[]) => {
          this.toilets = response;
          console.log("received request:" + response)
        },
        (error: any) => {
          console.error(error);
        })
    }
  }
}
