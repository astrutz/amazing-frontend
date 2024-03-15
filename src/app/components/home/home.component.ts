import { Component, inject } from '@angular/core';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { icon, LatLng, MapOptions, marker, tileLayer } from "leaflet";
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';

import { CurrentLocationService } from '../../services/location.service';
import { MarkerService } from "../../services/marker.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LeafletModule,
    CardModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private _currentLocation = inject(CurrentLocationService);
  private _markerService = inject(MarkerService);
  private _router = inject(Router);
  private _options: MapOptions = {
    layers: [
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      })
    ],
    zoom: 19,
    center: this.mapCenter
  };
  protected isUpdatingPosition = false

  /** Provides the currentPosition to be used as centre of the map. */
  protected get mapCenter(): LatLng {
    return new LatLng(
      this._currentLocation.lastPosition.coords.latitude,
      this._currentLocation.lastPosition.coords.longitude
    )
  }

  get options(): MapOptions {
    return this._options;
  }

  get layers() {
    return this._markerService.markers.map((markerElement) => {
      const mapMarker = marker([markerElement.lat, markerElement.lng], {
        title: markerElement.name,
        icon: icon({ iconUrl: '/assets/marker-icon.svg', iconSize: [80, 64] })
      });
      mapMarker.bindPopup(`<h3 class="text-xl mb-2">${markerElement.name}</h3><h4 class="text-m">${markerElement.description}</h4>`);
      return mapMarker;
    });
  }

  protected navigateToCreate() {
    this._router.navigate(['create']);
  }

  protected updatePosition() {
    this.isUpdatingPosition = true
    this._currentLocation
      .update()
      .finally(() => {
        this.isUpdatingPosition = false;
      })
  }
}
