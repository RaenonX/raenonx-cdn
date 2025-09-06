/**
 * Main configuration types for YAML configuration
 */
import {CacheConfig} from '@/types/config/cache';
import {CorsConfig} from '@/types/config/cors';
import {ImageConfig} from '@/types/config/image';
import {Repositories} from '@/types/config/repo';
import {ServerConfig} from '@/types/config/server';


export type AppConfig = {
  server: ServerConfig,
  cors: CorsConfig,
  cache: CacheConfig,
  image: ImageConfig,
  repositories: Repositories,
};
