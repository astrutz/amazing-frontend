import { Injectable, signal, WritableSignal } from '@angular/core';
import { Marker } from '../../../types/marker.type';
import { LoadingService } from '../../../services/loading.service';
import { RequestService } from '../../../services/request.service';

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

  get markers$(): WritableSignal<Marker[]> {
    return this._markers$;
  }

  set markers$(value: Marker[]) {
    this._markers$.set(value);
  }
}
