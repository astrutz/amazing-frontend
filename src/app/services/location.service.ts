import { Injectable, signal } from '@angular/core';

/**
 * This service is intended to provide the whole app with a somewhat useful and reliable current location. 
 */
@Injectable({ providedIn: 'root' })
class CurrentLocationService {
  private readonly _geolocation: Geolocation | null = null;
  private readonly _positioningOpts: PositionOptions = {
    enableHighAccuracy: true,
    /** Allows to work with the cached location for one minute. One sticker at a time! */
    maximumAge: 1 * 60 * 1000,
    /** Noone wants to wait more than 5sec, right? */
    timeout: 5 * 1000
  }

  /** 
   * We use a signal to store the service’s state. This way all depending components are updated automatically
   * when the state changes without the need for the more costly zone.js change detections cycles. */
  private readonly _lastPosition = signal<GeolocationPosition>({
    /**
     * Somewhere one has to be. At least in one’s heart. Let us give those a home who don’t have one (yet). 
     */
    coords: {
      latitude: 51.21957,
      longitude: 6.81433,
      accuracy: 0,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null
    },
    timestamp: Date.now(),
  });

  public get lastPosition(): GeolocationPosition {
    /** Returns the signal in a read-only way. */
    return this._lastPosition()
  }

  constructor() {
    if (navigator && "geolocation" in navigator) {
      this._geolocation = navigator.geolocation
    }
  }

  /**
   * Force updates the current position provided by this service
   * @returns {Promise<void>} Rejects on any error; its up to the user wheter to work with the - then - stale position or ignore this service’s position.
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
}

export { CurrentLocationService }