import { Pipe, PipeTransform } from '@angular/core';

/*
 * Rounds a number to max x decimal places.
 * Usage:
 *   value | roundToDecimalPlaces(x)
*/
@Pipe({
  standalone: true,
  name: 'roundToDecimalPlaces'
})
class RoundToDecimalPlacesPipe implements PipeTransform {
  public transform(num: number, places: number): number {
    const exp = Math.pow(10, places)
    return Math.round(num * exp) / exp
  }
}

export { RoundToDecimalPlacesPipe }