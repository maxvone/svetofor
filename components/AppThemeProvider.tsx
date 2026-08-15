import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useSettingsStore, type ThemePreference } from '@/store/settings';
import { getTheme, type AppTheme, type ThemeMode } from '@/theme/theme';

interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: getTheme('light'),
  mode: 'light',
  themePreference: 'system',
  setThemePreference: () => undefined,
  isReady: false,
});

function resolveMode(
  preference: ThemePreference,
  systemScheme: ReturnType<typeof useSystemColorScheme>
): ThemeMode {
  if (preference === 'light' || preference === 'dark') {
    return preference;
  }

  return systemScheme === 'dark' ? 'dark' : 'light';
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const themePreference = useSettingsStore((state) => state.themePreference);
  const setThemePreference = useSettingsStore((state) => state.setThemePreference);
  const [isReady, setIsReady] = useState(useSettingsStore.persist.hasHydrated());

  useEffect(() => {
    const unsubscribe = useSettingsStore.persist.onFinishHydration(() => {
      setIsReady(true);
    });

    if (useSettingsStore.persist.hasHydrated()) {
      setIsReady(true);
    }

    return unsubscribe;
  }, []);

  const mode = resolveMode(themePreference, systemScheme);
  const value = useMemo(
    () => ({
      theme: getTheme(mode),
      mode,
      themePreference,
      setThemePreference,
      isReady,
    }),
    [isReady, mode, setThemePreference, themePreference]
  );

  if (!isReady) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
