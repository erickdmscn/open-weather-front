import { Coordinates } from '../value-objects/coordinates';

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Weather {
  coordinates: Coordinates;
  timezone: string;
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feelsLike: number;
    pressure: number;
    humidity: number;
    dewPoint: number;
    uvi: number;
    clouds: number;
    visibility: number;
    windSpeed: number;
    windDeg: number;
    weather: WeatherCondition[];
  };
  hourly?: Array<{
    dt: number;
    temp: number;
    feelsLike: number;
    pressure: number;
    humidity: number;
    dewPoint: number;
    uvi: number;
    clouds: number;
    visibility: number;
    windSpeed: number;
    windDeg: number;
    weather: WeatherCondition[];
    pop: number;
  }>;
  daily?: Array<{
    dt: number;
    sunrise: number;
    sunset: number;
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    feelsLike: {
      day: number;
      night: number;
      eve: number;
      morn: number;
    };
    pressure: number;
    humidity: number;
    dewPoint: number;
    windSpeed: number;
    windDeg: number;
    weather: WeatherCondition[];
    clouds: number;
    pop: number;
    uvi: number;
  }>;
}
