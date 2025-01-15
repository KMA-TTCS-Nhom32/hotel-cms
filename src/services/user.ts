import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';

import {
  AdminUpdateUserDto,
  BlockOrUnblockUserDto,
  QueryUsersDto,
  UserDetail,
  UsersPaginationResultDto,
} from '@ahomevilla-hotel/node-sdk';

export const getUsersService = (params: QueryUsersDto) => {
  return privateRequest(request.get, API_PATH.USERS, {
    params,
  }) as Promise<UsersPaginationResultDto>;
};

export const getUserDetail = (id: string) => {
  return privateRequest(request.get, `${API_PATH.USERS}/admin/${id}`) as Promise<UserDetail>;
};

export const blockOrUnblockUserService = (id: string, data: BlockOrUnblockUserDto) => {
  return privateRequest(request.post, `${API_PATH.USERS}/block-action/${id}`, { data });
};

export const updateUserService = (id: string, data: AdminUpdateUserDto) => {
  return privateRequest(request.patch, `${API_PATH.USERS}/admin/${id}`, {
    data,
  }) as Promise<UserDetail>;
};

export const deleteUserService = (id: string) => {
  return privateRequest(request.delete, `${API_PATH.USERS}/${id}`);
};

export const restoreUserService = (id: string) => {
  return privateRequest(request.post, `${API_PATH.USERS}/${id}/restore`);
};
