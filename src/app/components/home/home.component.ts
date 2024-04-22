import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';

import * as L from 'leaflet';
import { divIcon, icon, MapOptions, Marker, marker, tileLayer } from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import 'leaflet.markercluster';

import { CardModule } from 'primeng/card';

import { Marker as MarkerType } from '../../types/marker.type';
import { RequestService } from '../../services/request.service';
import { CurrentLocationService } from '../../services/location.service';
import { CreateMarkerComponent } from '../create-marker/create-marker.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CardModule,
    CreateMarkerComponent,
    LeafletModule,
    LeafletMarkerClusterModule,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private _currentLocation = inject(CurrentLocationService);
  private _requestService = inject(RequestService);
  private _router = inject(Router);
  protected markers$: WritableSignal<MarkerType[]> = signal([]);

  // ngOnInit() {
  //   this._requestService.getMarkers().then((data) => {
  //     this.markers$.set(data);
  //   })
  // }

  markerClusterData: Marker[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions = {
    showCoverageOnHover: false,
    iconCreateFunction: function (cluster) {
      const count = cluster.getChildCount();
      return divIcon({
        iconUrl: '/assets/marker-icon.svg',
        iconSize: [96, 90],
        html: `<img src="/assets/marker-icon.svg"/> <span class="bg-[#5F2234] text-xl absolute bottom-1 right-2 w-8 h-8 rounded-full flex justify-center items-center">${count}</span>`,
        className: 'relative'
      });
    }
  };

  protected isCreate() {
    return /^\/create/.test(this._router.url)
  }

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
  protected get mapCenter(): L.LatLng {
    return new L.LatLng(
      this._currentLocation.lastPosition.coords.latitude,
      this._currentLocation.lastPosition.coords.longitude
    )
  }

  get options(): MapOptions {
    return this._options;
  }

  get layers(): Marker[] {
    // this.markerClusterData = this.markers$();
    return this.markers$().map((markerElement) => {
      const mapMarker = marker([markerElement.lat, markerElement.lng], {
        title: markerElement.name,
        icon: icon({ iconUrl: '/assets/marker-icon.svg', iconSize: [80, 64] })
      });
      mapMarker.bindPopup(`<h3 class="text-xl mb-2" id="${markerElement._id}">${markerElement.name}</h3><h4 class="text-m">${markerElement.description}</h4><img src="${markerElement.pictureUrl ?? ''}" />`);
      return mapMarker;
    });
  }

  protected navigateToCreate() {
    this._router.navigate(['/create'], {
      replaceUrl: true,
    });
  }

  protected updatePosition() {
    this.isUpdatingPosition = true
    this._currentLocation
      .update()
      .finally(() => {
        this.isUpdatingPosition = false;
      })
  }

  protected changeCurrentPosition(mapCenter: L.LatLng) {
    this._currentLocation.setCurrentLocation({
      latitude: mapCenter.lat,
      longitude: mapCenter.lng
    })
  }
}
