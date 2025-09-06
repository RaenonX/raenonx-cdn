/**
 * Result of content request parameters validation
 */
export type ContentParamsValidationResult = {
  isValid: true,
  repoId: string,
  contentPath: string,
} | {
  isValid: false,
  error: string,
  statusCode: number,
};
