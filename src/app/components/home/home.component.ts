import {Component} from '@angular/core';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {latLng, tileLayer} from "leaflet";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LeafletModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  options = {
    layers: [
      tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
        maxZoom: 20,
      })
    ],
    zoom: 20,
    center: latLng(51.219570, 6.814330)
  };
}
