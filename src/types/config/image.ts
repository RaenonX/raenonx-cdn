export type ImageProcessingConfig = {
  defaultQuality: number,
  defaultPngCompressionLevel: number,
  maxWidth: number,
  maxHeight: number,
};

export type ImageConfig = {
  processing: ImageProcessingConfig,
};
