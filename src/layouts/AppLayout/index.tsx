import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { useInitialProfile } from '@/stores/user/useInitialProfile';
import LoadingSection from '@/components/Common/LoadingSection';
// import { useRequest } from 'ahooks';
// import { getTranslationList } from '@/services/poeditor';
// import { useTranslationStore } from '@/stores/translation/useTranslationStore';

const AppLayout = () => {
  const { loading } = useInitialProfile();
  // const { setTerms } = useTranslationStore((state) => state);

  // useRequest(
  //   () =>
  //     getTranslationList({
  //       language: 'vi',
  //     }),
  //   {
  //     onSuccess: (data) => {
  //       setTerms(data.result.terms);
  //     },
  //   },
  // );

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
