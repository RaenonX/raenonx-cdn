import {AddressInfo} from 'node:net';

/**
 * Finds the next available port starting from the given port
 */
export const findAvailablePort = async (startPort: number, host: string): Promise<number> => {
  const net = await import('net');

  return new Promise((resolve) => {
    const server = net.createServer();

    server.listen(startPort, host, () => {
      const port = (server.address() as AddressInfo)?.port;
      server.close(() => resolve(port));
    });

    server.on('error', () => {
      // Port is in use, try the next one
      resolve(findAvailablePort(startPort + 1, host));
    });
  });
};
