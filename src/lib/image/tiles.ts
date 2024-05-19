import { GBTile } from '../../enums';

import { decodeGameBoyTile } from './decodeGameBoyTile';

import type { DecodedGBTile } from './types';

export const parseImageToTilesArray = (tiles: Uint8Array) => {
  const decodedTiles: DecodedGBTile[] = [];

  for (
    let tileStartPosition = 0;
    tileStartPosition < tiles.length;
    tileStartPosition += GBTile.BYTES_COUNT
  ) {
      const tile = tiles.slice(tileStartPosition, tileStartPosition + GBTile.BYTES_COUNT);

      const decodedTile = decodeGameBoyTile(tile, GBTile.WIDTH, GBTile.HEIGHT);

      decodedTiles.push(decodedTile);
  }

  return decodedTiles;
}
