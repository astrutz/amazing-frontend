import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { CommonModule } from '@angular/common';
import {
  ProgressSpinnerComponent
} from '../shared/progress-spinner/progress-spinner.component';
import {UploadStates} from "./create.type";

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ProgressSpinnerComponent,
  ],
  templateUrl: './create.component.html',
})
export class CreateComponent {
  uploadState: UploadStates = 'waiting';
  imageUploadState: UploadStates = 'waiting';

  markerForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    uploader: new FormControl(null, []),
    lat: new FormControl(null, [Validators.required,
      Validators.maxLength(32),
      Validators.min(-90),
      Validators.max(90),
      Validators.pattern(/-?\d*\.?\d{1,2}/)]),
    lng: new FormControl(null, [Validators.required,
      Validators.maxLength(32),
      Validators.min(-180),
      Validators.max(180),
      Validators.pattern(/-?\d*\.?\d{1,2}/)]),
    pictureUrl: new FormControl(null, []),
  });

  tabsList: { name: string, disabled?: boolean }[] = [{
    name: 'Adresse',
    disabled: true,
  }, {
    name: 'Standort',
    disabled: true,
  }, {
    name: ' Koordinaten (manuell)',
  }];

  currentTab: number | null = 3;

  fileName: string = '';

  constructor(private _router: Router, private _requestService: RequestService) {
  }

  protected navigateBack() {
    this._router.navigate(['']);
  }

  protected async onSubmit() {
    if (this.markerForm.valid && this.uploadState !== ('uploading' || 'failed')) {
      this.uploadState = 'uploading';

      try {
        await this._requestService.createMarker(this.markerForm.getRawValue());
        console.log('Marker was updated');
        this.uploadState = 'succeeded';
      } catch (err) {
        console.error('An error occurred', err);
        this.uploadState = 'failed';
        // TODO Show error message
        // {
        //     "message": [
        //         "lat must be a latitude string or number",
        //         "lat must be a number conforming to the specified constraints",
        //         "lng must be a number conforming to the specified constraints"
        //     ],
        //     "error": "Bad Request",
        //     "statusCode": 400
        // }
      }
    } else {
      console.log(this.markerForm.getRawValue());
      console.warn('Invalid Form!');
    }
  }

  protected async handleFileInput(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.item(0);
    if (file) {
      this.imageUploadState = 'uploading';
      try {
        const imageID = await this._requestService.uploadPicture(file);
        this.markerForm.patchValue({pictureUrl: `https://amazing-artur-images.s3.eu-central-1.amazonaws.com/${imageID}`});
        this.fileName = file.name;
        this.imageUploadState = 'succeeded';
      } catch (err) {
        console.log(err);
        this.imageUploadState = 'failed';
      }
    }
  }

  protected selectTab(index: number) {
    return;
  }
}
