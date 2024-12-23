import { Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMount } from 'ahooks';

import { adminItems, Sidebar, staffItems } from './Sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/Theme/mode-toggle';

import { getAccessToken } from '@/stores/auth/utils';
import { ROUTE_PATH } from '@/routes/route.constant';
import { useUserStore } from '@/stores/user/userContext';
import { Icons } from '@/components/Common/Icons';
import { Hotel } from 'lucide-react';
import HeaderBreadCrumbs from './HeaderBreadCrumbs';

const nestedRoutes = [{ icon: Hotel, label: 'Phòng', to: ROUTE_PATH.ROOMS }];

const routes = [...adminItems, ...staffItems, ...nestedRoutes];

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore((state) => state);

  useMount(() => {
    const isLogin = getAccessToken();
    if (!isLogin) {
      return navigate(ROUTE_PATH.LOGIN);
    }
  });

  if (!user) {
    return (
      <div className='flex justify-center items-center h-screen gap-5'>
        <Icons.spinner className='w-10 h-10 animate-spin' />
        <p>Loading...</p>
      </div>
    );
  }

  const breadcrumbs = routes.filter((route) => location.pathname.includes(route.to));

  return (
    <Suspense fallback={undefined}>
      <SidebarProvider>
        <Sidebar />
        <SidebarInset>
          <header className='flex h-16 shrink-0 items-center gap-2 border-b px-6'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <ModeToggle />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <HeaderBreadCrumbs links={breadcrumbs} />
          </header>
          <main className='w-full p-6'>
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
};

export default MainLayout;
