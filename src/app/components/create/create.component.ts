import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { TabViewModule } from 'primeng/tabview';
import { TabMenuModule } from 'primeng/tabmenu';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    InputGroupModule,
    TabViewModule,
    TabMenuModule,
    InputNumberModule,
    ButtonModule,
  ],
  templateUrl: './create.component.html',
})
export class CreateComponent {
  constructor(private _router: Router) {
  }
  protected navigateBack() {
    this._router.navigate(['']);
  }
}
