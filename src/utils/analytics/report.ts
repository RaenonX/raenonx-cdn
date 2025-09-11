/**
 * Google Analytics reporting utilities using Measurement Protocol
 */

import {appConfig} from '@/config/env';
import {AnalyticsRequestData, GoogleAnalyticsEvent, GoogleAnalyticsPayload} from '@/types/analytics/data';


/**
 * Generates a client ID for Google Analytics
 * Uses a combination of IP and timestamp for uniqueness
 * @param analyticsData - Analytics data containing IP and other identifiers
 * @returns Generated client ID
 */
export const generateClientId = (analyticsData: AnalyticsRequestData): string => {
  // Use IP if available, otherwise use timestamp-based ID
  const baseId = analyticsData.ip ?? `anonymous_${Date.now()}`;

  // Create a simple hash-like ID
  const hash = baseId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) & 0xffffffff;
  }, 0);

  // Format as a positive number with timestamp
  return `${Math.abs(hash)}.${Date.now()}`;
};

/**
 * Converts analytics request data to Google Analytics event
 * @param analyticsData - Collected analytics data
 * @returns Google Analytics event object
 */
export const createAnalyticsEvent = (analyticsData: AnalyticsRequestData): GoogleAnalyticsEvent => {
  const clientId = generateClientId(analyticsData);

  return {
    client_id: clientId,
    name: 'cdn_api_request',
    parameters: {
      api_endpoint: analyticsData.endpoint,
      repository_id: analyticsData.repositoryId,
      user_ip: analyticsData.ip,
      user_country: analyticsData.country,
      request_origin: analyticsData.origin,
      host_url: analyticsData.hostUrl,
      // Spread query parameters as individual parameters
      ...analyticsData.queryParameters,
    },
  };
};

/**
 * Creates the complete Google Analytics payload
 * @param analyticsData - Collected analytics data
 * @returns Google Analytics Measurement Protocol payload
 */
export const createAnalyticsPayload = (analyticsData: AnalyticsRequestData): GoogleAnalyticsPayload => {
  const event = createAnalyticsEvent(analyticsData);

  return {
    client_id: event.client_id,
    events: [event],
  };
};

/**
 * Sends analytics data to Google Analytics using Measurement Protocol
 * @param analyticsData - Collected analytics data
 * @returns Promise that resolves when data is sent (or rejects on error)
 */
export const sendAnalyticsData = async (analyticsData: AnalyticsRequestData): Promise<void> => {
  // Check if analytics is enabled
  if (!appConfig.analytics.enabled) {
    return;
  }

  const payload = createAnalyticsPayload(analyticsData);
  const endpoint = appConfig.analytics.endpoint ?? 'https://www.google-analytics.com/mp/collect';

  const url = new URL(endpoint);
  url.searchParams.set('measurement_id', appConfig.analytics.measurementId);
  url.searchParams.set('api_secret', appConfig.analytics.apiSecret);

  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Google Analytics API error: ${response.status} ${response.statusText}`);
      // Don't throw error to avoid affecting the main API response
      return;
    }
  } catch (error) {
    console.error('Failed to send analytics data:', error);
    // Don't throw error to avoid affecting the main API response
  }
};

/**
 * Sends analytics data asynchronously without blocking the main response
 * @param analyticsData - Collected analytics data
 */
export const sendAnalyticsAsync = (analyticsData: AnalyticsRequestData): void => {
  // Send analytics data without awaiting to avoid blocking the main response
  sendAnalyticsData(analyticsData).catch((error) => {
    console.error('Analytics reporting failed:', error);
  });
};
