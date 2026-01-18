import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroments';
import { Coordinates } from '../../core/domain/value-objects/coordinates';
import { Weather } from '../../core/domain/entities/weather';
import { WeatherRepository } from '../../core/ports/weather-repository';
import { OpenWeatherCurrentResponseDto } from './openweather.dto';
import { OpenWeatherMapper } from './openweather.mapper';

@Injectable({
  providedIn: 'root'
})
export class OpenWeatherRepository implements WeatherRepository {
  private readonly baseUrl = `${environment.openWeather.baseUrl}/weather`;

  constructor(private http: HttpClient) {}

  getCurrentWeather(coordinates: Coordinates): Observable<Weather> {
    const params = new HttpParams()
      .set('lat', coordinates.lat.toString())
      .set('lon', coordinates.lon.toString())
      .set('units', 'metric')
      .set('lang', 'pt_br')
      .set('appid', environment.openWeather.apiKey);

    const url = `${this.baseUrl}?${params.toString().replace(/appid=[^&]+/, 'appid=***')}`;
    console.log('🌐 [OpenWeatherRepository] Fazendo chamada à API REAL:', url);
    console.log('📍 [OpenWeatherRepository] Coordenadas:', { lat: coordinates.lat, lon: coordinates.lon });

    return this.http
      .get<OpenWeatherCurrentResponseDto>(this.baseUrl, { params })
      .pipe(
        map((dto) => {
          console.log('✅ [OpenWeatherRepository] Resposta recebida da API REAL:', dto);
          console.log('🔄 [OpenWeatherRepository] Convertendo DTO para domínio...');
          const domain = OpenWeatherMapper.toDomain(dto);
          console.log('✨ [OpenWeatherRepository] Dados convertidos para domínio:', domain);
          return domain;
        })
      );
  }
}