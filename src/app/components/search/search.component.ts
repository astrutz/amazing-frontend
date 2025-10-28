import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarkerService } from '../../services/marker.service';
import { Marker } from '../../types/marker.type';
import { LocationService } from '../../services/location.service';

@Component({
    selector: 'app-search',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './search.component.html'
})
export class SearchComponent {
  protected foundMarkers: Marker[] = [];
  protected searchTerm: FormControl<string | null>;

  constructor(
    private _router: Router,
    private readonly _markerService: MarkerService,
    private readonly _currentLocation: LocationService,
  ) {
    this.searchTerm = new FormControl('', [Validators.required, Validators.minLength(3)]);
  }

  search(): void {
    if (this.searchTerm.valid) {
      const markers = this._markerService.markers$();
      const term = this.searchTerm.getRawValue()!.toLowerCase();
      this.foundMarkers =
        markers.filter(
          (marker) =>
            marker.name.toLowerCase().includes(term) ||
            marker.description.toLowerCase().includes(term) ||
            marker.uploader?.toLowerCase().includes(term),
        ) ?? [];
    } else {
      this.foundMarkers = [];
    }
  }

  protected getFlagUrl(country: string): string {
    return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`;
  }

  protected navigate(marker: Marker) {
    this._currentLocation.setCurrentLocation({
      latitude: marker.lat,
      longitude: marker.lng,
    }, false);
    this._router.navigate(['']);
  }
}
