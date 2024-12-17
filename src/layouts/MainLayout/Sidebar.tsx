import { Link } from 'react-router-dom';
import { LayoutDashboard, GitBranch, Building2, Users, LogOut } from 'lucide-react';
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

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: ROUTE_PATH.DASHBOARD },
  { icon: GitBranch, label: 'Branches', to: ROUTE_PATH.BRANCH },
  { icon: Building2, label: 'Hotels', to: ROUTE_PATH.HOTEL },
  { icon: Users, label: 'Users', to: ROUTE_PATH.USER },
];

export function Sidebar() {
  const { onLogout } = useAuth();

  return (
    <ShadcnSidebar>
      <SidebarHeader>
        <h2 className='text-xl font-bold px-4 py-3 text-center'>AHOMEVILLA CMS</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link to={item.to} className='flex items-center gap-3'>
                      <item.icon className='h-5 w-5' />
                      <Text type='title1-semi-bold' className='!font-medium'>
                        {item.label}
                      </Text>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className='mt-auto'>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onLogout}>
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
