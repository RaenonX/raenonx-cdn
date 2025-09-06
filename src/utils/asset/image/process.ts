import sharp from 'sharp';

import {appConfig} from '@/config/env';
import {ImageParams} from '@/types/asset/image/request';

/**
 * Processes an image using Sharp based on the provided parameters
 * @param imagePath - Absolute path to the source image
 * @param params - Image processing parameters
 * @returns Processed image buffer and content type
 */
export const processImage = async (
  imagePath: string,
  params: ImageParams,
): Promise<{
  buffer: Buffer,
  contentType: string,
}> => {
  const {width, height, quality, format} = params;

  const activeQuality = quality ?? appConfig.image.processing.defaultQuality;

  let pipeline = sharp(imagePath);

  // Apply resizing if width or height is specified
  if (width != null || height != null) {
    pipeline = pipeline.resize(width, height, {
      fit: 'inside', // Maintain aspect ratio
      withoutEnlargement: true, // Don't upscale images
    });
  }

  // Determine output format and apply format-specific options
  let contentType: string;

  if (format === 'webp') {
    pipeline = pipeline.webp({quality: params.quality ?? activeQuality});
    contentType = 'image/webp';
  } else if (format === 'avif') {
    pipeline = pipeline.avif({quality: params.quality ?? activeQuality});
    contentType = 'image/avif';
  } else if (format === 'jpeg' || format === 'jpg') {
    pipeline = pipeline.jpeg({quality: params.quality ?? activeQuality});
    contentType = 'image/jpeg';
  } else if (format === 'png') {
    pipeline = pipeline.png({
      compressionLevel: quality ?
        Math.round((100 - quality) / 10) :
        appConfig.image.processing.defaultPngCompressionLevel,
    });
    contentType = 'image/png';
  } else {
    throw new Error(`Unhandled image format for processing the image: ${format satisfies never}`);
  }

  const buffer = await pipeline.toBuffer();

  return {buffer, contentType};
};
