import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import { ImageUploadResponseDto } from '@ahomevilla-hotel/node-sdk';

export const getImageService = (id: string) => {
  return request.get(`${API_PATH.IMAGES}/${id}`, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadImagesService = (data: FormData) => {
  return privateRequest(request.post, API_PATH.IMAGES, {
    body: data,
  }) as Promise<ImageUploadResponseDto[]>;
};

export const uploadIconService = (data: FormData) => {
  return privateRequest(request.post, `${API_PATH.IMAGES}/icon`, {
    body: data,
  }) as Promise<ImageUploadResponseDto>;
};
