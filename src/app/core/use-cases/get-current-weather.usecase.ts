import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinates } from '../domain/value-objects/coordinates';
import { Weather } from '../domain/entities/weather';
import { WeatherRepository, WEATHER_REPOSITORY } from '../ports/weather-repository';

@Injectable({
  providedIn: 'root'
})
export class GetCurrentWeatherUseCase {
  constructor(@Inject(WEATHER_REPOSITORY) private weatherRepository: WeatherRepository) {}

  execute(coordinates: Coordinates): Observable<Weather> {
    return this.weatherRepository.getCurrentWeather(coordinates);
  }
}
