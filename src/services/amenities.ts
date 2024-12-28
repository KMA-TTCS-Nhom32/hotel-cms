import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import {
  AmenitiesPaginationResultDto,
  Amenity,
  CreateAmenityDto,
  QueryAmenityDto,
  UpdateAmenityDto,
} from '@ahomevilla-hotel/node-sdk';

export const createAmenityService = (data: CreateAmenityDto) => {
  return privateRequest(request.post, API_PATH.AMENITIES, { data }) as Promise<Amenity>;
};

export const updateAmenityService = (id: string, data: UpdateAmenityDto) => {
  return privateRequest(request.put, `${API_PATH.AMENITIES}/${id}`, { data }) as Promise<Amenity>;
};

export const getAmenitiesService = (params: QueryAmenityDto) => {
  return request.get<AmenitiesPaginationResultDto>(API_PATH.AMENITIES, { params });
};

export const deleteAmenityService = (id: string) => {
  return privateRequest(request.delete, `${API_PATH.AMENITIES}/${id}`);
};
