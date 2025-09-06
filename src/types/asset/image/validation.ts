import {ImageParams} from '@/types/asset/image/request';


export type ImageParamsValidationResult = {
  isValid: true,
  repoId: string,
  imagePath: string,
  params: ImageParams,
} | {
  isValid: false,
  error: string,
  statusCode: number,
};
