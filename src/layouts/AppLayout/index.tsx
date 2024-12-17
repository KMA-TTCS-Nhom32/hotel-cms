import { Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMount } from 'ahooks';

import { useInitialProfile } from '@/stores/user/useInitialProfile';
import { getAccessToken } from '@/stores/auth/utils';
import { ROUTE_PATH } from '@/routes/route.constant';

const AppContent = () => {
  useInitialProfile();
  return <Outlet />;
};

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useInitialProfile();

  useMount(() => {
    const isLogin = getAccessToken();
    console.log('isLogin', isLogin);
    if (!isLogin) {
      return navigate(ROUTE_PATH.LOGIN);
    }

    if (location.pathname === '/') {
      navigate(ROUTE_PATH.DASHBOARD);
    }
  });

  return (
    <Suspense fallback={undefined}>
      <AppContent />
    </Suspense>
  );
};

export default AppLayout;
