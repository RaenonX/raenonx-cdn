import {ImageExtensions} from '@/types/file/extensions';

/**
 * Cached image data structure
 */
export type CachedImage = {
  filePath: string,
  extension: ImageExtensions,
  contentType: string,
};

export type ImageCacheCheckResult = {
  cacheHit: true,
  filePath: string,
  contentType: string,
} | {
  cacheHit: false,
  cacheKey: string,
};
