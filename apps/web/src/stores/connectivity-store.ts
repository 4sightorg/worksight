import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ConnectivityMode = 'online' | 'offline';

interface ConnectivityState {
  mode: ConnectivityMode;
  setMode: (mode: ConnectivityMode) => void;
  isForceOffline: boolean;
}

// Check if forced offline mode is enabled
const IS_FORCED_OFFLINE =
  typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_IS_OFFLINE === 'true' : false;

export const useConnectivityStore = create<ConnectivityState>()(
  persist(
    (set, get) => ({
      mode: IS_FORCED_OFFLINE ? 'offline' : 'online',
      isForceOffline: IS_FORCED_OFFLINE,
      setMode: (mode) => {
        // Only allow mode changes if not forced offline
        if (!get().isForceOffline) {
          set({ mode });
        }
      },
    }),
    {
      name: 'connectivity-mode',
      // Skip hydration if forced offline since we don't want to persist in that case
      skipHydration: IS_FORCED_OFFLINE,
      // Only persist mode, not the isForceOffline flag
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);
