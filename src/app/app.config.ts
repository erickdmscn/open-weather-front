import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { WEATHER_REPOSITORY } from './core/ports/weather-repository';
import { OpenWeatherRepository } from './infra/http/openweather.repository';
import { GEOCODING_REPOSITORY } from './core/ports/geocoding-repository';
import { OpenWeatherGeocodingRepository } from './infra/http/geocoding.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: WEATHER_REPOSITORY,
      useClass: OpenWeatherRepository
    },
    {
      provide: GEOCODING_REPOSITORY,
      useClass: OpenWeatherGeocodingRepository
    }
  ]
};
