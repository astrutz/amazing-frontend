import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { TabViewModule } from 'primeng/tabview';
import { TabMenuModule } from 'primeng/tabmenu';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestService } from '../../services/request.service';

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
    ReactiveFormsModule,
  ],
  templateUrl: './create.component.html',
})
export class CreateComponent {
  markerForm: FormGroup = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    lat: new FormControl(null, [Validators.required]),
    lng: new FormControl(null, [Validators.required]),
  });

  constructor(private _router: Router, private _requestService: RequestService) {
  }

  protected navigateBack() {
    this._router.navigate(['']);
  }

  protected onSubmit() {
    if(this.markerForm.valid) {
      this._requestService.createMarker(); // todo
    } else {
      console.warn('Invalid Form!')
      // todo: show warning
    }
  }
}
