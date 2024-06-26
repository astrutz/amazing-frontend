import { Injectable } from '@angular/core';
import axios from 'axios';
import { Marker } from '../types/marker.type';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private _baseUrl = 'https://amazing-backend.vercel.app';

  async getMarkers(): Promise<Marker[]> {
    return (await axios.get<Marker[]>(`${this._baseUrl}/markers`)).data;
  }

  async createMarker(markerData: Marker): Promise<void> {
    await axios.post(`${this._baseUrl}/markers`, markerData);
  }

  async uploadPicture(picture: File): Promise<string> {
    const formData: FormData = new FormData();
    formData.append('file', picture, picture.name);
    const imageID = await axios.post(`${this._baseUrl}/picture`, formData);
    return imageID.data.toString();
  }
}
