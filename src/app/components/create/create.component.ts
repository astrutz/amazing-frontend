import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestService } from '../../services/request.service';

import { ProgressSpinnerComponent } from '../shared/progress-spinner/progress-spinner.component';
import { Tabs, UploadStates } from './create.type';
import { CountryService } from '../../services/country.service';
import { MarkerService } from '../../services/marker.service';
import { LocationService } from '../../services/location.service';
import { TabCreatePositionComponent } from "./tabs/tab-create-position/tab-create-position.component";
import { TabCreateManuallyComponent } from "./tabs/tab-create-manually/tab-create-manually.component";
import { NgClass } from "@angular/common";


@Component({
  selector: 'app-create',
  imports: [ReactiveFormsModule, ProgressSpinnerComponent, TabCreatePositionComponent, TabCreateManuallyComponent, NgClass],
  templateUrl: './create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent {
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _countryService = inject(CountryService);
  private readonly _requestService = inject(RequestService);
  private readonly _markerService = inject(MarkerService);
  private readonly _locationService = inject(LocationService);

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

  protected uploadState$ = signal<UploadStates>('waiting');
  protected imageUploadState$ = signal<UploadStates>('waiting');

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
      type: 'position',
      name: 'Standort',
    },
    {
      type: 'manual',
      name: 'Manuelle Eingabe',
    },
  ];

  protected currentTab$ = signal<Tabs>('manual');

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
    if (this.markerForm.valid && this.uploadState$() !== 'uploading' && this.uploadState$() !== 'failed') {
      this.uploadState$.set('uploading');

      try {
        const country = await this._countryService.getCountry(this.markerForm.getRawValue()!.lat, this.markerForm.getRawValue()!.lng);
        this.markerForm.patchValue({country});
        await this._requestService.createMarker(this.markerForm.getRawValue());
        console.log('Marker was created');
        this._addCreatedMarkerToMap();
        this.navigateBack();
        this.uploadState$.set('succeeded');
      } catch (err) {
        console.error('An error occurred', err);
        this.uploadState$.set('failed');
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
      this.imageUploadState$.set('uploading');
      try {
        const imageURL = await this._requestService.uploadPicture(file);
        this.markerForm.patchValue({
          pictureUrl: imageURL,
        });
        this.fileName = file.name;
        this.imageUploadState$.set('succeeded');
      } catch (err) {
        console.log(err);
        this.imageUploadState$.set('failed');
      }
    }
  }

  private _addCreatedMarkerToMap(): void {
    const markers = this._markerService.markers$();
    markers.push(this.markerForm.getRawValue());
    const latitude = this.markerForm.get('lat')!.value;
    const longitude = this.markerForm.get('lng')!.value;
    this._markerService.markers$ = markers;
    this._locationService.setCurrentLocation({latitude, longitude}, false);
  }

  /**
   * Changes the currently selected tab
   */
  protected async selectTab(newTab: Tabs) {
    this.currentTab$.set(newTab);

    if (newTab === 'position') {
      this._locationService.resetGeolocationError();

      if (!this._locationService.isGeolocation$()) {
        await this._locationService.updatePosition();
      }

      this.markerForm.patchValue({
        lat: this.currentLocation$().coords.latitude,
        lng: this.currentLocation$().coords.longitude
      });
    } else {
      this.markerForm.patchValue({
        lat: '',
        lng: ''
      });
    }
  }
}
