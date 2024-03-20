import { Injectable } from '@angular/core';
import axios from 'axios';
import { Marker } from '../types/marker.type';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private _baseUrl = 'https://concerned-fish-gabardine.cyclic.app';

  async getMarkers(): Promise<Marker[]> {
    return (await axios.get<Marker[]>(`${this._baseUrl}/markers`)).data;
  }

  async createMarker(markerData: Marker): Promise<void> {
    await axios.post(`${this._baseUrl}/markers`, markerData);
  }

  async uploadPicture(picture: File): Promise<void> {
    const formData: FormData = new FormData();
    formData.append('file', picture, picture.name);
    await axios.post(`${this._baseUrl}/picture`, formData);
  }
}
