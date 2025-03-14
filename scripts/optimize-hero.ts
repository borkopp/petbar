import sharp from "sharp";
import fs from "fs";
import path from "path";

async function optimizeHeroImage(): Promise<void> {
  const inputPath = path.join(process.cwd(), "public", "hero4-original.jpg");
  const outputPath = path.join(process.cwd(), "public", "hero4.jpg");
  const outputWebpPath = path.join(process.cwd(), "public", "hero4.webp");

  try {
    // Create optimized JPEG
    await sharp(inputPath)
      .resize(1920, null, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true })
      .toFile(outputPath);

    // Create WebP version
    await sharp(inputPath)
      .resize(1920, null, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputWebpPath);

    console.log("Hero image optimization complete!");

    // Get file sizes
    const originalSize = fs.statSync(inputPath).size;
    const jpegSize = fs.statSync(outputPath).size;
    const webpSize = fs.statSync(outputWebpPath).size;

    console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Optimized JPEG: ${(jpegSize / 1024 / 1024).toFixed(2)} MB (${((jpegSize / originalSize) * 100).toFixed(2)}%)`);
    console.log(`WebP: ${(webpSize / 1024 / 1024).toFixed(2)} MB (${((webpSize / originalSize) * 100).toFixed(2)}%)`);
  } catch (error) {
    console.error("Error optimizing hero image:", error instanceof Error ? error.message : error);
  }
}

optimizeHeroImage(); 