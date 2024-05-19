import { SavePhotoSlotImage } from '../enums';

import { sliceHEXBlob } from '../utils';

import { parseImageToTilesArray, parseTilesArrayToPixelsArray } from './image';

import type { ParsedImage } from './types';

enum SaveGameFaceOffset {
  START = 0x011FC,
  END = 0x01FFB,
}

export const getGameFaceImage = async (saveFile: Blob): Promise<ParsedImage> => {
  const gameFaceRawData = sliceHEXBlob(
    saveFile,
    SaveGameFaceOffset.START,
    SaveGameFaceOffset.END
  );

  const gameFaceUInt8Array = new Uint8Array(await gameFaceRawData.arrayBuffer());

  const tiles = parseImageToTilesArray(gameFaceUInt8Array);

  const pixels = parseTilesArrayToPixelsArray(
    tiles,
    SavePhotoSlotImage.WIDTH,
    SavePhotoSlotImage.HEIGHT,
  );

  return {
    raw: gameFaceUInt8Array,
    tiles,
    pixels: pixels,
  };
}
