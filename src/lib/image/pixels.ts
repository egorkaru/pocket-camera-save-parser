import type { GBPixel, DecodedGBTile } from './types';

const createEmptyPixelsArray = (height: number) => (
  [...Array(height)]
    .map(() => []) as number[][]
);

export const parseTilesArrayToPixelsArray = (array: DecodedGBTile[], width: number, height: number) => {
  const pixels = createEmptyPixelsArray(height);
  const tilesPerLine = width / array[0].width;

  array.forEach((tile, tileIndex) => {
    const tileXOffset = tileIndex % tilesPerLine;
    const tileYOffset = Math.floor(tileIndex / tilesPerLine);
  
    const pixelXOffset = tile.width * tileXOffset;
    const pixelYOffset = tile.height * tileYOffset;

    for (let x = 0; x < tile.width; x += 1) {
      for (let y = 0; y < tile.height; y += 1) {
        pixels[y + pixelYOffset][x + pixelXOffset] = tile.pixels[(y * tile.width) + x];
      }
    }
  })

  return pixels as never as GBPixel[][];
}
