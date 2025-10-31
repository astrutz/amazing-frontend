import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { GeolocationErrorCode, GeolocationErrorCodeMessage, SetLocationValue } from '../types/location.type';

/**
 * This service is intended to provide the whole app with a somewhat useful and reliable current location.
 */
@Injectable({providedIn: 'root'})
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
   * Contains the error code and a message to be displayed
   */
  private readonly _geolocationError$ = signal<GeolocationErrorCodeMessage | null>(null);

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
   * Getter for the geolocation erro
   */
  public get geolocationError$(): Signal<GeolocationErrorCodeMessage | null> {
    return this._geolocationError$.asReadonly();
  }

  /**
   * Describes if the current position marker should be visible. This is only the case
   * when using the users' geolocation.
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
   * Called to update the position and handle the loading state
   */
  public async updatePosition() {
    this.isUpdatingPosition$.set(true);
    await this._update();
    this.isUpdatingPosition$.set(false);
  }

  /**
   * Resets the geolocation error
   */
  public resetGeolocationError() {
    this._geolocationError$.set(null);
  }

  /**
   * Force updates the current position provided by this service
   * @returns {Promise<void>} Rejects on any error; it's up to the user whether to work with the - then - stale position or ignore this service’s position.
   */
  private async _update(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._geolocation) reject();
      else {
        this._geolocation.getCurrentPosition(
          (position) => {
            this._lastPosition$.set(position);
            this.isGeolocation = true;
            resolve();
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                this._geolocationError$.set({
                  code: GeolocationErrorCode.PERMISSION_DENIED,
                  message: 'Die Standortfreigabe wurde verweigert.'
                });
                break;
              case error.POSITION_UNAVAILABLE:
                this._geolocationError$.set({
                  code: GeolocationErrorCode.POSITION_UNAVAILABLE,
                  message: 'Die aktuelle Position kann gerade nicht gefunden werden.'
                });
                break;
              case error.TIMEOUT:
                this._geolocationError$.set({
                  code: GeolocationErrorCode.TIMEOUT,
                  message: 'Es ist zu einem Timeout gekommen.'
                });
                break;
              default:
                this._geolocationError$.set({
                  code: GeolocationErrorCode.DEFAULT,
                  message: error.message
                });
                break;
            }
            this.isGeolocation = false;
          },
          this._positioningOpts,
        );
      }
    });
  }

  public setCurrentLocation(coords: SetLocationValue, isGeolocation: boolean) {
    this.lastPosition$ = Object.assign(this._homeBase, coords);
    this.isGeolocation = isGeolocation;
  }
}

export { LocationService };
