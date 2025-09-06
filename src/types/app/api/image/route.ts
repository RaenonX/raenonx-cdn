import type {ReadStream} from 'node:fs';

import type {RouteGenericInterface} from 'fastify';

import {ImageQuery} from '@/types/asset/image/request';


export type ImageRepoApiRequest = ImageQuery;

export type ImageRepoApiParams = {
  repo: string,
};

/**
 * Error response for image API requests
 */
export type ImageRepoApiErrorResponse = {
  error: string,
};

/**
 * Successful image API response
 * `ReadStream` when the image is read from the local cache,
 * `Buffer` when the image is not cached, therefore freshly processed
 */
export type ImageRepoApiSuccessResponse = ReadStream | Buffer;

/**
 * Union type for all possible image API responses
 */
export type ImageRepoApiResponse = ImageRepoApiSuccessResponse | ImageRepoApiErrorResponse;

export type ImageRepoRoute = RouteGenericInterface & {
  Params: ImageRepoApiParams,
  Querystring: ImageQuery,
  Reply: ImageRepoApiResponse,
};
