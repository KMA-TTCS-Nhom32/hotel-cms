import { createContext, useContext, useState } from 'react';
import { type StoreApi, useStore } from 'zustand';
import { type UserStore, createUserStore } from './userStore';

export const UserStoreContext = createContext<StoreApi<UserStore> | null>(null);

export interface UserStoreProviderProps {
  children: React.ReactNode;
}

export function UserStoreProvider({ children }: Readonly<UserStoreProviderProps>) {
  const [store] = useState<StoreApi<UserStore>>(() => createUserStore());

  return <UserStoreContext.Provider value={store}>{children}</UserStoreContext.Provider>;
}

export function useUserStore<T>(selector: (state: UserStore) => T): T {
  const store = useContext(UserStoreContext);
  if (!store) throw new Error('Missing UserStoreProvider');
  return useStore(store, selector);
}
