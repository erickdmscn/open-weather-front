import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinates } from '../domain/value-objects/coordinates';
import { Weather } from '../domain/entities/weather';

export interface WeatherRepository {
  getCurrentWeather(coordinates: Coordinates): Observable<Weather>;
}

export const WEATHER_REPOSITORY = new InjectionToken<WeatherRepository>('WeatherRepository');
