import { Pipe, PipeTransform } from '@angular/core';

/*
 * Transforms hddd°mm′ss.ss″ notations to float numbers.
 * Usage:
 *   value | geoStringToNumber
*/
@Pipe({
  standalone: true,
  name: 'geoStringToNumber'
})
class GeoStringToNumberPipe implements PipeTransform {
  private _matcher = /^([NESW]\s*)?(?:([\d.]+)°\s*)(?:([\d.]+)′\s*)?(?:([\d.]+)″\s*)?([NESW])?$/;

  /**
 * lat/lon numbers are negative when they are headed to the
 * **S**outh or **W**est so this is to figure out the sign factor
 * @param indicator Indicating the cardinal point
 * @returns signed factor; -1 for south and west, +1 for north and east
 */
  private _getCardinalPointSign(indicator: string = ""): 1 | -1 {
    return ["S", "W"].includes(indicator) ? -1 : 1;
  }

  public transform(string: string): number | undefined {
    let result = undefined;
    const match = string.match(this._matcher);

    if (match) {
      const direction = this._getCardinalPointSign(match[1] ?? match[5])
      const degrees = parseFloat(match[2]);
      const minutes = match[3] ? parseFloat(match[3]) / 60 : 0;
      const seconds = match[4] ? parseFloat(match[4]) / 60 / 60 : 0;

      result = direction * (degrees + minutes + seconds);
    }

    return result
  }
}

export { GeoStringToNumberPipe }