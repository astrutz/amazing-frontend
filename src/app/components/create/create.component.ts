import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerComponent } from '../shared/progress-spinner/progress-spinner.component';
import { UploadStates } from './create.type';
import { CountryService } from '../../services/country.service';

const LATITUDE_REGEXP = /^[-+]?(?:[0-8]?\d(?:[.,]\d+)?|90(?:[.,]0+)?)$/;
const LONGITUDE_REGEXP = /^[-+]?(?:(?:[0-9]?\d|1[0-7]\d)(?:[.,]\d+)?|180(?:[.,]0+)?)$/;

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ProgressSpinnerComponent],
  templateUrl: './create.component.html',
})
export class CreateComponent {
  protected uploadState: UploadStates = 'waiting';
  protected imageUploadState: UploadStates = 'waiting';

  /**
   * Indicates if the pasted value is correct or not
   */
  protected pastedInputsValid: boolean = true;

  protected markerForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    uploader: new FormControl(null, []),
    lat: new FormControl(null, [
      Validators.required,
      Validators.maxLength(32),
      Validators.min(-90),
      Validators.max(90),
      Validators.pattern(/-?\d*\.?\d{1,2}/),
    ]),
    lng: new FormControl(null, [
      Validators.required,
      Validators.maxLength(32),
      Validators.min(-180),
      Validators.max(180),
      Validators.pattern(/-?\d*\.?\d{1,2}/),
    ]),
    pictureUrl: new FormControl(null, []),
    country: new FormControl(null, []),
  });

  protected tabsList: { name: string; disabled?: boolean }[] = [
    {
      name: 'Adresse',
      disabled: true,
    },
    {
      name: 'Standort',
      disabled: true,
    },
    {
      name: ' Koordinaten (manuell)',
    },
  ];

  protected currentTab: number | null = 3;

  protected fileName: string = '';

  constructor(
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _requestService: RequestService,
    private readonly _countryService: CountryService,
  ) {
    this._activatedRoute.queryParams.subscribe((params) => {
      if (params['lat']) {
        this.markerForm.patchValue({ lat: +params['lat'] });
      }
      if (params['lng']) {
        this.markerForm.patchValue({ lng: +params['lng'] });
      }
    });
  }

  protected navigateBack() {
    this._router.navigate(['']);
  }

  protected async onSubmit() {
    if (this.markerForm.valid && this.uploadState !== ('uploading' || 'failed')) {
      this.uploadState = 'uploading';

      try {
        const country = await this._countryService.getCountry(this.markerForm.getRawValue()!.lat, this.markerForm.getRawValue()!.lng);
        this.markerForm.patchValue({ country });
        await this._requestService.createMarker(this.markerForm.getRawValue());
        console.log('Marker was created');
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
        const imageURL = await this._requestService.uploadPicture(file);
        this.markerForm.patchValue({
          pictureUrl: imageURL,
        });
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

  /**
   * Triggered when something is pasted into an input
   * @param pasteEvent - The event triggered when pasting into input
   */
  protected onPaste(pasteEvent: ClipboardEvent): void {
    pasteEvent.preventDefault();
    const text = pasteEvent.clipboardData?.getData('text') ?? '';
    this._autoSplitLongLat(text);
  }

  /**
   * Splits the pasted coordinates into the right format and automatically set
   * it into the longitude and latitude form
   * @example (51.226022, 6.792637) => [51.226022, 6.792637]
   * @param input to be split
   */
  private _autoSplitLongLat(input: string): void {
    if (!input.length) return;

    // Removes every other character but the numbers separate by a comma
    const removeCharsString = input.replace(/[^\d.,\-\s]/g, ' ').trim();

    const coordinateParts = removeCharsString.split(',');

    if (coordinateParts.length !== 2) {
      this.pastedInputsValid = false;
      return;
    }

    const latitude = parseFloat(coordinateParts[0].replace(',', '.'));
    const longitude = parseFloat(coordinateParts[1].replace(',', '.'));

    if (LATITUDE_REGEXP.test(latitude.toString()) && LONGITUDE_REGEXP.test(longitude.toString())) {
      this.pastedInputsValid = true;
      this.markerForm.patchValue({ lat: latitude, lng: longitude });
    }
  }
}
