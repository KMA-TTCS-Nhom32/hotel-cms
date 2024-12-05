import { getProfileService } from '@/services/auth';
import { useUserStore } from '@/stores/user/userContext';
import { useRequest } from 'ahooks';
import { UserRoleEnum } from '@ahomevilla-hotel/node-sdk';

export const useInitialProfile = () => {
  const setUser = useUserStore((state) => state.setUser);

  useRequest(getProfileService, {
    onSuccess: ({ data }) => {
      if (data.role === UserRoleEnum.Admin) {
        setUser(data);
      }
    },
  });
};
