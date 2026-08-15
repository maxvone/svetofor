import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { useAppTheme } from '@/components/AppThemeProvider';
import { ScreenShell } from '@/components/ScreenShell';

export default function AboutScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();

  return (
    <ScreenShell showTrackBackground showAd>
      <AppHeader title="О приложении" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Светофор</Text>
          <Text style={[styles.tagline, { color: theme.colors.textMuted }]}>ЖЕЛЕЗНОДОРОЖНАЯ СИГНАЛИЗАЦИЯ</Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
            Справочник железнодорожной и метрополитенской сигнализации для сетей колеи 1520 мм. Приложение
            помогает быстро найти описание светофоров, знаков, указателей, звуковых и ручных сигналов, а также
            правил ограждения опасных мест.
          </Text>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 14,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
});
