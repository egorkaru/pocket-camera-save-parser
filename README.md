# pocket-camera-save-parser
> Simple parser for GameBoy/Pocket Camera written in typescript 

## Installation

```bash
$ npm install --pocket-camera-save-parser
```

### TODO
- [x] Get images from user gallery
- [x] Get last image seen by the sensor
- [x] Get game face image
- [ ] Better parser for save meta information(JP&INT)
- [ ] Write documentation for this lib

## Usage

Simple script to get photos from save file and print it to cli can looks like

```ts
import path from 'path';

import { readFile } from 'node:fs/promises';

import { parseSaveFile, GBPixel, createHexBlob } from 'pocket-camera-save-parser';

const SAVE_FILE_PATH = path.resolve(__dirname, './input/test.sav'); // Path to your save file

type TPallette = [string, string, string, string];

const TEST_ASCII_PALLETTE: TPallette = [
  ' ',
  '.',
  ':',
  '+',
];

const getPixelColor = (pixel: GBPixel) => TEST_ASCII_PALLETTE[pixel];

const loadSaveFileAsBlob = async(path: string) => {
  const data = await readFile(path);

  return createHexBlob(data);
}

const printImagesFromGBSaveInCli = async () => {
  const saveFile = await loadSaveFileAsBlob(SAVE_FILE_PATH);

  const save = await parseSaveFile(saveFile);

  save.photoSlots
    .filter(({ photoIndex }) => photoIndex > 0) // Show only not deleted images
    .map(({ image, photoIndex, slotIndex }) => {
      console.log(`---[IMAGE_ALBUM_INDEX:${photoIndex}]-[MEMORY_SLOT:${String(slotIndex).padStart(2, '0')}]${'-'.repeat(87)}`);

      image.pixels.forEach((line) => {
        console.log(line.map(getPixelColor).join(''));
      })
    })
}

printImagesFromGBSaveInCli();


```
