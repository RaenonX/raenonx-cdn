import {createReadStream} from 'fs';

import type {FastifyRequest} from 'fastify';

import {ContentRepoRoute} from '@/types/app/api/content/route';
import {RoutedFastifyReply} from '@/types/fastify';
import {validateContentRequestParams} from '@/utils/asset/content/validation';
import {resolveAssetPath} from '@/utils/asset/path';
import {setAssetReplyHeaders} from '@/utils/asset/reply';

/**
 * Handles content serving requests with repository ID mapping
 * @param request - Fastify request object with repo ID and path parameters
 * @param reply - Fastify reply object
 */
export const handleContentRepoRequest = async (
  request: FastifyRequest<ContentRepoRoute>,
  reply: RoutedFastifyReply<ContentRepoRoute>,
): Promise<void> => {
  // Validate params
  const validationResult = validateContentRequestParams(request.params, request.query);
  if (!validationResult.isValid) {
    return reply.code(validationResult.statusCode ?? 400).send({error: validationResult.error});
  }

  // Resolve asset path
  const resolution = await resolveAssetPath(validationResult.repoId, validationResult.contentPath);
  if (!resolution.isValid) {
    return reply.code(resolution.statusCode ?? 400).send({error: resolution.error});
  }

  // Set response headers
  setAssetReplyHeaders(
    reply,
    resolution.fileSizeBytes,
    {
      contentType: resolution.fileMeta.contentType,
      cacheControl: resolution.cacheControl,
    },
  );

  return reply.send(createReadStream(resolution.resolvedPath));
};
