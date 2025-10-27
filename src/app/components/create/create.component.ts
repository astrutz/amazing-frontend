import {Component, computed, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProgressSpinnerComponent} from '../shared/progress-spinner/progress-spinner.component';
import {Tabs, UploadStates} from './create.type';
import {LocationService} from "../../services/location.service";
import {RequestService} from "../../services/request.service";
import {CountryService} from "../../services/country.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PositionComponent} from "./tabs/position/position.component";
import {ManualComponent} from "./tabs/manual/manual.component";

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ProgressSpinnerComponent, PositionComponent, ManualComponent],
  templateUrl: './create.component.html',
})
export class CreateComponent {
  private readonly _locationService = inject(LocationService);
  private readonly _router: Router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _requestService = inject(RequestService);
  private readonly _countryService = inject(CountryService);

  constructor() {
    this._activatedRoute.queryParams.subscribe((params) => {
      if (params['lat']) {
        this.markerForm.patchValue({lat: +params['lat']});
      }
      if (params['lng']) {
        this.markerForm.patchValue({lng: +params['lng']});
      }
    });
  }

  protected uploadState: UploadStates = 'waiting';
  protected imageUploadState: UploadStates = 'waiting';

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

  protected tabsList: { type: Tabs, name: string; disabled?: boolean }[] = [
    {
      type: 'address',
      name: 'Adresse',
      disabled: true,
    },
    {
      type: 'position',
      name: 'Standort',
    },
    {
      type: 'manual',
      name: ' Koordinaten (manuell)',
    },
  ];

  protected currentTab: Tabs = 'manual';

  protected fileName: string = '';

  /**
   * Current user positon
   */
  protected currentLocation$ = computed(() => this._locationService.lastPosition$());

  /**
   * Navigates to start page
   */
  protected navigateBack() {
    this._router.navigate(['']);
  }

  /**
   * Sends a request to the backend to save the marker
   */
  protected async onSubmit() {
    if (this.markerForm.valid && this.uploadState !== ('uploading' || 'failed')) {
      this.uploadState = 'uploading';

      try {
        const country = await this._countryService.getCountry(this.markerForm.getRawValue()!.lat, this.markerForm.getRawValue()!.lng);
        this.markerForm.patchValue({country});
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

  /**
   * Uploads the selected photo
   */
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

  /**
   * Changes the currently selected tab
   */
  protected selectTab(newTab: Tabs) {
    this.currentTab = newTab;

    if (newTab === 'position') {
      // TODO Mona Check wenn keine currentLocation vorhanden
      this.markerForm.patchValue({
        lat: this.currentLocation$().coords.latitude,
        lng: this.currentLocation$().coords.latitude
      });
    } else {
      this.markerForm.patchValue({
        lat: '',
        lng: ''
      });
    }
  }
}
