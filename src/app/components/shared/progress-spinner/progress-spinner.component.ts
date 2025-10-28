import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'progress-spinner',
  templateUrl: 'progress-spinner.component.html',
  styleUrl: 'progress-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressSpinnerComponent {
  @Input()
  show: boolean = false;
}
