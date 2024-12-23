import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import {
  ProvincePaginationResultDto,
  CreateProvinceDto,
  Province,
  QueryProvincesDto,
  UpdateProvinceDto,
} from '@ahomevilla-hotel/node-sdk';

export const getProvincesService = (params: QueryProvincesDto) => {
  return request.get<ProvincePaginationResultDto>(API_PATH.PROVINCES, { params });
};

export const createProvinceService = (data: CreateProvinceDto) => {
  return privateRequest(request.post, API_PATH.PROVINCES, {
    data,
  }) as Promise<Province>;
};

export const updateProvinceService = (id: string, data: UpdateProvinceDto) => {
  return privateRequest(request.put, `${API_PATH.PROVINCES}/${id}`, {
    data,
  }) as Promise<Province>;
};

export const deleteProvinceService = (id: string) => {
  return privateRequest(request.delete, `${API_PATH.PROVINCES}/${id}`);
};
