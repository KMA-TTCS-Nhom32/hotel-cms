import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';

import {
  CreateRoomDetailDto,
  QueryRoomDetailDto,
  RoomDetail,
  RoomDetailPaginationResultDto,
  UpdateRoomDetailDto,
} from '@ahomevilla-hotel/node-sdk';

export const createRoomDetailService = (data: CreateRoomDetailDto) => {
  return privateRequest(request.post, API_PATH.ROOM_DETAILS, {
    data,
  }) as Promise<RoomDetail>;
};

export const updateRoomDetailService = (id: string, data: UpdateRoomDetailDto) => {
  return privateRequest(request.patch, `${API_PATH.ROOM_DETAILS}/${id}`, {
    data,
  }) as Promise<RoomDetail>;
};

export const getRoomDetailService = (params: QueryRoomDetailDto) => {
  return request.get<RoomDetailPaginationResultDto>(API_PATH.ROOM_DETAILS, {
    params,
  });
};
