import {extname} from 'path';

import {mimeTypeMap} from '@/const/mimeType';
import {FileMeta} from '@/types/file/meta';

/**
 * Get the meta of a file based on its extension
 * @param filePath - The path to the file
 * @returns The file MIME type and its content type
 */
export const getFileMeta = (filePath: string): FileMeta => {
  const extension = extname(filePath).toLowerCase();

  return {
    extension,
    contentType: mimeTypeMap[extension] ?? 'application/octet-stream',
  };
};
