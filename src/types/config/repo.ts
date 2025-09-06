import {CacheHttpHeaderConfig, CacheStorageConfig} from '@/types/config/cache';


export type RepositoryContentFileDef = {
  httpHeader?: CacheHttpHeaderConfig,
};

export type RepositoryImageFileDef = RepositoryContentFileDef & {
  storage?: CacheStorageConfig,
};

export type RepositoryFileDefMap<TFileDef extends RepositoryContentFileDef> = {[extension in string]?: TFileDef};

export type Repository = {
  localPath: string,
  description: string,
  contents: RepositoryFileDefMap<RepositoryContentFileDef>,
  images: RepositoryFileDefMap<RepositoryImageFileDef>,
};

export type Repositories = {[repoId in string]?: Repository};
