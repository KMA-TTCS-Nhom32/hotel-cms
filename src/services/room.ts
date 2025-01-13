import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import {
  CreateHotelRoomDto,
  HotelRoom,
  HotelRoomPaginationResultDto,
  QueryHotelRoomDto,
  UpdateHotelRoomDto,
} from '@ahomevilla-hotel/node-sdk';

export const getRoomsByBranchIdService = (branchId: string) => {
  return privateRequest(request.get, `${API_PATH.ROOMS}/in-branch/${branchId}`) as Promise<
    HotelRoom[]
  >;
};

export const createRoomService = (data: CreateHotelRoomDto) => {
  return privateRequest(request.post, API_PATH.ROOMS, {
    data,
  }) as Promise<HotelRoom>;
};

export const updateRoomService = (id: string, data: UpdateHotelRoomDto) => {
  return privateRequest(request.patch, `${API_PATH.ROOMS}/${id}`, {
    data,
  }) as Promise<HotelRoom>;
};

export const getRoomsService = (params: QueryHotelRoomDto) => {
  return privateRequest(request.get, API_PATH.ROOMS, {
    params,
  }) as Promise<HotelRoomPaginationResultDto>;
};

export const softDeleteRoomService = (id: string) => {
  return privateRequest(request.delete, `${API_PATH.ROOMS}/${id}`);
};

export const restoreRoomService = (id: string) => {
  return privateRequest(request.post, `${API_PATH.ROOMS}/${id}/restore`);
};

export const getDeletedRoomsService = () => {
  return privateRequest(request.get, `${API_PATH.ROOMS}/deleted`) as Promise<HotelRoom[]>;
};

export const permanentDeleteRoomService = (ids: string[]) => {
  return privateRequest(request.post, `${API_PATH.ROOMS}/permanent-delete`, {
    data: { ids },
  });
};
