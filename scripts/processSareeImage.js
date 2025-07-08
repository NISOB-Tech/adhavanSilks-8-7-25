const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [
  { name: '150x200', width: 150, height: 200 },
  { name: '300x400', width: 300, height: 400 },
  { name: '600x800', width: 600, height: 800 }
];

async function processSareeImage(productId, inputPath, baseName = 'primary') {
  const outDir = path.join(__dirname, '..', 'public', 'assets', 'sarees', productId);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Save original as WebP
  const originalWebp = path.join(outDir, `${baseName}-original.webp`);
  await sharp(inputPath)
    .toFormat('webp', { quality: 85 })
    .toFile(originalWebp);

  // Save original as JPEG fallback
  const originalJpg = path.join(outDir, `${baseName}-original.jpg`);
  await sharp(inputPath)
    .jpeg({ quality: 85, progressive: true })
    .toFile(originalJpg);

  // Generate resized versions
  for (const size of sizes) {
    const webpPath = path.join(outDir, `${baseName}-${size.name}.webp`);
    await sharp(inputPath)
      .resize(size.width, size.height, { fit: 'cover', position: 'centre' })
      .toFormat('webp', { quality: 85 })
      .toFile(webpPath);

    // JPEG fallback
    const jpgPath = path.join(outDir, `${baseName}-${size.name}.jpg`);
    await sharp(inputPath)
      .resize(size.width, size.height, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 85, progressive: true })
      .toFile(jpgPath);
  }

  console.log(`Processed images for ${productId} (${baseName}) in ${outDir}`);
}

// Example usage (uncomment to test):
// processSareeImage('ADSAR-2024-001', './uploads/your-uploaded-file.jpg', 'primary')
//   .then(() => console.log('Images processed!'))
//   .catch(console.error);

module.exports = { processSareeImage }; 