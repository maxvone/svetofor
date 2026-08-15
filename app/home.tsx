import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { useAppTheme } from '@/components/AppThemeProvider';
import { CategoryAccordion } from '@/components/CategoryAccordion';
import { DrawerMenu } from '@/components/DrawerMenu';
import { ExitToast } from '@/components/ExitToast';
import { InfoCard } from '@/components/InfoCard';
import { ScreenShell } from '@/components/ScreenShell';
import type { SignalCategory } from '@/content';
import { useAndroidBackExit } from '@/hooks/useAndroidBackExit';
import { useSettingsStore } from '@/store/settings';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { expand } = useLocalSearchParams<{ expand?: string }>();
  const setDrawerOpen = useSettingsStore((state) => state.setDrawerOpen);
  const drawerOpen = useSettingsStore((state) => state.drawerOpen);
  const { showExitPrompt } = useAndroidBackExit(!drawerOpen);

  const initialExpanded =
    expand && isSignalCategory(expand) ? (expand as SignalCategory) : null;

  return (
    <ScreenShell showTrackBackground={false}>
      <AppHeader
        title="Светофор"
        showMenu
        showSettings
        onMenuPress={() => setDrawerOpen(true)}
        onSettingsPress={() => router.push('/settings')}
      />
      <ScrollView
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={styles.content}>
        <InfoCard />
        <CategoryAccordion initialExpandedCategory={initialExpanded} />
      </ScrollView>
      <DrawerMenu />
      <ExitToast visible={showExitPrompt} />
    </ScreenShell>
  );
}

function isSignalCategory(value: string): value is SignalCategory {
  return [
    'railway_signals',
    'metro_signals',
    'signs_and_indications',
    'foul_protection',
    'train_designation',
    'hand_signals',
    'audible_signals',
  ].includes(value);
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 16,
  },
});
