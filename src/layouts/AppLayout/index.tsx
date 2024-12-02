import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { ThemeProvider } from '@/components/theme-provider';

const AppLayout = () => {
  return (
    <Suspense fallback={undefined}>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <Outlet />
      </ThemeProvider>
    </Suspense>
  );
};

export default AppLayout;
