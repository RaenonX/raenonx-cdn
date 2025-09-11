/**
 * Utilities for collecting analytics data from FastifyRequest
 */

import type {FastifyRequest} from 'fastify';

import {AnalyticsRequestData} from '@/types/analytics/data';


/**
 * Extracts IP address from Cloudflare CF-Connecting-IP header
 * @param request - Fastify request object
 * @returns IP address if available, undefined otherwise
 */
export const extractClientIp = (request: FastifyRequest): string | undefined => {
  const cfConnectingIp = request.headers['cf-connecting-ip'];

  if (typeof cfConnectingIp === 'string') {
    return cfConnectingIp;
  }

  // Handle array case (unlikely but possible with headers)
  if (Array.isArray(cfConnectingIp) && cfConnectingIp.length > 0) {
    return cfConnectingIp[0];
  }

  return undefined;
};

/**
 * Extracts country code from Cloudflare CF-IPCountry header
 * @param request - Fastify request object
 * @returns Country code if available, undefined otherwise
 */
export const extractCountry = (request: FastifyRequest): string | undefined => {
  const cfIpCountry = request.headers['cf-ipcountry'];

  if (typeof cfIpCountry === 'string') {
    return cfIpCountry;
  }

  // Handle array case (unlikely but possible with headers)
  if (Array.isArray(cfIpCountry) && cfIpCountry.length > 0) {
    return cfIpCountry[0];
  }

  return undefined;
};

/**
 * Extracts origin from request headers (prioritizes Origin over Referer)
 * @param request - Fastify request object
 * @returns Origin URL if available, undefined otherwise
 */
export const extractOrigin = (request: FastifyRequest): string | undefined => {
  // Try Origin header first
  const origin = request.headers.origin;
  if (typeof origin === 'string') {
    return origin;
  }

  // Fallback to Referer header
  const referer = request.headers.referer;
  if (typeof referer === 'string') {
    return referer;
  }

  return undefined;
};

/**
 * Extracts host URL from request headers
 * @param request - Fastify request object
 * @returns Host URL if available, undefined otherwise
 */
export const extractHostUrl = (request: FastifyRequest): string | undefined => {
  const host = request.headers.host;
  if (typeof host === 'string') {
    // Construct full URL with protocol
    const protocol = request.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    return `${protocol}://${host}`;
  }

  return undefined;
};

/**
 * Parses query parameters and converts them to appropriate types
 * @param queryParams - Raw query parameters object
 * @returns Processed query parameters with proper typing
 */
export const parseQueryParameters = (
  queryParams: Record<string, unknown>,
): Record<string, string | number | boolean> => {
  const parsed: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined || value === null) {
      continue;
    }

    // Convert arrays to string (join with comma)
    if (Array.isArray(value)) {
      parsed[key] = value.join(',');
      continue;
    }

    const stringValue = String(value);

    // Try to parse as number
    const numValue = Number(stringValue);
    if (!isNaN(numValue) && isFinite(numValue) && stringValue.trim() !== '') {
      parsed[key] = numValue;
      continue;
    }

    // Try to parse as boolean
    const lowerValue = stringValue.toLowerCase();
    if (lowerValue === 'true') {
      parsed[key] = true;
      continue;
    }
    if (lowerValue === 'false') {
      parsed[key] = false;
      continue;
    }

    // Default to string
    parsed[key] = stringValue;
  }

  return parsed;
};

/**
 * Collects all analytics data from a FastifyRequest
 * @param request - Fastify request object
 * @param repositoryId - Repository ID from the API path
 * @param endpoint - API endpoint type ('image' or 'content')
 * @returns Complete analytics data object
 */
export const collectAnalyticsData = (
  request: FastifyRequest,
  repositoryId: string,
  endpoint: 'image' | 'content',
): AnalyticsRequestData => {
  return {
    ip: extractClientIp(request),
    country: extractCountry(request),
    origin: extractOrigin(request),
    hostUrl: extractHostUrl(request),
    repositoryId,
    queryParameters: parseQueryParameters(request.query as Record<string, unknown>),
    endpoint,
    timestamp: new Date().toISOString(),
  };
};
