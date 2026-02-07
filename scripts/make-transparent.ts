import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const inputPath = path.resolve('attached_assets/impero_logo_new.png');
const outputPath = path.resolve('attached_assets/impero_logo_transparent.png');

async function processImage() {
    console.log('Processing image:', inputPath);

    try {
        const { data, info } = await sharp(inputPath)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const pixelArray = new Uint8ClampedArray(data.buffer);

        // Threshold for "white" - 240 out of 255
        const threshold = 230;

        for (let i = 0; i < pixelArray.length; i += 4) {
            const r = pixelArray[i];
            const g = pixelArray[i + 1];
            const b = pixelArray[i + 2];

            // If the pixel is white-ish, make it transparent
            if (r > threshold && g > threshold && b > threshold) {
                pixelArray[i + 3] = 0; // Set alpha to 0
            }
        }

        await sharp(pixelArray, {
            raw: {
                width: info.width,
                height: info.height,
                channels: 4
            }
        })
            .png()
            .toFile(outputPath);

        console.log('Successfully created transparent logo at:', outputPath);
    } catch (err) {
        console.error('Error processing image:', err);
    }
}

processImage();
