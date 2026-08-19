const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGE_DIR = './assets';
const MAX_WIDTH = 1600;
const QUALITY = 80;

// Only touch the mosaic photos — skip logo, favicon, og-image
const TARGET_FILES = ['photo-1.jpg', 'photo-2.jpg', 'photo-3.jpg', 'photo-4.jpg', 'photo-5.jpg'];

async function optimizeImages(dir) {
  for (const file of TARGET_FILES) {
    const fullPath = path.join(dir, file);

    if (!fs.existsSync(fullPath)) {
      console.log(`Skipping ${file} — not found`);
      continue;
    }

    const originalSize = fs.statSync(fullPath).size;
    const buffer = fs.readFileSync(fullPath);

    const optimized = await sharp(buffer)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer();

    fs.writeFileSync(fullPath, optimized);

    const newSize = optimized.length;
    console.log(`${file}: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024 / 1024).toFixed(2)}MB`);
  }
}

optimizeImages(IMAGE_DIR).then(() => console.log('Done!'));