import {unlinkSync} from 'fs';

import TTLCache from '@isaacs/ttlcache';

import {appConfig} from '@/config/env';
import {CachedImage} from '@/types/asset/image/cache';


/**
 * Map of repository-specific TTL cache instances for processed images
 * Repository ID > Extension > TTLCache
 */
const imageCacheInstance = new Map<string, Map<string, TTLCache<string, CachedImage>>>();

/**
 * Gets or creates a repository-specific image cache instance
 * @param repoId - Repository identifier
 * @param extension - Image extension
 * @returns TTL cache instance for the specified repository
 */
export const getImageCache = (repoId: string, extension: string): TTLCache<string, CachedImage> => {
  let repoMap = imageCacheInstance.get(repoId);
  if (!repoMap) {
    repoMap = new Map<string, TTLCache<string, CachedImage>>();
    imageCacheInstance.set(repoId, repoMap);
  }

  let cache = repoMap.get(extension);
  if (cache) {
    return cache;
  }

  const repoCacheConfig = appConfig.repositories?.[repoId]?.images[repoId]?.storage ?? appConfig.cache.storage;

  cache = new TTLCache<string, CachedImage>({
    max: repoCacheConfig.maxSize ?? Infinity,
    ttl: repoCacheConfig.ttl,
    dispose: ({filePath}) => {
      // Remove file from disk when cache entry expires
      try {
        unlinkSync(filePath);
      } catch {}
    },
  });

  repoMap.set(extension, cache);
  return cache;
};
