import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private _baseUrl = `http://api.geonames.org/countryCodeJSON?username=${environment.geonamesUser}`;

  async getCountry(lat: number, lng: number): Promise<string | null> {
    try {
      const response = (await axios.get(`${this._baseUrl}&lat=${lat}&lng=${lng}`)).data;
      return response.countryCode ?? null;
    } catch (err) {
      return null;
    }
  }
}
