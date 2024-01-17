import { Injectable } from '@angular/core';

export type Marker = {
  id: string,
  name: string,
  description: string,
  lat: number,
  lng: number
}

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  private _markers: Marker[] = [
    {
      id: 'sdfggdfssgd',
      name: 'Schlossberg Freiburg',
      description: 'Oben am Geländer vom Turm',
      lat: 47.994178,
      lng: 7.859474
    },
    {
      id: 'shdsdhfhsdfhsdhs',
      name: 'Palmetum Teneriffa',
      description: 'Auf der Rückseite vom Eingangsschild',
      lat: 28.454120,
      lng: -16.256980
    },
    {
      id: 'sdfggsdfdfssgd',
      name: 'babiel GmbH',
      description: 'An verschiedenen Stellen im Office',
      lat: 51.219570,
      lng: 6.814330
    },
    {
      id: 'sdfsdf',
      name: 'Koi Sushi',
      description: 'Das weiß nur Philipp Müller',
      lat: 51.225630,
      lng: 6.791980
    },
    {
      id: 'ssdsgd',
      name: 'Restaurante El Meson Teneriffe',
      description: 'Unter einigen Tellern und auf der Herrentoilette',
      lat: 28.239220,
      lng: -16.839540
    },
    {
      id: 'uksdjhgj',
      name: 'Kettwiger Straße U-Bahn',
      description: 'Am Eingang und an der Rolltreppe',
      lat: 51.220847,
      lng: 6.809221
    }
  ]

  constructor() { }

  get markers(): Marker[] {
    return this._markers;
  }
}
