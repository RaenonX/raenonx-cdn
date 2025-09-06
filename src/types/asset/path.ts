import {Repository} from '@/types/config/repo';
import {FileMeta} from '@/types/file/meta';


export type AssetPathResolutionResult = {
  isValid: true,
  repo: Repository,
  resolvedPath: string,
  fileMeta: FileMeta,
  cacheControl: string,
  fileSizeBytes: number,
} | {
  isValid: false,
  error: string,
  statusCode: number,
};
