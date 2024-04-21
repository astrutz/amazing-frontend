import { GeoStringToNumberPipe } from "./geoStringToNumber.pipe";

describe('GeoStringToNumberPipe', () => {
  const pipe = new GeoStringToNumberPipe();
  const round = (num: number | undefined) => num ? Math.round(num * 100_000) / 100_000 : undefined

  it('transforms degrees', () => {
    expect(pipe.transform('N051.21957°')).toBe(51.21957);
    expect(pipe.transform('006.81433° E')).toBe(6.81433);
    expect(pipe.transform('051.21957°S')).toBe(-51.21957);
    expect(pipe.transform('W 006.81433°')).toBe(-6.81433);
  });

  it('transforms degrees and minutes', () => {
    expect(round(pipe.transform('N 051° 13.1742′'))).toBe(51.21957);
    expect(round(pipe.transform('006°48.859783′E'))).toBe(6.81433);
    expect(round(pipe.transform('051°13.1742′ S'))).toBe(-51.21957);
    expect(round(pipe.transform('W006° 48.859783′'))).toBe(-6.81433);
  });

  it('transforms degrees, minutes, and seconds', () => {
    expect(round(pipe.transform('N 051°13′10.452″'))).toBe(51.21957);
    expect(round(pipe.transform('006°48′51.587″E'))).toBe(6.81433);
    expect(round(pipe.transform('051° 13′ 10.452″S'))).toBe(-51.21957);
    expect(round(pipe.transform('W006° 48′ 51.587″'))).toBe(-6.81433);
  });

  it('transforms non-geoStrings to undefined', () => {
    expect(pipe.transform('051 13′10.452″')).toBe(undefined);
    expect(pipe.transform('the amazing')).toBe(undefined);
  });
});