import { API_PATH } from '@/api/constant';
import axiosInstance from '@/api/request';
import {
  LoginDto,
  LoginResponseDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
  User,
} from '@ahomevilla-hotel/node-sdk';

export const loginService = (data: LoginDto) => {
  return axiosInstance.post<LoginResponseDto>(API_PATH.LOGIN, data);
};

export const logoutService = () => {
  return axiosInstance.post(API_PATH.LOGOUT);
};

export const refreshService = (data: RefreshTokenDto) => {
  return axiosInstance.post<RefreshTokenResponseDto>(API_PATH.REFRESH, data);
};

export const getProfileService = () => {
    return axiosInstance.get<User>(API_PATH.PROFILE);
}