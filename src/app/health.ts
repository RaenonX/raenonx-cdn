import {HealthResponse} from '@/types/app/health/response';

/**
 * Handles health check requests
 */
export const handleHealthCheck = async (): Promise<HealthResponse> => {
  return {status: 'ok', timestamp: new Date().toISOString()};
};
