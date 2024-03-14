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
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

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
    FileUploadModule,
    ProgressSpinnerModule,
    CommonModule,
    TagModule,
  ],
  templateUrl: './create.component.html',
})
export class CreateComponent {
  uploadState : 'waiting' | 'uploading' | 'failed' | 'succeded' = 'waiting';

  markerForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    lat: new FormControl(null, [Validators.required]),
    lng: new FormControl(null, [Validators.required]),
  });

  constructor(private _router: Router, private _requestService: RequestService) {
  }

  protected navigateBack() {
    this._router.navigate(['']);
  }

  protected async onSubmit() {
    if (this.markerForm.valid && this.uploadState !== ('uploading' || 'failed')) {
      try {
        await this._requestService.createMarker(this.markerForm.getRawValue());
        console.log('Marker was updated');
        // todo: show success message via UI or redirect to home page
      } catch (err) {
        console.error('An error occured', err);
        // todo: show error message via UI
      }
    } else {
      console.log(this.markerForm.getRawValue());
      console.warn('Invalid Form!');
      // todo: show warning
    }
  }

  protected async handleFileInput(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.item(0);
    if (file) {
      this.uploadState = 'uploading';
      try {
        await this._requestService.uploadPicture(file);
        this.uploadState = 'succeded';
      } catch (err) {
        this.uploadState = 'failed';
      }
    }
  }
}
