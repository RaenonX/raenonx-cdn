import type {ReadStream} from 'node:fs';

import type {RouteGenericInterface} from 'fastify';


/**
 * Content API request query parameters
 * Either 'src' or 'url' parameter can be used to specify the content path
 */
export type ContentRepoApiRequest = {
  src?: string,
  url?: string,
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
