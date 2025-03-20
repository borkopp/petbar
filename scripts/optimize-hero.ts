import sharp from "sharp";
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
  } catch (error) {
    throw error;
  }
}

optimizeHeroImage();