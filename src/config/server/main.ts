import cors from '@fastify/cors';
import fastifyInit from 'fastify';

import {appConfig, configHelpers} from '@/config/env';
import {registerRoutes} from '@/config/server/route';

/**
 * Creates and configures the Fastify server
 */
export const createFastifyServer = async () => {
  const fastify = fastifyInit({
    logger: appConfig.server.nodeEnv !== 'production' ?
      {
        level: 'info',
        transport: {
          target: 'pino-pretty',
        },
      } :
      {
        level: 'info',
      },
  });

  // Configure CORS using environment variables
  await fastify.register(cors, {
    origin: configHelpers.getCorsOrigin(),
    credentials: appConfig.cors.credentials,
    methods: configHelpers.getCorsMethods(),
    allowedHeaders: configHelpers.getCorsHeaders(),
  });

  await registerRoutes(fastify);

  return fastify;
};
