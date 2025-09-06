import {existsSync, stat} from 'fs';
import {isAbsolute, join, relative, resolve} from 'path';
import {promisify} from 'util';

import {appConfig, configHelpers} from '@/config/env';
import {errorMessages} from '@/const/error';
import {AssetPathResolutionResult} from '@/types/asset/path';
import {getFileMeta} from '@/utils/asset/fileMeta';

/**
 * Resolves the asset path with existence check
 * @param repoId - Repository identifier
 * @param assetPath - Asset path within the repository
 * @returns Validation result with resolved path or error information
 */
export const resolveAssetPath = async (
  repoId: string,
  assetPath: string,
): Promise<AssetPathResolutionResult> => {
  const repo = appConfig.repositories[repoId];
  if (!repo) {
    return {
      isValid: false,
      error: `Repository '${repoId}' not found`,
      statusCode: 404,
    };
  }

  const repoDir = isAbsolute(repo.localPath) ?
    resolve(repo.localPath) :
    resolve(join(process.cwd(), repo.localPath));

  // Remove leading slash if present
  const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;

  // Resolve the full path
  const resolvedPath = resolve(join(repoDir, cleanPath));

  // Ensure the path is within the content directory (prevent directory traversal)
  const relativePath = relative(repoDir, resolvedPath);
  if (relativePath.startsWith('..') || relativePath.includes('..')) {
    return {
      isValid: false,
      error: errorMessages.ASSET_PATH_INVALID,
      statusCode: 400,
    };
  }

  if (!existsSync(resolvedPath)) {
    return {
      isValid: false,
      error: errorMessages.ASSET_NOT_FOUND,
      statusCode: 404,
    };
  }

  const fileMeta = getFileMeta(resolvedPath);
  const stats = await promisify(stat)(resolvedPath);

  return {
    isValid: true,
    repo,
    resolvedPath,
    fileMeta,
    cacheControl: configHelpers.getRepoCacheControl(repo.contents[fileMeta.extension] ?? null),
    fileSizeBytes: stats.size,
  };
};
