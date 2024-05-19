import { SaveLastSeenImage } from '../enums';

import { sliceHEXBlob } from '../utils';

import { parseImageToTilesArray, parseTilesArrayToPixelsArray } from './image';

import type { ParsedImage } from './types';

enum GB_LAST_IMAGE_OFFSET {
  START = 0x00000,
  END = 0x00FFF,
}

export const getLastSeenSensorImage = async (saveFile: Blob): Promise<ParsedImage> => {
  const lastSeenRawData = sliceHEXBlob(
    saveFile,
    GB_LAST_IMAGE_OFFSET.START,
    GB_LAST_IMAGE_OFFSET.END
  );

  const lastSeenUInt8Array = new Uint8Array(await lastSeenRawData.arrayBuffer());

  const tiles = parseImageToTilesArray(lastSeenUInt8Array);

  const pixels = parseTilesArrayToPixelsArray(
    tiles,
    SaveLastSeenImage.WIDTH,
    SaveLastSeenImage.ACTUAL_HEIGHT,
  );

  const croped = pixels.slice(0, SaveLastSeenImage.HEIGHT);

  return {
    raw: lastSeenUInt8Array,
    tiles,
    pixels: croped,
  };
}
