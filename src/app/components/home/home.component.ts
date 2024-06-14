import * as L from 'leaflet';
import { divIcon, icon, LeafletMouseEvent, MapOptions, Marker, marker, tileLayer } from 'leaflet';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Router, RouterLink } from '@angular/router';
import { Marker as MarkerType } from '../../types/marker.type';
import 'leaflet.markercluster';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';

import { CurrentLocationService } from '../../services/location.service';
import { RequestService } from '../../services/request.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideLoader2, lucideMapPin, lucidePlus } from '@ng-icons/lucide';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LeafletModule,
    LeafletMarkerClusterModule,
    NgIconComponent,
    NgClass,
    NgStyle,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  viewProviders: [provideIcons({ lucidePlus, lucideMapPin, lucideLoader2 })],
})
export class HomeComponent implements OnInit {
  markerClusterData: Marker[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions = {
    showCoverageOnHover: false,
    iconCreateFunction: function(cluster) {
      const count = cluster.getChildCount();
      return divIcon({
        iconUrl: '/assets/marker-icon.svg',
        iconSize: [96, 90],
        html: `<img src="/assets/marker-icon.svg" alt="Amazing Artur Symbolbild"/> <span class="bg-amazing-bordeaux text-xl absolute bottom-1 right-2 w-8 h-8 rounded-full flex justify-center items-center">${count}</span>`,
        className: 'relative',
      });
    },
  };
  protected markers$: WritableSignal<MarkerType[]> = signal([]);
  protected isUpdatingPosition = false;
  private _currentLocation = inject(CurrentLocationService);
  private _requestService = inject(RequestService);
  private _router = inject(Router);

  protected isContextMenuOpen = false;
  protected contextMenuX: WritableSignal<number> = signal(0);
  protected contextMenuY: WritableSignal<number> = signal(0);
  clickedLat: number = 0;
  clickedLng: number = 0 ;

  private _options: MapOptions = {
    layers: [
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }),
    ],
    zoom: 19,
    center: this.mapCenter,
  };

  get options(): MapOptions {
    return this._options;
  }

  get layers(): Marker[] {
    // this.markerClusterData = this.markers$();
    return this.markers$().map((markerElement) => {
      const mapMarker = marker([markerElement.lat, markerElement.lng], {
        title: markerElement.name,
        icon: icon({ iconUrl: '/assets/marker-icon.svg', iconSize: [80, 64] }),
      });
      mapMarker.bindPopup(`<h3 class="text-xl mb-2" id="${markerElement._id}">${markerElement.name}</h3>
        <h4 class="text-m">${markerElement.description}</h4>
        ${markerElement.uploader ? `<h5 class="text-s">von ${markerElement.uploader} eingetragen</h5>` : ''}
        <img src="${markerElement.pictureUrl ?? ''}" />`);
      return mapMarker;
    });
  }

  get positioning(): any {
    return {'left.px': this.contextMenuX(), 'top.px': this.contextMenuY()};
    // return `left: ${this.contextMenuX()}px top: ${this.contextMenuY()}px`;
  }

  /** Provides the currentPosition to be used as centre of the map. */
  protected get mapCenter(): L.LatLng {
    return new L.LatLng(
      this._currentLocation.lastPosition.coords.latitude,
      this._currentLocation.lastPosition.coords.longitude,
    );
  }

  ngOnInit() {
    this._requestService.getMarkers().then((data) => {
      this.markers$.set(data);
    });
  }

  protected navigateToCreate() {
    this._router.navigate(['create']);
  }

  protected updatePosition() {
    this.isUpdatingPosition = true;
    this._currentLocation
      .update()
      .finally(() => {
        this.isUpdatingPosition = false;
      });
  }

  protected changeCurrentPosition(mapCenter: L.LatLng) {
    this._currentLocation.setCurrentLocation({
      latitude: mapCenter.lat,
      longitude: mapCenter.lng,
    });
  }

  protected openContextMenu(event: LeafletMouseEvent){
    this.contextMenuX.set(event.containerPoint.x);
    this.contextMenuY.set(event.containerPoint.y);
    this.clickedLat = event.latlng.lat;
    this.clickedLng = event.latlng.lng;
    this.isContextMenuOpen = true;
  }
}
