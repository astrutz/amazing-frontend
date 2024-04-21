import { RoundToDecimalPlacesPipe } from "./roundToDecimalPlaces.pipe";

describe('RoundToDecimalPlacesPipe', () => {
  const pipe = new RoundToDecimalPlacesPipe();

  it('rounds some numbers', () => {
    expect(pipe.transform(51.21957, 0)).toBe(51);
    expect(pipe.transform(6.81433, 2)).toBe(6.81);
    expect(pipe.transform(-51.21957, 3)).toBe(-51.22);
    expect(pipe.transform(-6.814333333333333333, 5)).toBe(-6.81433);
  });
});