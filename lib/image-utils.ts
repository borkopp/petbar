import { getPlaiceholder } from 'plaiceholder';
import fs from 'fs/promises';
import path from 'path';

/**
 * Generate a blur placeholder for a local image
 * @param imagePath Path to the image relative to the public directory
 * @returns Object containing the blur data URL and image dimensions
 */
export async function getLocalImagePlaceholder(imagePath: string) {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const imageBuffer = await fs.readFile(path.join(publicDir, imagePath));
    
    const { base64, metadata } = await getPlaiceholder(imageBuffer, { size: 10 });
    
    return {
      blurDataURL: base64,
      width: metadata.width,
      height: metadata.height,
    };
  } catch (error) {
    console.error(`Error generating placeholder for ${imagePath}:`, error);
    return {
      blurDataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      width: 0,
      height: 0,
    };
  }
}

/**
 * Generate a blur placeholder for a remote image
 * @param imageUrl URL of the remote image
 * @returns Object containing the blur data URL
 */
export async function getRemoteImagePlaceholder(imageUrl: string) {
  try {
    const res = await fetch(imageUrl);
    const buffer = Buffer.from(await res.arrayBuffer());
    const { base64 } = await getPlaiceholder(buffer, { size: 10 });
    
    return {
      blurDataURL: base64,
    };
  } catch (error) {
    console.error(`Error generating placeholder for ${imageUrl}:`, error);
    return {
      blurDataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    };
  }
} 