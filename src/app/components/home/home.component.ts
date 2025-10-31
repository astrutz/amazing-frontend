import * as L from 'leaflet';
import { icon, LeafletMouseEvent, MapOptions, Marker, marker, tileLayer } from 'leaflet';
import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { ActivatedRoute, RouterLink } from '@angular/router';
import 'leaflet.markercluster';
import { LeafletMarkerClusterModule } from '@bluehalo/ngx-leaflet-markercluster';

import { LocationService } from '../../services/location.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideLoader2, lucideMapPin, lucidePlus, lucideSearch, lucideX } from '@ng-icons/lucide';
import { NgClass, NgStyle } from '@angular/common';
import { ProgressSpinnerComponent } from '../shared/progress-spinner/progress-spinner.component';
import { LoadingService } from '../../services/loading.service';
import { MarkerService } from '../../services/marker.service';

@Component({
  selector: 'app-home',
  imports: [
    LeafletModule,
    LeafletMarkerClusterModule,
    NgIconComponent,
    NgStyle,
    RouterLink,
    ProgressSpinnerComponent,
  NgClass],
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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _loadingService = inject(LoadingService);
  protected readonly locationService = inject(LocationService);
  private readonly _markerService = inject(MarkerService);

  constructor() {
    this._initLatLongByQueryParams();
  }

  /** Provides the currentPosition to be used as centre of the map. */
  protected mapCenter$ = computed<L.LatLng>(() => {
    return new L.LatLng(
      this.locationService.lastPosition$().coords.latitude,
      this.locationService.lastPosition$().coords.longitude,
    );
  });

  protected clickedLat$ = signal<number>(0);
  protected clickedLng$ = signal<number>(0);
  protected isInfoboxClosed$ = signal<boolean>(false);
  protected isContextMenuOpen$ = signal<boolean>(false);
  protected contextMenuX$: WritableSignal<number> = signal(0);
  protected contextMenuY$: WritableSignal<number> = signal(0);
  protected viewportCenter$ = signal<L.LatLng>(this.mapCenter$());

  private _options: MapOptions = {
    layers: [
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }),
    ],
    zoom: 15,
    center: this.mapCenter$(),
  };

  private _currentPostionMarker: Marker | null = null;

  /**
   * Creates all amazing markers for the layer
   */
  private _amazingLayers$ = computed<Marker[]>(() =>
     this._markerService.markers$().map((markerElement) => {
      const mapMarker = marker([markerElement.lat, markerElement.lng], {
        title: markerElement.name,
        icon: icon({
          iconUrl: '/assets/icons/marker-icon.svg',
          iconSize: [80, 64],
        }),
      });

      mapMarker.bindPopup(`<h3 class="text-xl mb-2" id="${markerElement._id}">${markerElement.name}</h3>
        <h4 class="text-m">${markerElement.description}</h4>
        ${
        markerElement.uploader
          ? `<h5 class="text-s">von ${markerElement.uploader} eingetragen</h5>`
          : ''
      }
        ${markerElement.pictureUrl ? `<img src="${markerElement.pictureUrl ?? ''}" />` : ''}
        `);

      return mapMarker;
    })
  );

  /**
   * Returns all amazing layers and the current position marker layer
   */
  protected allLayers$ = computed<Marker[]>(() => {
    const currentPositionMarker = this.currentPositionMarker$();
    if (currentPositionMarker) {
      return [...this._amazingLayers$(), currentPositionMarker];
    }
    return [...this._amazingLayers$()];
  });

  /**
   * Returns the total number of markers to display it on the welcome card.
   **/
  protected markerCount$ = computed<number>(() => this._markerService.markers$().length)

  /**
   * Either creates a new marker for the current position or updates the
   * latitude and longitude
   */
  protected currentPositionMarker$ = computed<Marker | null>(() => {
    const pos = this.locationService.lastPosition$();
    const {latitude, longitude} = pos.coords;
    const latLng = L.latLng(latitude, longitude);

    if (!this.locationService.isGeolocation$()) {
      return null;
    }

    if (!this._currentPostionMarker) {
      this._currentPostionMarker = marker(latLng, {
        icon: icon({
          iconUrl: '/assets/icons/current-position-icon.svg',
          iconSize: [40, 40],
        }),
      });
    } else {
      this._currentPostionMarker.setLatLng(latLng);
    }

    return this._currentPostionMarker;
  });

  /**
   * Returns the loading state
   */
  protected get isLoading$(): Signal<boolean> {
    return this._loadingService.isLoading$;
  }

  /**
   * Updates postion and viewport center
   */
  protected updatePostionAndViewportCenter() {
    this.locationService.updatePosition().then(() => {
      const {latitude, longitude} = this.locationService.lastPosition$().coords;
      const latLng = L.latLng(latitude, longitude);

      this.viewportCenter$.set(latLng);
    });
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
    this.contextMenuX$.set(event.containerPoint.x);
    this.contextMenuY$.set(event.containerPoint.y);
    this.clickedLat$.set(event.latlng.lat);
    this.clickedLng$.set(event.latlng.lng);
    this.isContextMenuOpen$.set(true);
  }

  /**
   * Closes the leaflet contextMenu
   */
  protected closeContextMenu(): void {
    this.isContextMenuOpen$.set(false);
  }

  /**
   * Closes the info box
   */
  protected closeInfoBox(): void {
    this.isInfoboxClosed$.set(true);
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
    return {'left.px': this.contextMenuX$(), 'top.px': this.contextMenuY$()};
  }

  /**
   * Sets the latitude and longitude if provided by the queryParams
   */
  private _initLatLongByQueryParams(): void {
    const params = this._activatedRoute.snapshot.queryParams;
    const latitude = +params['lat'];
    const longitude = +params['lng'];

    if (latitude && longitude) {
      this.locationService.setCurrentLocation({latitude, longitude}, false);
    }
  }
}
