/* eslint-disable require-await */
import TokenManager, { injectBearer } from 'brainless-token-manager';
import { extend } from 'umi-request';

import { getAccessToken, getRefreshToken } from '@/stores/auth/utils';

import { API_PATH } from './constant';
import { ROUTE_PATH } from '@/routes/route.constant';
import { toast } from 'sonner';
import { RefreshTokenResponseDto } from '@ahomevilla-hotel/node-sdk';

const REQ_TIMEOUT = 25 * 1000;

export const PREFIX_API = process.env.APP_API_URL;

const request = extend({
  prefix: PREFIX_API,
  timeout: REQ_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },

  errorHandler: (error) => {
    const pathname = window.location.pathname;
    console.log(error.response);

    if (error?.response?.status === 401) {
      toast.error('Hết phiên làm việc. Vui lòng đăng nhập lại');
      localStorage.clear();
      // show toast message and pending timeout 2s
      if (pathname !== ROUTE_PATH.LOGIN) {
        setTimeout(() => {
          window.location.href = ROUTE_PATH.LOGIN;
        }, 2000);
      }
      return;
    }

    throw error?.data || error?.response;
  },
});

const tokenManager = new TokenManager({
  getAccessToken: async () => {
    const token = getAccessToken();

    return token || '';
  },
  getRefreshToken: async () => {
    const refreshToken = getRefreshToken();

    return refreshToken || '';
  },
  executeRefreshToken: async () => {
    console.log('refresh token ...');
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return {
        token: '',
        refresh_token: '',
      };
    }

    const r = await request.post<RefreshTokenResponseDto>(API_PATH.REFRESH, {
      data: {
        refreshToken,
      },
    });

    return {
      token: r.accessToken,
      refresh_token: r.refreshToken,
    };
  },
  onRefreshTokenSuccess: ({ token, refresh_token }) => {
    if (token && refresh_token) {
      localStorage.setItem(
        process.env.LOCAL_STORAGE_KEY as string,
        JSON.stringify({
          accessToken: token,
          refreshToken: refresh_token,
        }),
      );
    }
  },
  onInvalidRefreshToken: async () => {
    // Logout
    localStorage.removeItem(process.env.LOCAL_STORAGE_KEY as string);
    window.location.href = ROUTE_PATH.LOGIN;
  },
});

const privateRequest = async (request: any, suffixUrl: string, configs?: any) => {
  const token: string = configs?.token ?? ((await tokenManager.getToken()) as string);

  return request(suffixUrl, injectBearer(token, configs));
};

export { privateRequest, request };
