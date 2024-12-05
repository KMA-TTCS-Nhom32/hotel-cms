import { createStore } from 'zustand';
import { User } from '@ahomevilla-hotel/node-sdk';

export interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const createUserStore = () =>
  createStore<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
  }));
