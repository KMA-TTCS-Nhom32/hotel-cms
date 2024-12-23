import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import {
  LoginDto,
  LoginResponseDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
  User,
} from '@ahomevilla-hotel/node-sdk';

export const loginService = (data: LoginDto) => {
  return request.post<LoginResponseDto>(API_PATH.LOGIN, { data });
};

export const logoutService = () => {
  return privateRequest(request.post, API_PATH.LOGOUT);
};

export const refreshService = (data: RefreshTokenDto) => {
  return privateRequest(request.post, API_PATH.REFRESH, {
    data,
  }) as Promise<RefreshTokenResponseDto>;
};

export const getProfileService = () => {
  return privateRequest(request.get, API_PATH.PROFILE) as Promise<User>;
};
