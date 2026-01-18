import { Coordinates } from '../value-objects/coordinates';

export interface City {
  name: string;
  localNames?: Record<string, string>;
  coordinates: Coordinates;
  country: string;
  state?: string;
}
