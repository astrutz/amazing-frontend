import { Component, inject } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
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
import { TagModule } from 'primeng/tag';

import { AmazingLocation } from "../amazing-location/amazing-location.component";
import { PictureUpload } from "../picture-upload/picture-upload.component";
import { CurrentLocationService } from '../../services/location.service';
import * as L from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@Component({
  selector: 'create-marker',
  standalone: true,
  templateUrl: './create-marker.component.html',
  host: { 'class': 'fixed block max-is-prose block-end-1 inset-inline-0 mli-auto is-full bg-slate-700 rounded' },
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
    TagModule,
    NgClass,
    NgIf,
    AmazingLocation,
    PictureUpload,
    LeafletModule
  ]
})
export class CreateMarkerComponent {
  private _router = inject(Router);
  private _requestService = inject(RequestService);
  private _currentLocation = inject(CurrentLocationService);
  protected currentFieldset: number = 0;
  protected markerForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    lat: new FormControl(null, [Validators.required]),
    lng: new FormControl(null, [Validators.required]),
    pictureUrl: new FormControl(null, []),
  });

  protected prevFieldset(_: Event) {
    this.currentFieldset--
  }

  protected nextFieldset(_: Event) {
    this.currentFieldset++
  }

  protected navigateBack() {
    this._router.navigate([''], {
      replaceUrl: true
    });
  }


  private _options: L.MapOptions = {
    layers: [
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      })
    ],
    zoom: 19,
    center: this.mapCenter
  };

  protected isUpdatingPosition = false

  /** Provides the currentPosition to be used as centre of the map. */
  protected get mapCenter(): L.LatLng {
    return new L.LatLng(
      this._currentLocation.lastPosition.coords.latitude,
      this._currentLocation.lastPosition.coords.longitude
    )
  }

  get options(): L.MapOptions {
    return this._options;
  }
  protected async onSubmit() {
    if (this.markerForm.valid
      // && this.uploadState !== ('uploading' || 'failed')
    ) {
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
}
