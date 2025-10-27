import {ChangeDetectionStrategy, Component, computed, effect, inject} from '@angular/core';
import {LocationService} from "../../../../services/location.service";

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class PositionComponent {
  protected readonly locationService = inject(LocationService);

  constructor() {
    effect(() => {
      console.log('currentLocation$().coords', this.currentLocation$().coords)
    });
  }

  /**
   * Current user positon
   */
  protected currentLocation$ = computed(() => this.locationService.lastPosition$());
}
