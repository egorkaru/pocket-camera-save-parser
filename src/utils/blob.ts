const HEX_MINE_TYPE = 'application/octet-stream';

export const sliceHEXBlob = (blob: Blob, start: number, end?: number) => (
  blob
    .slice(start, (end || start) + 1, HEX_MINE_TYPE)
);

export const createHexBlob = (data: BlobPart) => new Blob([data], { type: HEX_MINE_TYPE });
