import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public currentTheme$ = signal<string>('default');

  constructor() {
    this.currentTheme$.set(localStorage.getItem('theme') ?? 'default');
    this._applyTheme(this.currentTheme$());
  }

  public setTheme(theme: string) {
    localStorage.setItem('theme', theme);
    this.currentTheme$.set(theme);
    this._applyTheme(theme);
  }

  private _applyTheme(theme: string) {
    const root = document.documentElement;
    if (theme === 'default') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }
}
