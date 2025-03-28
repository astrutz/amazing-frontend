import { Injectable } from '@angular/core';
import axios from 'axios';
import { Marker } from '../types/marker.type';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  async getMarkers(): Promise<Marker[]> {
    return (await axios.get<Marker[]>(`${environment.backendUrl}/markers`)).data;
  }

  async createMarker(markerData: Marker): Promise<void> {
    await axios.post(`${environment.backendUrl}/markers`, markerData);
  }

  async uploadPicture(picture: File): Promise<string> {
    const formData: FormData = new FormData();
    formData.append('image', picture, picture.name);
    const imageID = await axios.post(`${environment.backendUrl}/picture`, formData);
    return imageID.data.toString();
  }
}
