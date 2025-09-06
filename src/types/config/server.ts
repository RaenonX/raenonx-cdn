export type NodeEnv = 'development' | 'production' | 'test';

export type ServerConfig = {
  port: number,
  host: string,
  nodeEnv: NodeEnv,
};
