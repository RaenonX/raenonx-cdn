import {createReadStream} from 'fs';
import type {ReadStream} from 'node:fs';

import type {FastifyRequest} from 'fastify';

import {ImageRepoRoute} from '@/types/app/api/image/route';
import {RoutedFastifyReply} from '@/types/fastify';
import {collectAnalyticsData} from '@/utils/analytics/collect';
import {sendAnalyticsAsync} from '@/utils/analytics/report';
import {checkImageCache, writeImageCache} from '@/utils/asset/image/cache';
import {processImage} from '@/utils/asset/image/process';
import {validateImageRequestParams} from '@/utils/asset/image/validation';
import {resolveAssetPath} from '@/utils/asset/path';
import {setAssetReplyHeaders} from '@/utils/asset/reply';


/**
 * Handles image optimization requests with repository ID mapping
 * @param request - Fastify request object with repo ID and path parameters
 * @param reply - Fastify reply object
 */
export const handleImageRepoRequest = async (
  request: FastifyRequest<ImageRepoRoute>,
  reply: RoutedFastifyReply<ImageRepoRoute>,
): Promise<void> => {
  // Validate params
  const validationResult = validateImageRequestParams(request.params, request.query);
  if (!validationResult.isValid) {
    return reply.code(validationResult.statusCode ?? 400).send({error: validationResult.error});
  }

  // Collect and send analytics data asynchronously
  const analyticsData = collectAnalyticsData(request, validationResult.repoId, 'image');
  sendAnalyticsAsync(analyticsData);

  // Resolve asset path
  const resolution = await resolveAssetPath(validationResult.repoId, validationResult.imagePath);
  if (!resolution.isValid) {
    return reply.code(resolution.statusCode ?? 400).send({error: resolution.error});
  }

  // Check cache first
  const cacheResult = checkImageCache(
    validationResult.repoId,
    validationResult.imagePath,
    validationResult.params,
  );

  let contentType: string;
  let stream: ReadStream | Buffer;

  if (cacheResult.cacheHit) {
    contentType = cacheResult.contentType;
    stream = createReadStream(cacheResult.filePath);
  } else {
    const processed = await processImage(resolution.resolvedPath, validationResult.params);
    contentType = processed.contentType;
    stream = processed.buffer;

    // Write to cache
    writeImageCache(
      cacheResult.cacheKey,
      processed.buffer,
      processed.contentType,
      validationResult.repoId,
      validationResult.params.format,
    );
  }

  // Set response headers
  setAssetReplyHeaders(
    reply,
    resolution.fileSizeBytes,
    {
      contentType: contentType,
      cacheControl: resolution.cacheControl,
    },
  );

  return reply.send(stream);
};
