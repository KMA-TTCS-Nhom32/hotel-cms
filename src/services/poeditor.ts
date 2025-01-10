import { API_PATH } from '@/api/constant';
import { request } from '@/api/request';
import { GetTranslationsRequestDto, ListTranslationResponseDto } from '@ahomevilla-hotel/node-sdk';

export const getTranslationList = (data: GetTranslationsRequestDto) => {
  return request.post<ListTranslationResponseDto>(API_PATH.TRANSLATION_LIST, {
    data,
  });
};
