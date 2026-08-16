import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/components/AppThemeProvider';
import { LucideIconByName } from '@/components/LucideIcon';
import type { ContentGroup, ContentItem } from '@/content';
import { getAudiblePattern, hasAudiblePattern } from '@/content/interactive-audible';
import { estimatePatternDurationMs, playWhistlePattern, stopWhistlePlayback } from '@/lib/whistle-synth';

interface InteractiveAudibleGroupProps {
  group: ContentGroup;
}

function AudibleSignalRow({
  entry,
  isPlaying,
  onPlay,
}: {
  entry: ContentItem;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const { theme } = useAppTheme();
  const pattern = getAudiblePattern(entry.id);
  const body = entry.fullDescription_ru || entry.shortDescription_ru;
  const playable = Boolean(pattern);

  return (
    <View style={[styles.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.rowHeader}>
        <Text style={[styles.rowTitle, { color: theme.colors.text }]}>{entry.title_ru}</Text>
        {playable ? (
          <Pressable
            onPress={onPlay}
            disabled={isPlaying}
            style={[
              styles.playButton,
              {
                backgroundColor: isPlaying ? theme.colors.primary : theme.colors.card,
                borderColor: theme.colors.primary,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Воспроизведение' : 'Прослушать сигнал'}>
            {isPlaying ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <LucideIconByName name="Volume2" size={18} color={theme.colors.primary} />
            )}
          </Pressable>
        ) : null}
      </View>

      {pattern ? (
        <Text style={[styles.patternLabel, { color: theme.colors.textMuted }]}>
          Паттерн: {pattern.patternLabel_ru}
        </Text>
      ) : (
        <Text style={[styles.patternLabel, { color: theme.colors.textMuted }]}>
          Описание случая применения (без воспроизведения)
        </Text>
      )}

      <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{body}</Text>
      {entry.regulationRef ? (
        <Text style={[styles.regulation, { color: theme.colors.textMuted }]}>{entry.regulationRef}</Text>
      ) : null}
    </View>
  );
}

export function InteractiveAudibleGroup({ group }: InteractiveAudibleGroupProps) {
  const { theme } = useAppTheme();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      stopWhistlePlayback();
    };
  }, []);

  const handlePlay = async (entry: ContentItem) => {
    const patternDef = getAudiblePattern(entry.id);
    if (!patternDef) {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setPlayingId(entry.id);

    try {
      await playWhistlePattern(patternDef.pattern);
      timerRef.current = setTimeout(() => {
        setPlayingId(null);
      }, estimatePatternDurationMs(patternDef.pattern) + 120);
    } catch {
      setPlayingId(null);
    }
  };

  const playableCount = group.items.filter((entry) => hasAudiblePattern(entry.id)).length;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Интерактивные звуковые сигналы</Text>
      <Text style={[styles.hint, { color: theme.colors.textMuted }]}>
        Нажмите ▶, чтобы прослушать схему свистков. Это упрощённая симуляция по Инструкции; длительные
        тревоги воспроизводятся сокращённо.
      </Text>
      <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
        Воспроизводимых сигналов: {playableCount} из {group.items.length}
      </Text>

      {group.summary_ru ? (
        <Text style={[styles.summary, { color: theme.colors.textSecondary }]}>{group.summary_ru}</Text>
      ) : null}

      <View style={styles.list}>
        {group.items.map((entry) => (
          <AudibleSignalRow
            key={entry.id}
            entry={entry}
            isPlaying={playingId === entry.id}
            onPlay={() => {
              void handlePlay(entry);
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  meta: {
    fontSize: 12,
    marginBottom: 10,
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  list: {
    gap: 10,
  },
  row: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  rowHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  rowTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  playButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  patternLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  regulation: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
  },
});
