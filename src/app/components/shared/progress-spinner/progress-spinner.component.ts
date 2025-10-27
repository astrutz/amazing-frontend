import {Component, input} from '@angular/core';

@Component({
  standalone: true,
  selector: 'progress-spinner',
  templateUrl: 'progress-spinner.component.html',
  styleUrl: 'progress-spinner.component.scss',
})
export class ProgressSpinnerComponent {
  public show$ = input.required<boolean>();

  public loadingText$ = input<string | null>(null);
}
