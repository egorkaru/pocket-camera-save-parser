import { getGameFaceImage } from './gameFace';
import { getLastSeenSensorImage } from './lastSeenSensorImage';
import { getPhotoSlot } from './photoSlot';
import { getVectorState } from './vectorState';

import type { ParsedImage, PhotoSlot, VectorState } from './types';

export enum GB_PHOTO_SLOT_INDEX {
  FIRST = 0,
  LAST = 29,
}

type ParsedPhotoSlot =
  & PhotoSlot
  & VectorState[number]
  & { slotIndex: number };

export interface IParsedSave {
  lastSeenImage: ParsedImage;
  gameFaceImage: ParsedImage;
  photoSlots: ParsedPhotoSlot[];
}

export const parseSaveFile = async (saveFileBlob: Blob): Promise<IParsedSave> => {
  
  const lastSeenImage = await getLastSeenSensorImage(saveFileBlob);

  const vectorState = await getVectorState(saveFileBlob)

  const gameFaceImage = await getGameFaceImage(saveFileBlob);

  const photos: ParsedPhotoSlot[] = [];

  for (
    let slotIndex = GB_PHOTO_SLOT_INDEX.FIRST;
    slotIndex <= GB_PHOTO_SLOT_INDEX.LAST;
    slotIndex += 1
  ) {
    const currentPhoto = await getPhotoSlot(saveFileBlob, slotIndex);

    photos.push({
      slotIndex,
      ...currentPhoto,
      ...vectorState[slotIndex],
    });
  }

  return {
    lastSeenImage,
    gameFaceImage,
    photoSlots: photos,
  }
}
