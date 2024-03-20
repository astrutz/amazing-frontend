import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { CurrentLocationService } from './services/location.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: CurrentLocationService }
  ]
};
