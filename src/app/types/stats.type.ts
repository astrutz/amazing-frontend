export type Stats = {
  markerCount: number;
  markerWithPictureCount: number;
  uploaderCount: number;
  mostMarkersUploader: UploaderStat[];
  mostCountryUploader: UploaderStat[];
  countryCount: number;
  topCountries: CountryStat[];
  biggestDistance: DistanceStat[];
}

export type UploaderStat = {
  name: string;
  markerCount: number;
  countryCount: number;
}

export type CountryStat = {
  country: string;
  count: number;
}

export type DistanceStat = {
  name: string;
  uploader: string;
  country: string;
  distanceInKm: number;
}
