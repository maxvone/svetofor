import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { useAppTheme } from '@/components/AppThemeProvider';
import { ScreenShell } from '@/components/ScreenShell';
import { resolveDetailTarget } from '@/content';

export default function DetailScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const target = id ? resolveDetailTarget(id) : undefined;

  if (!target) {
    return (
      <ScreenShell showTrackBackground>
        <AppHeader title="Не найдено" onBack={() => router.back()} />
        <View style={styles.centered}>
          <Text style={{ color: theme.colors.text }}>Материал не найден.</Text>
        </View>
      </ScreenShell>
    );
  }

  const { group, item } = target;
  const title = item?.title_ru ?? group.title_ru;
  const description = item?.shortDescription_ru ?? group.summary_ru ?? group.items[0]?.shortDescription_ru ?? '';
  const isPlaceholder = description.includes('будут добавлены после сверки');

  return (
    <ScreenShell showTrackBackground>
      <AppHeader title={title} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          {group.title_en ? (
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{group.title_en}</Text>
          ) : null}
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{description}</Text>
          {group.summary_ru && !item ? (
            <Text style={[styles.summary, { color: theme.colors.textMuted }]}>{group.summary_ru}</Text>
          ) : null}
          {isPlaceholder ? (
            <Text style={[styles.pending, { color: theme.colors.textMuted }]}>
              Текст будет дополнен после сверки с официальной Инструкцией по сигнализации.
            </Text>
          ) : null}
        </View>

        {!item && group.items.length > 0 ? (
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Варианты</Text>
            {group.items.map((entry) => (
              <View key={entry.id} style={styles.variantRow}>
                <Text style={[styles.variantTitle, { color: theme.colors.textSecondary }]}>{entry.title_ru}</Text>
                <Text style={[styles.variantBody, { color: theme.colors.textMuted }]}>{entry.shortDescription_ru}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    gap: 12,
    padding: 16,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  pending: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 18,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  variantRow: {
    marginBottom: 12,
  },
  variantTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  variantBody: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
});
