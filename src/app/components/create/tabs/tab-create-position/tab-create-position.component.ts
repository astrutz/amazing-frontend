import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LocationService } from "../../../../services/location.service";
import { ProgressSpinnerComponent } from "../../../shared/progress-spinner/progress-spinner.component";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { ionRefresh } from "@ng-icons/ionicons";

@Component({
  selector: 'app-position',
  templateUrl: './tab-create-position.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProgressSpinnerComponent,
    NgIcon
  ],
  viewProviders: [
    provideIcons({
      ionRefresh
    }),
  ]
})
export class TabCreatePositionComponent {
  protected readonly locationService = inject(LocationService);

  /**
   * Current user positon
   */
  protected currentLocation$ = computed(() => this.locationService.lastPosition$());
}
