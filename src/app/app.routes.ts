import { Routes } from '@angular/router';
import { WeatherPage } from './presentation/weather/weather.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/weather',
    pathMatch: 'full'
  },
  {
    path: 'weather',
    component: WeatherPage
  }
];
