import { Component } from '@angular/core';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { icon, latLng, MapOptions, marker, tileLayer } from "leaflet";
import { CardModule } from 'primeng/card';
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
  constructor(private _markerService: MarkerService) {
  }

  private _options: MapOptions = {
    layers: [
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      })
    ],
    zoom: 19,
    center: latLng(51.219570, 6.814330)
  };

  get options(): MapOptions {
    return this._options;
  }

  get layers() {
    return this._markerService.markers.map((markerElement) => {
      const mapMarker = marker([markerElement.lat, markerElement.lng], {
        title: markerElement.name,
        icon: icon({ iconUrl: '/assets/marker-icon.svg', iconSize: [80, 64] })
      });
      mapMarker.bindPopup(`<h3>${markerElement.name}</h3><h4>${markerElement.description}</h4>`);
      return mapMarker;
    });
  }
}
