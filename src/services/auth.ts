import { API_PATH } from '@/api/constant';
import { request } from '@/api/request';
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
  return request.post(API_PATH.LOGOUT);
};

export const refreshService = (data: RefreshTokenDto) => {
  return request.post<RefreshTokenResponseDto>(API_PATH.REFRESH, { data });
};

export const getProfileService = () => {
  return request.get<User>(API_PATH.PROFILE);
};
