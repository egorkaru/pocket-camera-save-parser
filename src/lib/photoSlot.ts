import { SavePhotoSlotImage } from '../enums';

import { sliceHEXBlob } from '../utils';
import { parseImageToTilesArray, parseTilesArrayToPixelsArray } from './image';

import type { PhotoSlotMeta } from './types';


const GB_FIRST_PHOTO_OFFSET = 0x2000;
const GB_PHOTO_SIZE = 0x1000;

enum GB_PHOTO_SLOT_OFFSET {
  IMAGE_START = 0x00000,
  IMAGE_END = 0x00DFF,

  // THUMBNAIL_START = 0x00E00,
  // THUMBNAIL_END = 0x00EFF,

  METADATA_START = 0x00F00,
  METADATA_END = 0x00FFF,
}

enum GB_PHOTO_META_OFFSET {
  ORIGINAL = 0x00033,

  BORDER_NUMBER = 0x00054,
}

const getPhotoSlotMeta = async (slot: Blob): Promise<PhotoSlotMeta> => {
  const meta = sliceHEXBlob(
    slot,
    GB_PHOTO_SLOT_OFFSET.METADATA_START,
    GB_PHOTO_SLOT_OFFSET.METADATA_END,
  );

  const original = sliceHEXBlob(
    meta,
    GB_PHOTO_META_OFFSET.ORIGINAL,
  );

  const borderNumber = sliceHEXBlob(
    meta,
    GB_PHOTO_META_OFFSET.BORDER_NUMBER,
  );

  const originalArrayBuffer = await original.arrayBuffer();
  const borderArrayBuffer = await borderNumber.arrayBuffer();

  const isCopy = new Uint8Array(originalArrayBuffer).at(0) === 0x01;
  const border = new Uint8Array(borderArrayBuffer).at(0)!;

  return {
    isCopy,
    border,
  };
}

export const getPhotoSlotImage = async (slot: Blob) => {
  const photoRawData = sliceHEXBlob(
    slot,
    GB_PHOTO_SLOT_OFFSET.IMAGE_START,
    GB_PHOTO_SLOT_OFFSET.IMAGE_END,
  );

  const photoArrayBuffer = await photoRawData.arrayBuffer();

  const photo = new Uint8Array(photoArrayBuffer);

  const tiles = parseImageToTilesArray(photo);

  const pixels = parseTilesArrayToPixelsArray(
    tiles,
    SavePhotoSlotImage.WIDTH,
    SavePhotoSlotImage.HEIGHT,
  );

  return {
    raw: photo,
    tiles,
    pixels,
  }
}

export const getPhotoSlot = async (saveFile: Blob, index: number) => {
  const offset = GB_FIRST_PHOTO_OFFSET + index * GB_PHOTO_SIZE;

  const slot = sliceHEXBlob(
    saveFile,
    offset,
    offset + GB_PHOTO_SIZE - 1,
  );

  const slotUInt8Array = new Uint8Array(await slot.arrayBuffer());

  const image = await getPhotoSlotImage(slot);

  const meta = await getPhotoSlotMeta(slot);

  return {
    raw: slotUInt8Array,
    image,
    meta,
  };
}
