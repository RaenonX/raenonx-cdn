import {appConfig} from '@/config/env';
import {errorMessages} from '@/const/error';
import {ImageRepoApiParams, ImageRepoApiRequest} from '@/types/app/api/image/route';
import {ImageParams} from '@/types/asset/image/request';
import {ImageParamsValidationResult} from '@/types/asset/image/validation';
import {isImageExtensions} from '@/types/file/extensions';


/**
 * Validates request parameters for image requests
 * @param params - Request path parameters
 * @param query - Request query parameters
 * @returns Validation result with extracted data or error information
 */
export const validateImageRequestParams = (
  params: ImageRepoApiParams,
  query: ImageRepoApiRequest,
): ImageParamsValidationResult => {
  const repoId = params.repo;
  const imagePath = query.url ?? query.src;

  if (!repoId) {
    return {
      isValid: false,
      error: errorMessages.MISSING_REPO_ID,
      statusCode: 400,
    };
  }

  if (!imagePath) {
    return {
      isValid: false,
      error: errorMessages.MISSING_IMAGE_PATH,
      statusCode: 400,
    };
  }

  const formatStr = query.f ?? query.format;
  if (formatStr == null) {
    return {
      isValid: false,
      error: errorMessages.MISSING_IMAGE_FORMAT,
      statusCode: 400,
    };
  }

  const format = formatStr.toLowerCase();
  if (!isImageExtensions(format)) {
    return {
      isValid: false,
      error: errorMessages.INVALID_IMAGE_FORMAT,
      statusCode: 400,
    };
  }

  const imageParams: ImageParams = {format};

  const widthStr = query.w ?? query.width;
  if (widthStr != null) {
    const width = parseInt(widthStr, 10);
    if (width > 0 && width <= appConfig.image.processing.maxWidth) {
      imageParams.width = width;
    }
  }

  const heightStr = query.h ?? query.height;
  if (heightStr != null) {
    const height = parseInt(heightStr, 10);
    if (height > 0 && height <= appConfig.image.processing.maxHeight) {
      imageParams.height = height;
    }
  }

  const qualityStr = query.q ?? query.quality;
  if (qualityStr != null) {
    const quality = parseInt(qualityStr, 10);
    if (quality >= 1 && quality <= 100) {
      imageParams.quality = quality;
    }
  }

  return {
    isValid: true,
    repoId,
    imagePath,
    params: imageParams,
  };
};
