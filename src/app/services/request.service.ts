import { Injectable, isDevMode } from '@angular/core';
import axios from 'axios';
import { Marker } from '../types/marker.type';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private _url = isDevMode() ? '/api/markers' : 'https://concerned-fish-gabardine.cyclic.app/';

  async getMarkers(): Promise<Marker[]> {
    return (await axios.get<Marker[]>(this._url)).data;
  }

  async createMarker(markerData: Marker): Promise<void> {
    await axios.post(this._url, markerData);
  }
}
