import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Marker } from '../types/marker.type';
import { LoadingService } from './loading.service';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(private readonly _loadingService: LoadingService, private _requestService: RequestService) {
    this._requestService.getMarkers().then((data) => {
      this.markers$ = data;
      this._loadingService.isLoading = false;
    });
  }

  private _markers$: WritableSignal<Marker[]> = signal([]);

  get markers$(): Signal<Marker[]> {
    return this._markers$.asReadonly();
  }

  set markers$(value: Marker[]) {
    this._markers$.set(value);
  }
}
