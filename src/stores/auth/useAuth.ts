import { ROUTE_PATH } from '@/routes/route.constant';
import { getAccessToken } from './utils';
import { LoginResponseDto } from '@ahomevilla-hotel/node-sdk';

const setAuthData = (data: LoginResponseDto): void => {
  localStorage.setItem(process.env.LOCAL_STORAGE_KEY as string, JSON.stringify(data));
};

export const useAuth = () => {
  const onLogin = (data: LoginResponseDto) => {
    try {
      setAuthData(data);
      window.location.href = ROUTE_PATH.DASHBOARD;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const onLogout = () => {
    try {
      localStorage.removeItem(process.env.LOCAL_STORAGE_KEY as string);
      window.location.href = ROUTE_PATH.LOGIN;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return {
    isLogin: !!getAccessToken(),
    setAuthData,
    onLogin,
    onLogout,
  };
};
