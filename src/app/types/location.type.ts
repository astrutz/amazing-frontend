type SetLocationValue = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
};

enum GeolocationErrorCode {
  PERMISSION_DENIED = 1,
  POSITION_UNAVAILABLE = 2,
  TIMEOUT = 3,
}

type GeolocationErrorCodeMessage = {
  code: GeolocationErrorCode;
  message: string;
}

export { SetLocationValue, GeolocationErrorCode, GeolocationErrorCodeMessage };
