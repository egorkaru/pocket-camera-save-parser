import type { DecodedGBTile } from './types';

// https://www.huderlem.com/demos/gameboy2bpp.html
export const decodeGameBoyTile = (
  data: number[] | Uint8Array,
  width: number,
  height: number,
): DecodedGBTile => {

  const pixels: number[] = new Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const hiBit = (data[(y * 2) + 1] >> (7 - x)) & 1;
      const loBit = (data[y * 2] >> (7 - x)) & 1;

      pixels[(y * width) + x] = (hiBit << 1) | loBit;
    }
  }

  return {
    pixels,
    width: width,
    height: height,
  };
}
