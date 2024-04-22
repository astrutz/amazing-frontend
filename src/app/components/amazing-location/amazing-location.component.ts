import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CurrentLocationService } from '../../services/location.service';
import { RoundToDecimalPlacesPipe } from '../../pipes/roundToDecimalPlaces.pipe';

@Component({
  selector: 'amazing-location',
  standalone: true,
  imports: [
    NgIf,
  ],
  templateUrl: './amazing-location.component.html',
})
export class AmazingLocation {
  private _currentLocation = inject(CurrentLocationService);
  protected isGeoString = false;
  protected isManualInput = false;
  protected multiValue: string = "";
  protected lonValue: string = "";
  protected findMeLabel = "Find me!";
  protected yourLocation = "where are you?"

  protected checkGeoStringVsMultiValue(event: Event) {
    const matcher = /^[NESW]?\s*(?:[\d.]+°?)\s*(?:[\d.]+′)?\s*(?:[\d.]+″)?\s*[NESW]?$/;

    this.multiValue = (event.target as HTMLInputElement)?.value ?? "";

    if (matcher.test(this.multiValue)) {
      this.isGeoString = true;
    } else {
      this.isGeoString = false;
    }
  }

  protected changeManualInput() {
    this.isManualInput = true;
  }

  protected findMe() {
    this.findMeLabel = "Searching …";

    this._currentLocation.update()
      .then(() => {
        this.isGeoString = true;
        this.isManualInput = true;
        this.multiValue = (new RoundToDecimalPlacesPipe).transform(this._currentLocation.lastPosition.coords.latitude, 5).toString() + "°";
        this.lonValue = (new RoundToDecimalPlacesPipe).transform(this._currentLocation.lastPosition.coords.longitude, 5).toString() + "°";
        this.yourLocation = "here you are:";
      })
      .catch(() =>
        this.isGeoString = false
      )
      .finally(() => {
        this.findMeLabel = "Find me!"
      })
  }
}
