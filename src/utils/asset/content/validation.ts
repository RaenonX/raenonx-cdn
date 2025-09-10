import {errorMessages} from '@/const/error';
import {ContentRepoApiParams, ContentRepoApiRequest} from '@/types/app/api/content/route';
import {ContentParamsValidationResult} from '@/types/asset/content/validation';


/**
 * Validates request parameters for content requests
 * @param params - Request path parameters
 * @param query - Request query parameters
 * @returns Validation result with extracted data or error information
 */
export const validateContentRequestParams = (
  params: ContentRepoApiParams,
  query: ContentRepoApiRequest,
): ContentParamsValidationResult => {
  const repoId = params.repo;
  const contentPath = query.src ?? query.url;

  if (!repoId) {
    return {
      isValid: false,
      error: errorMessages.MISSING_REPO_ID,
      statusCode: 400,
    };
  }

  if (!contentPath) {
    return {
      isValid: false,
      error: errorMessages.MISSING_CONTENT_PATH,
      statusCode: 400,
    };
  }

  return {
    isValid: true,
    repoId,
    contentPath,
  };
};
