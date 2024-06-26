import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'progress-spinner',
  templateUrl: 'progress-spinner.component.html',
  styleUrl: 'progress-spinner.component.scss',
})
export class ProgressSpinnerComponent {
  @Input()
  show: boolean = false;
}
