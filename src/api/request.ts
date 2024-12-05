import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import queryString from 'query-string';
import { RefreshTokenResponseDto } from '@ahomevilla-hotel/node-sdk';

import { getAccessToken, getRefreshToken } from '@/stores/auth/utils';
import { API_PATH } from './constant';

const BASE_API_URL = process.env.SERVER_API_URL || 'http://localhost:4005';

// Map to store active requests
const activeRequests = new Map<string, AbortController>();

const onRequestSuccess = (config: InternalAxiosRequestConfig) => {
  const requestKey = `${config.url}_${config.method}`;

  // Cancel previous request if it exists
  if (activeRequests.has(requestKey)) {
    activeRequests.get(requestKey)?.abort();
    activeRequests.delete(requestKey);
  }

  // Create new abort controller for this request
  const controller = new AbortController();
  config.signal = controller.signal;
  activeRequests.set(requestKey, controller);

  // Handle authorization
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  if (config.params) {
    config.paramsSerializer = {
      serialize: (params: Record<string, any>) => queryString.stringify(params),
    };
  }
  
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponseSuccess = (response: AxiosResponse): AxiosResponse => {
  // Clean up completed request
  const requestKey = `${response.config.url}_${response.config.method}`;
  activeRequests.delete(requestKey);
  return response;
};

const onResponseError = async (error: AxiosError) => {
  // Clean up failed request
  if (error.config) {
    const requestKey = `${error.config.url}_${error.config.method}`;
    activeRequests.delete(requestKey);
  }

  const originalRequest = error.config;

  if (error.response?.status === 401 && originalRequest && !originalRequest.headers['x-retry']) {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      try {
        const response = await axios.post<RefreshTokenResponseDto>(
          `${BASE_API_URL}${API_PATH.REFRESH}`,
          {
            refreshToken,
          },
        );

        if (response.data.accessToken) {
          // Update token in localStorage would be handled by your auth store
          originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
          originalRequest.headers['x-retry'] = true;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Handle refresh token failure (e.g., logout user)
        return Promise.reject(refreshError);
      }
    }
  }

  return Promise.reject(error);
};

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(onRequestSuccess, onRequestError);
axiosInstance.interceptors.response.use(onResponseSuccess, onResponseError);

export default axiosInstance;
