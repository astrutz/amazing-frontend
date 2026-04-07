import { Component, computed, inject } from '@angular/core';
import { PageComponent } from '../shared/page/page.component';
import { StatsService } from '../../services/stats.service';
import { ProgressSpinnerComponent } from '../shared/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-stats',
  imports: [PageComponent, ProgressSpinnerComponent],
  templateUrl: './stats.component.html',
})
export class StatsComponent {
  private readonly _statsService = inject(StatsService);

  protected stats$ = computed(() => {
    return this._statsService.stats$();
  });

  protected getFlagUrl(country: string): string {
    return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`;
  }
}
