import type { DecodedGBTile, GBPixel } from './image';

export interface VectorState {
  [slotIndex: number]: {
    isDeleted: boolean;
    photoIndex: number;
  };
}

export type ParsedImage = {
  raw: Uint8Array;
  pixels: GBPixel[][],
  tiles: DecodedGBTile[];
};

export interface PhotoSlotMeta {
  isCopy: boolean;
  border: number;
}

export interface PhotoSlot {
  raw: Uint8Array;
  image: ParsedImage;
  meta: PhotoSlotMeta;
}
