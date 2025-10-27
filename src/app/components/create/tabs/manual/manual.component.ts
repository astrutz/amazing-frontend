import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";

const LATITUDE_REGEXP = /^[-+]?(?:[0-8]?\d(?:[.,]\d+)?|90(?:[.,]0+)?)$/;
const LONGITUDE_REGEXP = /^[-+]?(?:(?:[0-9]?\d|1[0-7]\d)(?:[.,]\d+)?|180(?:[.,]0+)?)$/;

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule
  ],
  standalone: true
})
export class ManualComponent {
  /**
   * FormGroup for the inputs
   */
  public markerForm$ = input.required<FormGroup>();

  /**
   * Triggered when something is pasted into an input. Handle the automatic
   * split for long and lat when the format is correct. Otherwise, simply just
   * use the pasted value.
   * @param pasteEvent - The event triggered when pasting into input
   */
  protected onPaste(pasteEvent: ClipboardEvent): void {
    const text = pasteEvent.clipboardData?.getData('text') ?? '';
    this._autoSplitLongLat(text, pasteEvent);
  }

  /**
   * Splits the pasted coordinates into the right format and automatically set
   * it into the longitude and latitude form
   * @example (51.226022, 6.792637) => [51.226022, 6.792637]
   * @param input to be split
   * @param pasteEvent - The event triggered when pasting into input
   */
  private _autoSplitLongLat(input: string, pasteEvent: ClipboardEvent): void {
    if (!input.length) return;

    // Removes every other character but the numbers separate by a comma
    const removeCharsString = input.replace(/[^\d.,\-\s]/g, ' ').trim();

    const coordinateParts = removeCharsString.split(',');

    if (coordinateParts.length !== 2) return;

    const latitude = parseFloat(coordinateParts[0].replace(',', '.'));
    const longitude = parseFloat(coordinateParts[1].replace(',', '.'));

    if (LATITUDE_REGEXP.test(latitude.toString()) && LONGITUDE_REGEXP.test(longitude.toString())) {
      pasteEvent.preventDefault();
      this.markerForm$().patchValue({lat: latitude, lng: longitude});
    }
  }
}
