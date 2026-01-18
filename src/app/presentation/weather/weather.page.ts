import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { WeatherFacade } from './weather.facade';
import { SearchCitiesUseCase } from '../../core/use-cases/search-cities.usecase';
import { City } from '../../core/domain/entities/city';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4 max-w-4xl">
      <h1 class="text-3xl font-bold mb-6 text-center">Previsão do Tempo</h1>

      <!-- Buscador de cidade -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="relative">
          <label for="citySearch" class="block text-sm font-medium mb-2">
            Buscar cidade
          </label>
          <input
            type="text"
            id="citySearch"
            [(ngModel)]="searchQuery"
            (input)="onSearchInput()"
            (focus)="showSuggestions = true"
            (blur)="onInputBlur()"
            class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o nome da cidade (ex: salv, são paulo, rio)"
            autocomplete="off"
          />

          <!-- Sugestões de cidades -->
          @if (showSuggestions && cities.length > 0) {
            <div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              @for (city of cities; track city.name + city.coordinates.lat + city.coordinates.lon) {
                <button
                  type="button"
                  (click)="selectCity(city)"
                  class="w-full text-left px-4 py-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div class="font-medium">{{ city.name }}</div>
                  <div class="text-sm text-gray-500">
                    {{ city.state ? city.state + ', ' : '' }}{{ city.country }}
                  </div>
                </button>
              }
            </div>
          }

          @if (searching) {
            <div class="absolute right-3 top-11 text-gray-400">
              <span class="text-sm">Buscando...</span>
            </div>
          }
        </div>
      </div>

      <!-- Erro -->
      @if (facade.error()) {
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {{ facade.error() }}
        </div>
      }

      <!-- Dados do clima -->
      @if (facade.weather(); as weather) {
        <div class="bg-white rounded-lg shadow-md p-6">
          <!-- Clima atual -->
          <div class="text-center mb-8">
            <h2 class="text-2xl font-semibold mb-4">{{ weather.timezone }}</h2>
            @if (facade.currentIcon()) {
              <img
                [src]="'https://openweathermap.org/img/wn/' + facade.currentIcon() + '@2x.png'"
                [alt]="facade.currentDescription() || 'Clima'"
                class="mx-auto mb-4"
              />
            }
            <div class="text-6xl font-bold mb-2">{{ facade.currentTemp() }}°C</div>
            <p class="text-xl text-gray-600 capitalize">{{ facade.currentDescription() }}</p>
          </div>

          <!-- Detalhes -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">Sensação Térmica</p>
              <p class="text-xl font-semibold">{{ Math.round(weather.current.feelsLike) }}°C</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">Umidade</p>
              <p class="text-xl font-semibold">{{ weather.current.humidity }}%</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">Pressão</p>
              <p class="text-xl font-semibold">{{ weather.current.pressure }} hPa</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">Vento</p>
              <p class="text-xl font-semibold">{{ weather.current.windSpeed }} m/s</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class WeatherPage implements OnInit {
  readonly facade = inject(WeatherFacade);
  readonly searchCitiesUseCase = inject(SearchCitiesUseCase);
  readonly Math = Math;

  searchQuery: string = '';
  cities: City[] = [];
  showSuggestions: boolean = false;
  searching: boolean = false;
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    // Configurar debounce para busca
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          this.searching = true;
          return this.searchCitiesUseCase.execute(query);
        })
      )
      .subscribe({
        next: (cities) => {
          this.cities = cities;
          this.searching = false;
          console.log('🏙️ [WeatherPage] Cidades encontradas:', cities);
        },
        error: (error) => {
          console.error('❌ [WeatherPage] Erro ao buscar cidades:', error);
          this.searching = false;
        }
      });
  }

  onSearchInput(): void {
    if (this.searchQuery.length >= 2) {
      this.searchSubject.next(this.searchQuery);
    } else {
      this.cities = [];
    }
  }

  onInputBlur(): void {
    // Delay para permitir clique nas sugestões
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  selectCity(city: City): void {
    console.log('📍 [WeatherPage] Cidade selecionada:', city);
    this.searchQuery = `${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`;
    this.showSuggestions = false;
    this.cities = [];
    
    // Buscar clima para a cidade selecionada
    this.facade.loadWeather(city.coordinates).subscribe();
  }
}

