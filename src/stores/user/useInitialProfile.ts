import { useLocation, useNavigate } from 'react-router-dom';
import { useMount, useRequest } from 'ahooks';
import { getProfileService } from '@/services/auth';
import { useUserStore } from './userContext';
import { useAuth } from '../auth/useAuth';
import { getAccessToken } from '../auth/utils';
import { ROUTE_PATH } from '@/routes/route.constant';

export const useInitialProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useUserStore((state) => state.setUser);
  const { onLogout } = useAuth();

  const { loading, run } = useRequest(getProfileService, {
    manual: true,
    onSuccess: (data) => {
      if (data.role !== 'USER') {
        setUser(data);
        return;
      }
      onLogout();
    },
  });

  useMount(() => {
    const isLogin = getAccessToken();
    console.log('isLogin', isLogin);
    if (!isLogin) {
      return navigate(ROUTE_PATH.LOGIN);
    }

    const returnUrl = localStorage.getItem('returnUrl');

    run();

    if (!returnUrl || location.pathname === '/') {
      navigate(ROUTE_PATH.DASHBOARD);
    } else {
      navigate(returnUrl);
    }
  });

  return { loading };
};
