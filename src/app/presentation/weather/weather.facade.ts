import { Injectable, signal, computed } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Coordinates } from '../../core/domain/value-objects/coordinates';
import { Weather } from '../../core/domain/entities/weather';
import { GetCurrentWeatherUseCase } from '../../core/use-cases/get-current-weather.usecase';

@Injectable({
  providedIn: 'root'
})
export class WeatherFacade {
  private readonly weatherSignal = signal<Weather | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly weather = this.weatherSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly currentTemp = computed(() => {
    const weather = this.weatherSignal();
    return weather ? Math.round(weather.current.temp) : null;
  });

  readonly currentDescription = computed(() => {
    const weather = this.weatherSignal();
    return weather?.current.weather[0]?.description || null;
  });

  readonly currentIcon = computed(() => {
    const weather = this.weatherSignal();
    return weather?.current.weather[0]?.icon || null;
  });

  constructor(private getCurrentWeatherUseCase: GetCurrentWeatherUseCase) {}

  loadWeather(coordinates: Coordinates): Observable<Weather> {
    console.log('🎯 [WeatherFacade] Iniciando carregamento do clima...');
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.getCurrentWeatherUseCase.execute(coordinates).pipe(
      tap({
        next: (weather) => {
          console.log('📦 [WeatherFacade] Dados recebidos do use case:', weather);
          console.log('📍 [WeatherFacade] Origem: API REAL do OpenWeather (não é mock)');
          this.weatherSignal.set(weather);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          console.error('❌ [WeatherFacade] Erro ao carregar clima:', error);
          this.errorSignal.set(error.message || 'Erro ao carregar dados do clima');
          this.loadingSignal.set(false);
        },
      }),
      catchError((error) => {
        console.error('❌ [WeatherFacade] Erro capturado:', error);
        this.errorSignal.set(error.message || 'Erro ao carregar dados do clima');
        this.loadingSignal.set(false);
        return of(null as any);
      })
    );
  }
}
