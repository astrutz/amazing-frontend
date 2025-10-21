import * as L from 'leaflet';
import {
  icon,
  LeafletMouseEvent,
  MapOptions,
  Marker,
  marker,
  tileLayer
} from 'leaflet';
import {
  Component, computed,
  effect,
  inject,
  signal,
  WritableSignal
} from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import 'leaflet.markercluster';
import {
  LeafletMarkerClusterModule
} from '@asymmetrik/ngx-leaflet-markercluster';

import { LocationService } from '../../services/location.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideLoader2,
  lucideMapPin,
  lucidePlus,
  lucideSearch,
  lucideX
} from '@ng-icons/lucide';
import { NgStyle } from '@angular/common';
import {
  ProgressSpinnerComponent
} from '../shared/progress-spinner/progress-spinner.component';
import { LoadingService } from '../../services/loading.service';
import { MarkerService } from '../shared/marker/marker.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LeafletModule,
    LeafletMarkerClusterModule,
    NgIconComponent,
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
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _loadingService = inject(LoadingService);
  private readonly _locationService = inject(LocationService);
  protected readonly markerService = inject(MarkerService);

  constructor() {
    this._initLatLongByQueryParams();

    effect(() => {
      this._renderCurrentPosition();
    });
  }

  protected clickedLat: number = 0;
  protected clickedLng: number = 0;
  protected isUpdatingPosition = false;
  protected isInfoboxClosed = false;
  protected isContextMenuOpen = false;
  protected contextMenuX: WritableSignal<number> = signal(0);
  protected contextMenuY: WritableSignal<number> = signal(0);
  protected viewportCenter$ = signal<L.LatLng>(this.mapCenter);
  private _options: MapOptions = {
    layers: [
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }),
    ],
    zoom: 15,
    center: this.mapCenter,
  };
  private _currentPostionMarker?: Marker;

  /**
   * Creates all amazing markers for the layer
   */
  private _amazingLayers$ = computed<Marker[]>(() => {
    return this.markerService.markers$().map((markerElement) => {
      const mapMarker = marker([markerElement.lat, markerElement.lng], {
        title: markerElement.name,
        icon: icon({ iconUrl: '/assets/icons/marker-icon.svg', iconSize: [80, 64] }),
      });
      mapMarker.bindPopup(`<h3 class="text-xl mb-2" id="${ markerElement._id }">${ markerElement.name }</h3>
        <h4 class="text-m">${ markerElement.description }</h4>
        ${
        markerElement.uploader
        ? `<h5 class="text-s">von ${ markerElement.uploader } eingetragen</h5>`
        : ''
      }
        ${
        markerElement.pictureUrl
        ? `<img src="${ markerElement.pictureUrl ?? '' }" />`
        : ''
      }
        `);

      return mapMarker;
    });
  })

  /**
   * Returns all amazing layers and the current position marker layer
   */
  protected get allLayers(): Marker[] {
    const layers = [...this._amazingLayers$()];
    if (this._currentPostionMarker) layers.push(this._currentPostionMarker);

    return layers;
  }

  /** Provides the currentPosition to be used as centre of the map. */
  protected get mapCenter(): L.LatLng {
    return new L.LatLng(
      this._locationService.lastPosition.coords.latitude,
      this._locationService.lastPosition.coords.longitude,
    );
  }

  /**
   * Returns the loading state
   */
  protected get isLoading(): boolean {
    return this._loadingService.isLoading;
  }

  /**
   * Called when clicking on the curren position button
   */
  protected async updatePosition() {
    this.isUpdatingPosition = true;
    try {
      await this._locationService.update();
      const { latitude, longitude } = this._locationService.lastPosition.coords;
      const latLng = L.latLng(latitude, longitude);

      this.viewportCenter$.set(latLng);
    } finally {
      this.isUpdatingPosition = false;
    }
  }

  /**
   * Called when the center changes. E.g. when zooming in or out or scrolling
   */
  protected onViewportCenterChange(center: L.LatLng) {
    this.viewportCenter$.set(center);
  }

  /**
   * Opens the leaflet contextMenu
   */
  protected openContextMenu(event: LeafletMouseEvent) {
    this.contextMenuX.set(event.containerPoint.x);
    this.contextMenuY.set(event.containerPoint.y);
    this.clickedLat = event.latlng.lat;
    this.clickedLng = event.latlng.lng;
    this.isContextMenuOpen = true;
  }

  /**
   * Closes the leaflet contextMenu
   */
  protected closeContextMenu(): void {
    this.isContextMenuOpen = false;
  }

  /**
   * Closes the info box
   */
  protected closeInfoBox(): void {
    this.isInfoboxClosed = true;
  }

  /**
   * Returns the leaflet options
   */
  protected get options(): MapOptions {
    return this._options;
  }

  /**
    Returns the contextMenu position
   */
  protected get contextMenuPositioning(): any {
    return { 'left.px': this.contextMenuX(), 'top.px': this.contextMenuY() };
  }

  /**
   * Sets the latitude and longitude if provided by the queryParams
   */
  private _initLatLongByQueryParams(): void {
    const params = this._activatedRoute.snapshot.queryParams;
    const latitude = +params['lat'];
    const longitude = +params['lng'];

    if (latitude && longitude) {
      this._locationService.setCurrentLocation({ latitude, longitude });
    }
  }

  /**
   * Either creates a new marker for the current position or updates the
   * latitude and longitude
   */
  private _renderCurrentPosition(): void {
    const pos = this._locationService.lastPosition;
    const { latitude, longitude } = pos.coords;
    const latLng = L.latLng(latitude, longitude);

    if (!this._currentPostionMarker) {
      this._currentPostionMarker = marker(latLng, {
        icon: icon({
          iconUrl: '/assets/icons/current-position-icon.svg',
          iconSize: [40, 40],
        })
      });
    } else {
      this._currentPostionMarker.setLatLng(latLng);
    }
  }
}
