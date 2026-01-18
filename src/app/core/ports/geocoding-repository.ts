import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../domain/entities/city';

export interface GeocodingRepository {
  searchCities(query: string, limit?: number): Observable<City[]>;
}

export const GEOCODING_REPOSITORY = new InjectionToken<GeocodingRepository>('GeocodingRepository');
