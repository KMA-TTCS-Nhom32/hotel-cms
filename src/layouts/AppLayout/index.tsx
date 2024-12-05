import { Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMount } from 'ahooks';

import { ThemeProvider } from '@/components/Theme/theme-provider';
import { UserStoreProvider } from '@/stores/user/userContext';
import { useInitialProfile } from '@/hooks/useInitialProfile';
import { getAccessToken } from '@/stores/auth/utils';
import { ROUTE_PATH } from '@/routes/route.constant';

const AppContent = () => {
  useInitialProfile();
  return <Outlet />;
};

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useMount(() => {
    const isLogin = getAccessToken();
    if (!isLogin) {
      return navigate(ROUTE_PATH.LOGIN);
    }

    if (location.pathname === '/') {
      navigate(ROUTE_PATH.DASHBOARD);
    }
  });

  return (
    <Suspense fallback={undefined}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <UserStoreProvider>
          <AppContent />
        </UserStoreProvider>
      </ThemeProvider>
    </Suspense>
  );
};

export default AppLayout;
