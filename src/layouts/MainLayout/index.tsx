import { Suspense, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMount } from 'ahooks';

import { adminItems, Sidebar, staffItems } from './Sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/Theme/mode-toggle';
import { Icons } from '@/components/Common/Icons';

import { useBreadcrumbStore } from '@/stores/breadcrumbs/useBreadcrumbStore';
import { getAccessToken } from '@/stores/auth/utils';
import { ROUTE_PATH } from '@/routes/route.constant';
import { useUserStore } from '@/stores/user/userContext';
import HeaderBreadCrumbs from './HeaderBreadCrumbs';

const routes = [...adminItems, ...staffItems];

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore((state) => state);
  const { breadcrumbs } = useBreadcrumbStore();

  useMount(() => {
    const isLogin = getAccessToken();
    if (!isLogin) {
      return navigate(ROUTE_PATH.LOGIN);
    }
  });

  const isAdmin = useMemo(() => {
    return user?.role === 'ADMIN';
  }, [user]);

  console.log(isAdmin, user);
  useEffect(() => {
    if (!isAdmin && adminItems.find((item) => location.pathname.includes(item.to))) {
      navigate(ROUTE_PATH.ROOMS);
    } else if (isAdmin && staffItems.find((item) => location.pathname.includes(item.to))) {
      navigate(ROUTE_PATH.DASHBOARD);
    }
  }, [location.pathname, user]);

  if (!user) {
    return (
      <div className='flex justify-center items-center h-screen gap-5'>
        <Icons.spinner className='w-10 h-10 animate-spin' />
        <p>Loading...</p>
      </div>
    );
  }

  const currentRoute = routes.find((route) => location.pathname.includes(route.to));

  return (
    <Suspense fallback={undefined}>
      <SidebarProvider>
        <Sidebar isAdmin={isAdmin} />
        <SidebarInset>
          <header className='w-full max-w-[1240px] mx-auto flex h-16 shrink-0 items-center gap-2 border-b xl:px-4 3xl:px-6'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <ModeToggle />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <HeaderBreadCrumbs
              links={[
                ...(currentRoute ? [{ to: currentRoute.to, label: currentRoute.label }] : []),
                ...breadcrumbs,
              ]}
            />
          </header>
          <main className='w-full max-w-[1240px] mx-auto xl:px-4 3xl:p-6'>
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
};

export default MainLayout;
