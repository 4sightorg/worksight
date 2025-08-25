import { User } from '@/auth/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isOffline: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setOffline: (offline: boolean) => void;
  logout: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      isOffline: false,

      setUser: (user) => set({ user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setLoading: (isLoading) => set({ isLoading }),
      setOffline: (isOffline) => set({ isOffline }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isLoading: false,
        }),

      reset: () =>
        set({
          user: null,
          accessToken: null,
          isLoading: false,
          isOffline: false,
        }),
    }),
    {
      name: 'worksight-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isOffline: state.isOffline,
      }),
    }
  )
);
