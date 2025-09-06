import {FastifyInstance} from 'fastify';

import {handleContentRepoRequest} from '@/app/api/content/[repo]/route';
import {handleImageRepoRequest} from '@/app/api/image/[repo]/route';
import {handleHealthCheck} from '@/app/health';


/**
 * Registers all routes on the Fastify instance
 * @param fastify - The Fastify server instance
 */
export const registerRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // Health check endpoint
  fastify.get('/health', handleHealthCheck);

  // Repository-based image endpoint
  fastify.get('/api/image/:repo', handleImageRepoRequest);

  // Repository-based content endpoint
  fastify.get('/api/content/:repo', handleContentRepoRequest);
};
