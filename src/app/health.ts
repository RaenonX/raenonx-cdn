import type {FastifyRequest, FastifyReply} from 'fastify';

import {HealthResponse} from '@/types/app/health/response';
import {collectAnalyticsData} from '@/utils/analytics/collect';
import {sendAnalyticsAsync} from '@/utils/analytics/report';

/**
 * Handles health check requests
 */
export const handleHealthCheck = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<HealthResponse> => {
  // Collect and send analytics data asynchronously
  const analyticsData = collectAnalyticsData(request, undefined, 'health');
  sendAnalyticsAsync(analyticsData);

  const response: HealthResponse = {status: 'ok', timestamp: new Date().toISOString()};
  return reply.send(response);
};
