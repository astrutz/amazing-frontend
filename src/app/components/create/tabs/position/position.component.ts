import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {LocationService} from "../../../../services/location.service";
import {ProgressSpinnerComponent} from "../../../shared/progress-spinner/progress-spinner.component";

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProgressSpinnerComponent
  ],
  standalone: true
})
export class PositionComponent {
  protected readonly locationService = inject(LocationService);

  /**
   * Current user positon
   */
  protected currentLocation$ = computed(() => this.locationService.lastPosition$());
}
