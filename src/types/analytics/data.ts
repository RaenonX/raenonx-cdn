/**
 * Types for analytics data collection and reporting
 */

/**
 * Base analytics data captured from all API requests
 */
export type AnalyticsRequestData = {
  /**
   * Country code from CF-IPCountry header
   */
  country?: string,
  /**
   * Origin of the request (referrer or origin header)
   */
  origin?: string,
  /**
   * Host URL of the current server handling the request
   */
  hostUrl?: string,
  /**
   * Repository ID from the API path parameter (optional for health endpoint)
   */
  repositoryId?: string,
  /**
   * Individual query parameters broken down as key-value pairs
   * Each query parameter is stored separately for analytics
   */
  queryParameters: Record<string, string | number | boolean>,
  /**
   * API endpoint type
   */
  endpoint: 'image' | 'content' | 'health',
  /**
   * Timestamp of the request
   */
  timestamp: string,
};

/**
 * Google Analytics Measurement Protocol event data structure
 */
export type GoogleAnalyticsEvent = {
  /**
   * Event name
   */
  name: string,
  /**
   * Event parameters
   */
  params: {
    /**
     * Custom parameters for the CDN API usage
     */
    api_endpoint?: string,
    repository_id?: string,
    country?: string,
    request_origin?: string,
    host_url?: string,
    /**
     * Dynamic query parameters (flattened)
     */
    [key: string]: string | number | boolean | undefined,
  },
};

/**
 * Complete Google Analytics Measurement Protocol payload
 */
export type GoogleAnalyticsPayload = {
  /**
   * Client ID for user identification
   */
  client_id: string,
  /**
   * Timestamp in microseconds (optional, defaults to current time if not provided)
   */
  timestamp_micros?: string,
  /**
   * Events array
   */
  events: GoogleAnalyticsEvent[],
};
