export type CacheHttpHeaderConfig = {
  maxAge: number,
  control: string,
};

export type CacheStorageConfig = {
  // `null` indicates no limit
  maxSize: number | null,
  ttl: number,
};

export type CacheConfig = {
  directory: string,
  httpHeader: CacheHttpHeaderConfig,
  storage: CacheStorageConfig,
};
