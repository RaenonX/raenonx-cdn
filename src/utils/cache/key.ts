import {createHash} from 'crypto';

import {ImageParams} from '@/types/asset/image/request';

/**
 * Generates a cache key based on image path and processing parameters
 * @param imagePath - The path to the image file
 * @param params - The image processing parameters
 * @returns A unique cache key string
 */
export const generateImageCacheKey = (imagePath: string, params: ImageParams): string => {
  const {width, height, quality, format} = params;

  const paramsString = JSON.stringify({width, height, quality, format});

  const keyData = `${imagePath}:${paramsString}`;

  return createHash('sha256').update(keyData).digest('hex');
};
