import type {ReadStream} from 'node:fs';

import type {RouteGenericInterface} from 'fastify';


/**
 * Content API request query parameters
 */
export type ContentRepoApiRequest = {
  src: string,
};

/**
 * Content API route parameters
 */
export type ContentRepoApiParams = {
  repo: string,
};

/**
 * Content API error response
 */
export type ContentRepoApiErrorResponse = {
  error: string,
};

/**
 * Content API response (success returns raw content, error returns JSON)
 */
export type ContentRepoApiResponse = ReadStream | ContentRepoApiErrorResponse;

export type ContentRepoRoute = RouteGenericInterface & {
  Params: ContentRepoApiParams,
  Querystring: ContentRepoApiRequest,
  Reply: ContentRepoApiResponse,
};
