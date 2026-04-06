import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { LoadingService } from './loading.service';
import { RequestService } from './request.service';
import { Stats } from '../types/stats.type';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  constructor(private readonly _loadingService: LoadingService, private _requestService: RequestService) {
    this._requestService.getStats().then((data) => {
      this.stats$ = data;
      this._loadingService.isLoading = false;
    });
  }

  private _stats$: WritableSignal<Stats | null> = signal(null);

  get stats$(): Signal<Stats | null> {
    return this._stats$.asReadonly();
  }

  set stats$(value: Stats) {
    this._stats$.set(value);
  }
}
