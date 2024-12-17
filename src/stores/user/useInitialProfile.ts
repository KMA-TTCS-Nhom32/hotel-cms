import { useRequest } from 'ahooks';
import { getProfileService } from '@/services/auth';
import { useUserStore } from './userContext';

export const useInitialProfile = () => {
  const setUser = useUserStore((state) => state.setUser);

  useRequest(getProfileService, {
    onSuccess: (data) => {
      if (data.role === 'ADMIN') {
        setUser(data);
        return;
      }
      
    },
  });
};
