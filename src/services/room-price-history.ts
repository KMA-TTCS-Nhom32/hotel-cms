import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import {
  CreateRoomPriceHistoryDto,
  RoomPriceHistory,
  UpdateRoomPriceHistoryDto,
} from '@ahomevilla-hotel/node-sdk';

export const getRoomPriceHistoriesService = (roomDetailId: string) => {
  return privateRequest(
    request.get, 
    API_PATH.GET_ROOM_PRICE_HISTORIES(roomDetailId)
  ) as Promise<RoomPriceHistory[]>;
};

export const createRoomPriceHistoryService = (data: CreateRoomPriceHistoryDto) => {
  return privateRequest(request.post, API_PATH.ROOM_PRICE_HISTORIES, {
    data,
  }) as Promise<RoomPriceHistory>;
};

export const updateRoomPriceHistoryService = (id: string, data: UpdateRoomPriceHistoryDto) => {
  return privateRequest(request.patch, `${API_PATH.ROOM_PRICE_HISTORIES}/${id}`, {
    data,
  }) as Promise<RoomPriceHistory>;
};

export const deleteRoomPriceHistoryService = (id: string) => {
  return privateRequest(request.delete, `${API_PATH.ROOM_PRICE_HISTORIES}/${id}`);
};
