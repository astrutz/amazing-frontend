import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading = true;

  get isLoading() {
    return this._isLoading;
  }

  set isLoading(isLoading: boolean) {
    this._isLoading = isLoading;
  }
}
