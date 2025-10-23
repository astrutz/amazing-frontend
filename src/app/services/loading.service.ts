import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading$ = signal<boolean>(true);

  public get isLoading$(): Signal<boolean> {
    return this._isLoading$.asReadonly();
  }

  public set isLoading(isLoading: boolean) {
    this._isLoading$.set(isLoading);
  }
}
