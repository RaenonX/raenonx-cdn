import {FastifyReply} from 'fastify';


type SetAssetReplyHeadersOpts = {
  contentType: string,
  cacheControl: string,
};

/**
 * Sets appropriate headers for general asset response
 * @param reply - Fastify reply object
 * @param fileSizeBytes - File size in bytes
 * @param options - Options for the asset reply
 * @returns Fastify reply object with appropriate headers
 */
export const setAssetReplyHeaders = <TReply extends FastifyReply>(
  reply: TReply,
  fileSizeBytes: number,
  {
    contentType,
    cacheControl,
  }: SetAssetReplyHeadersOpts,
): TReply => {
  reply
    .header('Content-Type', contentType)
    .header('Cache-Control', cacheControl)
    .header('Content-Length', fileSizeBytes);

  return reply;
};
