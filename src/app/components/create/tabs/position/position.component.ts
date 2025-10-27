import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {LocationService} from "../../../../services/location.service";

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class PositionComponent {
  private readonly _locationService = inject(LocationService);

  /**
   * Current user positon
   */
  protected currentLocation$ = computed(() => this._locationService.lastPosition$());
}
