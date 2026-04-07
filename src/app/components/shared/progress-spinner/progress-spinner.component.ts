import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-progress-spinner',
  templateUrl: 'progress-spinner.component.html',
  styleUrl: 'progress-spinner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressSpinnerComponent {
  public show$ = input.required<boolean>();

  public loadingText$ = input<string | null>(null);
}
