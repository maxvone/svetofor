import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'system' | 'light' | 'dark';

interface SettingsState {
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themePreference: 'system',
      setThemePreference: (themePreference) => set({ themePreference }),
      drawerOpen: false,
      setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
    }),
    {
      name: 'svetofor-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ themePreference: state.themePreference }),
    }
  )
);
