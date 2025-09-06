import {ImageExtensions} from '@/types/file/extensions';


export type ImageQuery = {
  url?: string,
  src?: string,
  w?: string,
  width?: string,
  h?: string,
  height?: string,
  q?: string,
  quality?: string,
  f?: string,
  format?: string,
};

// This is used by generating image cache key, so if this typing changes,
// also check the image cache key generation impl to see if anything needs to be changed.
export type ImageParams = {
  format: ImageExtensions,
  width?: number,
  height?: number,
  quality?: number,
};
