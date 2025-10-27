import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import type { SetLocationValue } from '../types/location.type';

/**
 * This service is intended to provide the whole app with a somewhat useful and reliable current location.
 */
@Injectable({ providedIn: 'root' })
class LocationService {
  private readonly _geolocation: Geolocation | null = null;
  private readonly _positioningOpts: PositionOptions = {

    enableHighAccuracy: true,
    /** Allows to work with the cached location for one minute. One sticker at a time! */
    maximumAge: 60 * 1000,
    /** No one wants to wait more than 5sec, right? */
    timeout: 5 * 1000,
  };
  /**
   * Somewhere one has to be. At least in one’s heart. Let us give those a home who don’t have one (yet).
   */
  private _homeBase: GeolocationCoordinates = {
    latitude: 51.21957,
    longitude: 6.81433,
    accuracy: 0,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
    toJSON: () => null
  };

  /**
   * We use a signal to store the service’s state. This way all depending components are updated automatically
   * when the state changes without the need for the more costly zone.js change detections cycles. */
  private readonly _lastPosition$ = signal<GeolocationPosition>({
    coords: this._homeBase,
    timestamp: Date.now(),
    toJSON: () => null,
  });

  /**
   * Waits for the geolocation dialog and is updated after option was chosen
   */
  public isUpdatingPosition$ = signal<boolean>(false);

  /** Returns the signal in a read-only way. */
  public get lastPosition$(): Signal<GeolocationPosition> {
    return this._lastPosition$.asReadonly();
  }

  public set lastPosition$(coords: GeolocationCoordinates) {
    this._lastPosition$.set({
      coords,
      timestamp: Date.now(),
      toJSON: () => null
    });
  }

  /**
   * Describes if the current position marker should be visible. This is only the case when using the users' geolocation.
   */
  private readonly _isGeolocation$: WritableSignal<boolean> = signal(false);

  public get isGeolocation$(): Signal<boolean> {
    return this._isGeolocation$.asReadonly();
  }

  private set isGeolocation(newType: boolean) {
    this._isGeolocation$.set(newType);
  }

  constructor() {
    if (navigator && 'geolocation' in navigator) {
      this._geolocation = navigator.geolocation;
    }
  }

  /**
   * Force updates the current position provided by this service
   * @returns {Promise<void>} Rejects on any error; it's up to the user whether to work with the - then - stale position or ignore this service’s position.
   */
  public async update(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._geolocation) reject();
      else
        this._geolocation.getCurrentPosition(
          (position) => {
            this._lastPosition$.set(position);
            this.isGeolocation = true;
            resolve();
          },
          reject,
          this._positioningOpts,
        );
    });
  }

  /**
   * Called when clicking on the curren position button
   */
  public async updatePosition() {
    this.isUpdatingPosition$.set(true);
    try {
      await this.update();
    } finally {
      this.isUpdatingPosition$.set(false);
    }
  }

  public setCurrentLocation(coords: SetLocationValue, isGeolocation: boolean) {
    this.lastPosition$ = Object.assign(this._homeBase, coords);
    this.isGeolocation = isGeolocation;
  }
}

export { LocationService };
