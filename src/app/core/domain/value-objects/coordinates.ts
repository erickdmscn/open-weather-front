export class Coordinates {
  constructor(
    public readonly lat: number,
    public readonly lon: number
  ) {
    if (lat < -90 || lat > 90) {
      throw new Error('Latitude must be between -90 and 90');
    }
    if (lon < -180 || lon > 180) {
      throw new Error('Longitude must be between -180 and 180');
    }
  }
}
