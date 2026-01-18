import { Coordinates } from '../../core/domain/value-objects/coordinates';
import { Weather, WeatherCondition } from '../../core/domain/entities/weather';
import { OpenWeatherCurrentResponseDto } from './openweather.dto';

export class OpenWeatherMapper {
  static toDomain(dto: OpenWeatherCurrentResponseDto): Weather {
    console.log('🗺️ [OpenWeatherMapper] Mapeando DTO da API:', {
      cidade: dto.name,
      temperatura: dto.main.temp,
      descricao: dto.weather[0]?.description
    });

    const coordinates = new Coordinates(dto.coord.lat, dto.coord.lon);

    const domain = {
      coordinates,
      timezone: dto.name || 'Unknown',
      current: {
        dt: dto.dt,
        sunrise: dto.sys.sunrise,
        sunset: dto.sys.sunset,
        temp: dto.main.temp,
        feelsLike: dto.main.feels_like,
        pressure: dto.main.pressure,
        humidity: dto.main.humidity,
        dewPoint: dto.main.temp_min, // Aproximação, já que a API básica não retorna dew_point
        uvi: 0, // API básica não retorna UVI
        clouds: dto.clouds.all,
        visibility: dto.visibility,
        windSpeed: dto.wind.speed,
        windDeg: dto.wind.deg,
        weather: this.mapWeatherConditions(dto.weather),
      },
      // API básica não retorna hourly e daily
      hourly: [],
      daily: [],
    };

    console.log('✅ [OpenWeatherMapper] Mapeamento concluído. Dados do domínio criados.');
    return domain;
  }

  private static mapWeatherConditions(
    weather: Array<{ id: number; main: string; description: string; icon: string }>
  ): WeatherCondition[] {
    return weather.map((w) => ({
      id: w.id,
      main: w.main,
      description: w.description,
      icon: w.icon,
    }));
  }
}
