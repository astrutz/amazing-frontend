import * as L from 'leaflet';
import { divIcon, icon, LeafletMouseEvent, MapOptions, Marker, marker, tileLayer } from 'leaflet';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import 'leaflet.markercluster';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';

import { CurrentLocationService } from '../../services/location.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideLoader2, lucideMapPin, lucidePlus, lucideSearch, lucideX } from '@ng-icons/lucide';
import { NgClass, NgStyle } from '@angular/common';
import { ProgressSpinnerComponent } from '../shared/progress-spinner/progress-spinner.component';
import { LoadingService } from '../../services/loading.service';
import { MarkerService } from '../shared/marker/marker.service';

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
    ProgressSpinnerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  viewProviders: [
    provideIcons({
      lucidePlus,
      lucideMapPin,
      lucideLoader2,
      lucideX,
      lucideSearch,
    }),
  ],
})
export class HomeComponent {
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
  clickedLat: number = 0;
  clickedLng: number = 0;
  protected isUpdatingPosition = false;
  protected isInfoboxClosed = false;
  protected isContextMenuOpen = false;
  protected contextMenuX: WritableSignal<number> = signal(0);
  protected contextMenuY: WritableSignal<number> = signal(0);
  private _currentLocation = inject(CurrentLocationService);
  private _router = inject(Router);

  constructor(private readonly _activatedRoute: ActivatedRoute, private readonly _markerService: MarkerService, private readonly _loadingService: LoadingService) {
    const params = this._activatedRoute.snapshot.queryParams;
    const latitude = +params['lat'];
    const longitude = +params['lng'];
    if (latitude && longitude) {
      this._currentLocation.setCurrentLocation({ latitude, longitude });
    }
  }

  private _options: MapOptions = {
    layers: [
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }),
    ],
    zoom: 15,
    center: this.mapCenter,
  };

  get options(): MapOptions {
    return this._options;
  }

  get layers(): Marker[] {
    // this.markerClusterData = this.markers$();
    return this._markerService.markers$().map((markerElement) => {
      const mapMarker = marker([markerElement.lat, markerElement.lng], {
        title: markerElement.name,
        icon: icon({ iconUrl: '/assets/marker-icon.svg', iconSize: [80, 64] }),
      });
      mapMarker.bindPopup(`<h3 class="text-xl mb-2" id="${markerElement._id}">${markerElement.name}</h3>
        <h4 class="text-m">${markerElement.description}</h4>
        ${
        markerElement.uploader
          ? `<h5 class="text-s">von ${markerElement.uploader} eingetragen</h5>`
          : ''
      }
        <img src="${markerElement.pictureUrl ?? ''}" />`);
      return mapMarker;
    });
  }

  get positioning(): any {
    return { 'left.px': this.contextMenuX(), 'top.px': this.contextMenuY() };
    // return `left: ${this.contextMenuX()}px top: ${this.contextMenuY()}px`;
  }

  /** Provides the currentPosition to be used as centre of the map. */
  protected get mapCenter(): L.LatLng {
    return new L.LatLng(
      this._currentLocation.lastPosition.coords.latitude,
      this._currentLocation.lastPosition.coords.longitude,
    );
  }

  protected get isLoading(): boolean {
    return this._loadingService.isLoading;
  }

  protected navigateTo(path: string) {
    this._router.navigate([path]);
  }

  protected updatePosition() {
    this.isUpdatingPosition = true;
    this._currentLocation.update().finally(() => {
      this.isUpdatingPosition = false;
    });
  }

  protected changeCurrentPosition(mapCenter: L.LatLng) {
    this._currentLocation.setCurrentLocation({
      latitude: mapCenter.lat,
      longitude: mapCenter.lng,
    });
  }

  protected openContextMenu(event: LeafletMouseEvent) {
    this.contextMenuX.set(event.containerPoint.x);
    this.contextMenuY.set(event.containerPoint.y);
    this.clickedLat = event.latlng.lat;
    this.clickedLng = event.latlng.lng;
    this.isContextMenuOpen = true;
  }

  protected closeContextMenu(): void {
    this.isContextMenuOpen = false;
  }

  protected closeInfoBox(): void {
    this.isInfoboxClosed = true;
  }
}
