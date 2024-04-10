import { Injectable, signal } from '@angular/core';

type SetLocationValue = {
  latitude: number,
  longitude: number,
  accuracy?: number,
  altitude?: number,
  altitudeAccuracy?: number,
  heading?: number,
  speed?: number
}

/**
 * This service is intended to provide the whole app with a somewhat useful and reliable current location.
 */
@Injectable({ providedIn: 'root' })
class CurrentLocationService {
  private readonly _geolocation: Geolocation | null = null;
  private readonly _positioningOpts: PositionOptions = {
    enableHighAccuracy: true,
    /** Allows to work with the cached location for one minute. One sticker at a time! */
    maximumAge: 60 * 1000,
    /** No one wants to wait more than 5sec, right? */
    timeout: 5 * 1000
  }
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
    speed: null
  }

  /**
   * We use a signal to store the service’s state. This way all depending components are updated automatically
   * when the state changes without the need for the more costly zone.js change detections cycles. */
  private readonly _lastPosition = signal<GeolocationPosition>({
    coords: this._homeBase,
    timestamp: Date.now(),
  });

  public get lastPosition(): GeolocationPosition {
    /** Returns the signal in a read-only way. */
    return this._lastPosition()
  }

  private set lastPosition(coords: GeolocationCoordinates) {
    this._lastPosition.set({
      coords,
      timestamp: Date.now()
    })
  }

  constructor() {
    if (navigator && "geolocation" in navigator) {
      this._geolocation = navigator.geolocation
    }
  }

  /**
   * Force updates the current position provided by this service
   * @returns {Promise<void>} Rejects on any error; it's up to the user whether to work with the - then - stale position or ignore this service’s position.
   */
  public async update(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._geolocation) reject()
      else
        this._geolocation.getCurrentPosition(
          (position) => {
            this._lastPosition.set(position);
            resolve()
          },
          reject,
          this._positioningOpts
        )
    })
  }

  public setCurrentLocation(coords: SetLocationValue) {
    this.lastPosition = Object.assign(this._homeBase, coords)
  }
}

export { CurrentLocationService }
