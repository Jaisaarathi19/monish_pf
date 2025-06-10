const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createFavicon() {
  try {
    // Create PNG versions in different sizes
    const sizes = [16, 32, 48, 64];
    const pngBuffers = [];
    
    for (const size of sizes) {
      const pngBuffer = await sharp('public/favicon.svg')
        .resize(size, size)
        .png()
        .toBuffer();
      pngBuffers.push(pngBuffer);
    }
    
    // For now, let's create a 32x32 PNG and rename it to ICO
    // This is a simple approach that works in most browsers
    await sharp('public/favicon.svg')
      .resize(32, 32)
      .png()
      .toFile('public/favicon.ico');
    
    console.log('Favicon created successfully!');
  } catch (error) {
    console.error('Error creating favicon:', error);
  }
}

createFavicon();
