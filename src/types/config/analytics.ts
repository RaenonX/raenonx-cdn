/**
 * Configuration types for Google Analytics integration
 */

export type AnalyticsConfig = {
  /**
   * Google Analytics Measurement ID (G-XXXXXXXXXX)
   */
  measurementId: string,
  /**
   * Google Analytics API Secret for Measurement Protocol
   */
  apiSecret: string,
  /**
   * Whether analytics collection is enabled
   */
  enabled: boolean,
  /**
   * Endpoint URL for Google Analytics Measurement Protocol
   * @default "https://www.google-analytics.com/mp/collect"
   */
  endpoint?: string,
};
