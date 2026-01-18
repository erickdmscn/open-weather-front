import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../domain/entities/city';
import { GeocodingRepository, GEOCODING_REPOSITORY } from '../ports/geocoding-repository';

@Injectable({
  providedIn: 'root'
})
export class SearchCitiesUseCase {
  constructor(@Inject(GEOCODING_REPOSITORY) private geocodingRepository: GeocodingRepository) {}

  execute(query: string, limit: number = 5): Observable<City[]> {
    if (!query || query.trim().length < 2) {
      return new Observable((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
    return this.geocodingRepository.searchCities(query.trim(), limit);
  }
}
