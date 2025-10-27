import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@bluehalo/ngx-leaflet-markercluster';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, LeafletModule, LeafletMarkerClusterModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'amazing';
}
