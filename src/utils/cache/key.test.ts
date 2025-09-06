import {describe, it, expect} from '@jest/globals';

import {ImageParams} from '@/types/asset/image/request';
import {generateImageCacheKey} from '@/utils/cache/key';


describe('Cache / Key / Image', () => {
  it('should generate consistent keys for the same inputs', () => {
    const imagePath = '/path/to/image.jpg';
    const params: ImageParams = {format: 'webp', width: 100, height: 200, quality: 80};

    const key1 = generateImageCacheKey(imagePath, params);
    const key2 = generateImageCacheKey(imagePath, params);

    expect(key1).toBe(key2);
    expect(key1).toHaveLength(64); // SHA256 hex digest length
  });

  it('should generate different keys for different image paths', () => {
    const params: ImageParams = {format: 'png', width: 100, height: 200};

    const key1 = generateImageCacheKey('/path1/image.jpg', params);
    const key2 = generateImageCacheKey('/path2/image.jpg', params);

    expect(key1).not.toBe(key2);
  });

  it('should generate different keys for different parameters', () => {
    const imagePath = '/path/to/image.jpg';

    const key1 = generateImageCacheKey(imagePath, {format: 'jpg', width: 100, height: 200});
    const key2 = generateImageCacheKey(imagePath, {format: 'jpg', width: 150, height: 200});
    const key3 = generateImageCacheKey(imagePath, {format: 'jpg', width: 100, height: 250});
    const key4 = generateImageCacheKey(imagePath, {format: 'jpg', width: 100, height: 200, quality: 90});
    const key5 = generateImageCacheKey(imagePath, {format: 'jpeg', width: 100, height: 200});

    expect(key1).not.toBe(key2);
    expect(key1).not.toBe(key3);
    expect(key1).not.toBe(key4);
    expect(key1).not.toBe(key5);
  });

  it('should handle empty parameters', () => {
    const imagePath = '/path/to/image.jpg';

    const key1 = generateImageCacheKey(imagePath, {format: 'png'});
    const key2 = generateImageCacheKey(imagePath, {format: 'png'});

    expect(key1).toBe(key2);
    expect(key1).toHaveLength(64);
  });

  it('should handle undefined parameter values consistently', () => {
    const imagePath = '/path/to/image.jpg';

    const key1 = generateImageCacheKey(imagePath, {format: 'png', width: undefined, height: undefined});
    const key2 = generateImageCacheKey(imagePath, {format: 'png'});

    expect(key1).toBe(key2);
  });

  it('should generate valid hex string', () => {
    const key = generateImageCacheKey('/path', {format: 'png', width: 100});

    expect(key).toMatch(/^[a-f0-9]{64}$/);
  });
});
