import { Injectable } from '@angular/core';
import axios from 'axios';
import { Marker } from '../types/marker.type';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  async createMarker(markerData: Marker): Promise<void> {
    await axios.post('todourl', markerData);
  }
}
