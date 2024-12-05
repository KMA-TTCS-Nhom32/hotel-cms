import { createContext, useContext, useRef } from 'react';
import { type StoreApi, useStore } from 'zustand';
import { type UserStore, createUserStore } from './userStore';

export const UserStoreContext = createContext<StoreApi<UserStore> | null>(null);

export interface UserStoreProviderProps {
  children: React.ReactNode;
}

export function UserStoreProvider({ children }: Readonly<UserStoreProviderProps>) {
  const storeRef = useRef<StoreApi<UserStore>>();
  if (!storeRef.current) {
    storeRef.current = createUserStore();
  }

  return <UserStoreContext.Provider value={storeRef.current}>{children}</UserStoreContext.Provider>;
}

export function useUserStore<T>(selector: (state: UserStore) => T): T {
  const store = useContext(UserStoreContext);
  if (!store) throw new Error('Missing UserStoreProvider');
  return useStore(store, selector);
}
