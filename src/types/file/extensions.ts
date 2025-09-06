export const imageExtensions = [
  'webp',
  'avif',
  'jpeg',
  'jpg',
  'png',
] as const;

export type ImageExtensions = typeof imageExtensions[number];

export const isImageExtensions = (format: string): format is ImageExtensions => (
  imageExtensions.includes(format as ImageExtensions)
);
