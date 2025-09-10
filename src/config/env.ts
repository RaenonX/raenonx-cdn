import {loadAppConfig} from '@/config/load';
import {AppConfig} from '@/types/config/main';
import {RepositoryContentFileDef} from '@/types/config/repo';
import {commaSeparatedStringToArray} from '@/utils/string/commaSeparated';


/**
 * Full configuration object for advanced usage
 */
export const appConfig = loadAppConfig() as AppConfig;

/**
 * Helper functions for environment variable processing
 */
export const configHelpers = {
  getCorsOrigin: () => {
    if (appConfig.cors.origin === 'true') {
      return true;
    }

    if (Array.isArray(appConfig.cors.origin)) {
      return appConfig.cors.origin;
    }

    return commaSeparatedStringToArray(appConfig.cors.origin);
  },
  getCorsMethods: () => {
    return commaSeparatedStringToArray(appConfig.cors.methods);
  },
  getCorsHeaders: () => {
    return commaSeparatedStringToArray(appConfig.cors.headers);
  },
  getRepoCacheControl: <TFileDef extends RepositoryContentFileDef>(repoFileDef: TFileDef | null): string => {
    const {control, maxAge} = repoFileDef?.httpHeader ?? appConfig.cache.httpHeader;

    return `${control}, max-age=${maxAge}`;
  },
};
