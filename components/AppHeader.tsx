import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/components/AppThemeProvider';
import { LucideIconByName } from '@/components/LucideIcon';

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  showMenu?: boolean;
  showSettings?: boolean;
  onMenuPress?: () => void;
  onSettingsPress?: () => void;
}

export function AppHeader({
  title,
  onBack,
  showMenu = false,
  showSettings = false,
  onMenuPress,
  onSettingsPress,
}: AppHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary, paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        <View style={styles.side}>
          {onBack ? (
            <Pressable onPress={onBack} hitSlop={12} accessibilityRole="button" accessibilityLabel="Назад">
              <LucideIconByName name="ArrowLeft" color={theme.colors.headerText} />
            </Pressable>
          ) : showMenu ? (
            <Pressable
              onPress={onMenuPress}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Меню">
              <LucideIconByName name="Menu" color={theme.colors.headerText} />
            </Pressable>
          ) : null}
        </View>

        <Text style={[styles.title, { color: theme.colors.headerText }]} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.side}>
          {showSettings ? (
            <Pressable
              onPress={onSettingsPress ?? (() => router.push('/settings'))}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Настройки">
              <LucideIconByName name="Settings" color={theme.colors.headerText} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  side: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 28,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
