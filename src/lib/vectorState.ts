import { sliceHEXBlob } from '../utils';

import type { VectorState } from './types';

enum GB_VECTOR_STATE_OFFSET {
  START = 0x011B2,
  END = 0x011CF// NOTE: actual end is 0x011D6 but i dont want to work with checksum
}

const parseVectorState = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer();

  const array = new Uint8Array(arrayBuffer);

  return array.reduce(
    (acc, vector, index) => {
      const isDeleted = vector === 255;

      acc[index] = {
        isDeleted,
        photoIndex: isDeleted
          ? -1
          : vector + 1,
      }

      return acc;
    },
    {} as VectorState,
  );
}

export const getVectorState = (saveFile: Blob) => {
  const vectorStateRaw = sliceHEXBlob(
    saveFile,
    GB_VECTOR_STATE_OFFSET.START,
    GB_VECTOR_STATE_OFFSET.END,
  );

  return parseVectorState(vectorStateRaw);
}
