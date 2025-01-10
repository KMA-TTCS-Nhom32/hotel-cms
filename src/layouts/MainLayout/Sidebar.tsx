import { useMemo } from 'react';
import { useRequest } from 'ahooks';
import { toast } from 'sonner';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GitBranch,
  Building2,
  Users,
  LogOut,
  Bed,
  HandPlatter,
} from 'lucide-react';

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Text } from '@/components/ui/text';
import { ROUTE_PATH } from '@/routes/route.constant';
import { useAuth } from '@/stores/auth/useAuth';
import { useUserStore } from '@/stores/user/userContext';
import { logoutService } from '@/services/auth';
import { useTheme } from '@/components/Theme/theme-provider';
import { cn } from '@/lib/utils';

export const adminItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: ROUTE_PATH.DASHBOARD },
  { icon: GitBranch, label: 'Chi nhánh', to: ROUTE_PATH.BRANCH },
  { icon: Building2, label: 'Khách sạn', to: ROUTE_PATH.HOTEL },
  { icon: HandPlatter, label: 'Tiện ích', to: ROUTE_PATH.AMENITY },
  { icon: Users, label: 'Người dùng', to: ROUTE_PATH.USER },
];

export const staffItems = [{ icon: Bed, label: 'Phòng', to: ROUTE_PATH.ROOMS }];

const logo = {
  light: '/logos/logo-large-light.png',
  dark: '/logos/logo-large-dark.png',
};

export function Sidebar() {
  const { user } = useUserStore((state) => state);
  const { onLogout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  const isAdmin = useMemo(() => {
    return user?.role === 'ADMIN';
  }, [user]);

  const { run: handleLogout } = useRequest(logoutService, {
    manual: true,
    onSuccess: () => {
      onLogout();
    },
    onError: () => {
      toast.error('Đăng xuất thất bại. Có lỗi xảy ra');
    },
  });

  const logoSrc = theme === 'light' ? logo.dark : logo.light;
  console.log(location);
  return (
    <ShadcnSidebar>
      <SidebarHeader className='flex items-center justify-center py-5'>
        <img title='logo' alt='logo' src={logoSrc} className='h-10 w-auto' />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {(isAdmin ? adminItems : staffItems).map((item) => (
                <SidebarMenuItem key={item.to}>
                  <Link to={item.to} className='w-full'>
                    <SidebarMenuButton
                      className={cn(
                        'py-3 h-auto',
                        location.pathname.includes(item.to) && 'bg-sidebar-accent',
                      )}
                    >
                      <div className='flex items-center gap-3'>
                        <item.icon className='h-5 w-5' />
                        <Text type='title1-semi-bold' className='!font-medium'>
                          {item.label}
                        </Text>
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className='mt-auto'>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className='h-5 w-5' />
                  <Text type='title1-semi-bold' className='!font-medium'>
                    Logout
                  </Text>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </ShadcnSidebar>
  );
}
