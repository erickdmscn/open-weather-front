import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroments';
import { City } from '../../core/domain/entities/city';
import { Coordinates } from '../../core/domain/value-objects/coordinates';
import { GeocodingRepository } from '../../core/ports/geocoding-repository';
import { OpenWeatherGeocodingDto } from './geocoding.dto';

@Injectable({
  providedIn: 'root'
})
export class OpenWeatherGeocodingRepository implements GeocodingRepository {
  private readonly baseUrl = 'https://api.openweathermap.org/geo/1.0/direct';

  constructor(private http: HttpClient) {}

  searchCities(query: string, limit: number = 5): Observable<City[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString())
      .set('appid', environment.openWeather.apiKey);

    const url = `${this.baseUrl}?q=${query}&limit=${limit}&appid=***`;
    console.log('🔍 [GeocodingRepository] Buscando cidades:', url);

    return this.http.get<OpenWeatherGeocodingDto[]>(this.baseUrl, { params }).pipe(
      map((dtos) => {
        console.log('✅ [GeocodingRepository] Cidades encontradas:', dtos.length);
        return dtos.map((dto) => this.toDomain(dto));
      })
    );
  }

  private toDomain(dto: OpenWeatherGeocodingDto): City {
    return {
      name: dto.name,
      localNames: dto.local_names,
      coordinates: new Coordinates(dto.lat, dto.lon),
      country: dto.country,
      state: dto.state,
    };
  }
}
