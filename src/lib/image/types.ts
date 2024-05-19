export type GBPixel = 0 | 1 | 2 | 3;

export interface DecodedGBTile {
  pixels: number[];
  width: number;
  height: number;
}
