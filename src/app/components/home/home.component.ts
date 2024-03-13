import * as L from 'leaflet';
import { divIcon, icon, latLng, MapOptions, marker, tileLayer } from 'leaflet';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { Marker } from '../../types/marker.type';
import { RequestService } from '../../services/request.service';
import 'leaflet.markercluster';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LeafletModule,
    LeafletMarkerClusterModule,
    CardModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private _requestService: RequestService, private _router: Router) {
  }

  ngOnInit() {
    this._requestService.getMarkers().then((data) => {
      this.markers$.set(data);
    })
  }

  protected markers$: WritableSignal<Marker[]> = signal([]);

  markerClusterData: Marker[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions = {
    showCoverageOnHover: false,
    iconCreateFunction: function(cluster) {
      const count = cluster.getChildCount();
      return divIcon({
        iconUrl: '/assets/marker-icon.svg',
        iconSize: [96, 90],
        html: `<img src="/assets/marker-icon.svg"/> <span class="text-xl absolute bottom-1 right-2">${count}</span>`,
        className: 'bg-red-600 p-4 rounded-2xl relative'
      });
    }
  };

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
    this.markerClusterData = this.markers$();
    return this.markers$().map((markerElement) => {
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
}
