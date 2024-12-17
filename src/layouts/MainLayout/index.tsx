import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/Theme/mode-toggle';

const index = () => {
  return (
    <Suspense fallback={undefined}>
      {/* <Header /> */}
      <SidebarProvider>
        <Sidebar />
        <SidebarInset>
          <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
            <ModeToggle />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
          </header>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
};

export default index;
