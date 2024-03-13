import { Injectable, isDevMode } from '@angular/core';
import axios from 'axios';
import { Marker } from '../types/marker.type';
// @ts-ignore
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private _url = isDevMode() ? '/api/markers' : 'http://2.58.113.80:3000/markers';

  async getMarkers(): Promise<Marker[]> {
    return (await axios.get<Marker[]>(this._url)).data;
  }

  async createMarker(markerData: Marker): Promise<void> {
    await axios.post(this._url, markerData);
  }
}
