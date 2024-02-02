import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CardModule,
  ],
  templateUrl: './create.component.html',
})
export class CreateComponent {

}
