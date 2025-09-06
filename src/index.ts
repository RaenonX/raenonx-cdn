import {appConfig} from '@/config/env';
import {findAvailablePort} from '@/config/server/findPort';
import {createFastifyServer} from '@/config/server/main';


/**
 * Starts the server
 */
const start = async () => {
  try {
    const server = await createFastifyServer();
    const defaultPort = appConfig.server.port;
    const host = appConfig.server.host;

    // Find an available port starting from the default port
    const port = await findAvailablePort(defaultPort, host);

    await server.listen({port, host});

    console.info(`Image CDN server running on http://${host}:${port}`);
    console.info(`Image endpoint: http://${host}:${port}/api/image`);
    console.info(`Health check: http://${host}:${port}/health`);

    if (port !== defaultPort) {
      console.warn(`Default port ${defaultPort} was unavailable, using port ${port} instead`);
    }
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

start().catch(console.error);
