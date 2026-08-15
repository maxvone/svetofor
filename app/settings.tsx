import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { useAppTheme } from '@/components/AppThemeProvider';
import { LucideIconByName } from '@/components/LucideIcon';
import { ScreenShell } from '@/components/ScreenShell';
import { useSettingsStore, type ThemePreference } from '@/store/settings';

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Как в системе' },
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
];

const futureLocales = ['be', 'uk', 'pl', 'en'];

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, themePreference, setThemePreference } = useAppTheme();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScreenShell showAd={false}>
      <AppHeader title="Настройки" onBack={() => router.back()} />
      <ScrollView
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Тёмная тема</Text>
          <View style={styles.segmentRow}>
            {themeOptions.map((option) => {
              const selected = themePreference === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.segment,
                    {
                      backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => setThemePreference(option.value)}>
                  <Text
                    style={{
                      color: selected ? theme.colors.headerText : theme.colors.textSecondary,
                      fontSize: 13,
                      fontWeight: '600',
                    }}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Язык</Text>
          <View style={[styles.rowItem, { borderColor: theme.colors.border }]}>
            <Text style={[styles.rowLabel, { color: theme.colors.text }]}>Русский</Text>
            <LucideIconByName name="Check" size={18} color={theme.colors.primary} />
          </View>
          {futureLocales.map((code) => (
            <View key={code} style={[styles.rowItem, styles.rowDisabled, { borderColor: theme.colors.border }]}>
              <Text style={[styles.rowLabel, { color: theme.colors.textMuted }]}>
                {code.toUpperCase()} · скоро
              </Text>
            </View>
          ))}
        </View>

        <Pressable
          style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => router.push('/about')}>
          <View style={styles.linkRow}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 0 }]}>
              О приложении и справка
            </Text>
            <LucideIconByName name="ChevronRight" size={18} color={theme.colors.textMuted} />
          </View>
        </Pressable>

        <Text style={[styles.version, { color: theme.colors.textMuted }]}>Версия {version}</Text>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    padding: 16,
  },
  section: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  segmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  segment: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  rowItem: {
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowDisabled: {
    opacity: 0.55,
  },
  rowLabel: {
    fontSize: 15,
  },
  linkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  version: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
