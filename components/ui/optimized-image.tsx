import {getLocalImagePlaceholder, getRemoteImagePlaceholder} from "@/lib/image-utils";
import {BlurImage} from "./blur-image";
import {ImageProps} from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, "placeholder" | "blurDataURL"> {
  /**
   * CSS class to apply when the image is loading
   */
  loadingClassName?: string;
}

/**
 * Server component that automatically generates blur placeholders for images
 * Uses Plaiceholder to generate optimized blur placeholders
 */
export async function OptimizedImage({src, alt, width, height, ...props}: OptimizedImageProps) {
  // Determine if the image is local or remote
  const isRemoteImage = typeof src === "string" && (src.startsWith("http://") || src.startsWith("https://"));
  const isLocalImage = typeof src === "string" && !isRemoteImage;

  let blurDataURL: string | undefined;

  // Generate blur placeholder based on image type
  if (isLocalImage) {
    const placeholder = await getLocalImagePlaceholder(src as string);
    blurDataURL = placeholder.blurDataURL;
  } else if (isRemoteImage) {
    const placeholder = await getRemoteImagePlaceholder(src as string);
    blurDataURL = placeholder.blurDataURL;
  }

  return <BlurImage src={src} alt={alt} width={width} height={height} blurDataURL={blurDataURL} {...props} />;
}
