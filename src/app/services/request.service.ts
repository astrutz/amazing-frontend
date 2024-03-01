import { Injectable } from '@angular/core';
import axios from 'axios';
import { Marker } from '../types/marker.type';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  async getMarkers(): Promise<Marker[]> {
    return (await axios.get<Marker[]>('/api/markers')).data;
  }

  async createMarker(markerData: Marker): Promise<void> {
    await axios.post('/api/markers', markerData);
  }
}
