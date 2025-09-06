import {existsSync} from 'fs';
import {mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'path';

import {appConfig} from '@/config/env';
import {CachedImage, ImageCacheCheckResult} from '@/types/asset/image/cache';
import {ImageParams} from '@/types/asset/image/request';
import {ImageExtensions} from '@/types/file/extensions';
import {getImageCache} from '@/utils/cache/const';
import {generateImageCacheKey} from '@/utils/cache/key';


/**
 * Checks cache for an existing processed image
 * @param repoId - Repository identifier
 * @param imagePath - Image path within the repository
 * @param imageParams - Image processing parameters
 * @returns Cache result with buffer/content type or cache key for miss
 */
export const checkImageCache = (
  repoId: string,
  imagePath: string,
  imageParams: ImageParams,
): ImageCacheCheckResult => {
  // Generate cache key
  const cacheKey = generateImageCacheKey(imagePath, imageParams);

  const cachedEntry = getImageCache(repoId, imageParams.format).get(cacheKey);
  if (!cachedEntry || !existsSync(cachedEntry.filePath)) {
    return {cacheHit: false, cacheKey};
  }

  return {
    cacheHit: true,
    filePath: cachedEntry.filePath,
    contentType: cachedEntry.contentType,
  };
};

export const writeImageCache = (
  cacheKey: string,
  buffer: Buffer,
  contentType: string,
  repoId: string,
  extension: ImageExtensions,
): CachedImage => {
  const cacheDir = resolve(appConfig.cache.directory);
  mkdirSync(cacheDir, {recursive: true});

  const localFilePath = resolve(cacheDir, cacheKey);
  writeFileSync(localFilePath, buffer);

  const cachedImage: CachedImage = {
    filePath: localFilePath,
    extension,
    contentType,
  };

  const cache = getImageCache(repoId, extension);
  cache.set(cacheKey, cachedImage);
  return cachedImage;
};
