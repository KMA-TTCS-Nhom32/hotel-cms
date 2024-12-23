import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { useInitialProfile } from '@/stores/user/useInitialProfile';
import LoadingSection from '@/components/Common/LoadingSection';

const AppLayout = () => {
  const { loading } = useInitialProfile();

  if (loading) {
    return <LoadingSection />;
  }

  return (
    <Suspense fallback={undefined}>
      <Outlet />
    </Suspense>
  );
};

export default AppLayout;
