import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { useAppTheme } from '@/components/AppThemeProvider';
import { InteractiveAudibleGroup } from '@/components/InteractiveAudibleGroup';
import { InteractiveHandSignalsGroup } from '@/components/InteractiveHandSignalsGroup';
import { InteractiveSemaphore } from '@/components/InteractiveSemaphore';
import { InteractiveSignal } from '@/components/InteractiveSignal';
import { ScreenShell } from '@/components/ScreenShell';
import { getAllDetailIds, resolveDetailTarget } from '@/content';
import type { ContentItem } from '@/content';
import { getInteractiveSignal, hasInteractiveSignal } from '@/content/interactive-signals';

export function generateStaticParams() {
  return getAllDetailIds().map((id) => ({ id }));
}

function ContentItemCard({ entry, showTitle = true }: { entry: ContentItem; showTitle?: boolean }) {
  const { theme } = useAppTheme();
  const body = entry.fullDescription_ru || entry.shortDescription_ru;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      {showTitle ? (
        <Text style={[styles.itemTitle, { color: theme.colors.text }]}>{entry.title_ru}</Text>
      ) : null}
      <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{body}</Text>
      {entry.regulationRef ? (
        <Text style={[styles.regulation, { color: theme.colors.textMuted }]}>{entry.regulationRef}</Text>
      ) : null}
    </View>
  );
}

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

  const { group, item, category } = target;
  const title = item?.title_ru ?? group.title_ru;
  const interactive = hasInteractiveSignal(category, group.id)
    ? getInteractiveSignal(category, group.id)
    : undefined;
  const audibleInteractive = category === 'audible_signals' && !item;
  const handInteractive = category === 'hand_signals' && !item;

  return (
    <ScreenShell showTrackBackground>
      <AppHeader title={title} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        {interactive ? (
          interactive.displayKind === 'semaphore' ? (
            <InteractiveSemaphore definition={interactive} />
          ) : (
            <InteractiveSignal definition={interactive} />
          )
        ) : null}

        {audibleInteractive ? <InteractiveAudibleGroup group={group} /> : null}

        {handInteractive ? <InteractiveHandSignalsGroup group={group} /> : null}

        {interactive && group.summary_ru ? (
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{group.summary_ru}</Text>
          </View>
        ) : null}

        {!interactive && !audibleInteractive && !handInteractive && item ? (
          <ContentItemCard entry={item} showTitle={false} />
        ) : null}

        {!interactive && !audibleInteractive && !handInteractive && !item ? (
          <>
            <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.title, { color: theme.colors.text }]}>{group.title_ru}</Text>
              {group.title_en ? (
                <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{group.title_en}</Text>
              ) : null}
              {group.summary_ru ? (
                <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{group.summary_ru}</Text>
              ) : null}
            </View>

            {group.items.map((entry) => (
              <ContentItemCard key={entry.id} entry={entry} />
            ))}
          </>
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
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  regulation: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
});
