import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { LocationService } from './services/location.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), { provide: LocationService }],
};
