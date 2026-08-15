import { Platform, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/components/AppThemeProvider';

export function AdBanner() {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.mode === 'dark' ? '#2A3140' : '#EEF1F5',
          borderColor: theme.colors.border,
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel="Рекламный блок">
      <Text style={[styles.label, { color: theme.colors.textMuted }]}>Рекламный блок</Text>
      <Text style={[styles.hint, { color: theme.colors.textMuted }]}>320 × 50 · placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 56,
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  hint: {
    fontSize: 10,
    marginTop: 2,
    opacity: 0.8,
  },
});
