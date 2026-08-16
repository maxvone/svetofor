import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HandSignalVisual } from '@/components/HandSignalVisual';
import { useAppTheme } from '@/components/AppThemeProvider';
import { LucideIconByName } from '@/components/LucideIcon';
import type { ContentGroup, ContentItem } from '@/content';
import { getHandSignalVisual, hasHandSignalVisual } from '@/content/interactive-hand-signals';

type TimeOfDay = 'day' | 'night';

interface InteractiveHandSignalsGroupProps {
  group: ContentGroup;
}

function HandSignalRow({
  entry,
  isAnimating,
  timeOfDay,
  onTimeOfDayChange,
  onAnimate,
}: {
  entry: ContentItem;
  isAnimating: boolean;
  timeOfDay: TimeOfDay;
  onTimeOfDayChange: (value: TimeOfDay) => void;
  onAnimate: () => void;
}) {
  const { theme } = useAppTheme();
  const visual = getHandSignalVisual(entry.id);
  const body = entry.fullDescription_ru || entry.shortDescription_ru;
  const pose = visual ? visual[timeOfDay] : undefined;

  return (
    <View style={[styles.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.rowHeader}>
        <Text style={[styles.rowTitle, { color: theme.colors.text }]}>{entry.title_ru}</Text>
        {visual ? (
          <Pressable
            onPress={onAnimate}
            style={[
              styles.playButton,
              {
                backgroundColor: isAnimating ? theme.colors.primary : theme.colors.card,
                borderColor: theme.colors.primary,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={isAnimating ? 'Показ сигнала' : 'Показать сигнал'}>
            <LucideIconByName name="Hand" size={18} color={isAnimating ? '#fff' : theme.colors.primary} />
          </Pressable>
        ) : null}
      </View>

      {visual ? (
        <>
          <View style={styles.timeRow}>
            {(['day', 'night'] as const).map((option) => {
              const selected = timeOfDay === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => onTimeOfDayChange(option)}
                  style={[
                    styles.timeChip,
                    {
                      backgroundColor: selected ? theme.colors.primary : theme.colors.card,
                      borderColor: selected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}>
                  <Text style={{ color: selected ? '#fff' : theme.colors.text, fontSize: 12, fontWeight: '600' }}>
                    {option === 'day' ? 'День' : 'Ночь'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.patternLabel, { color: theme.colors.textMuted }]}>
            {visual.gestureLabel_ru}
          </Text>

          {pose ? <HandSignalVisual pose={pose} animating={isAnimating} compact /> : null}
        </>
      ) : (
        <Text style={[styles.patternLabel, { color: theme.colors.textMuted }]}>
          Ссылка на другие сигналы (без отдельной схемы)
        </Text>
      )}

      <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{body}</Text>
      {entry.regulationRef ? (
        <Text style={[styles.regulation, { color: theme.colors.textMuted }]}>{entry.regulationRef}</Text>
      ) : null}
    </View>
  );
}

export function InteractiveHandSignalsGroup({ group }: InteractiveHandSignalsGroupProps) {
  const { theme } = useAppTheme();
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [timeOfDayByItem, setTimeOfDayByItem] = useState<Record<string, TimeOfDay>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleAnimate = (entry: ContentItem) => {
    const visual = getHandSignalVisual(entry.id);
    if (!visual) {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setAnimatingId(entry.id);

    const durationMs = visual[timeOfDayByItem[entry.id] ?? 'day'].motion === 'static' ? 1200 : 2800;
    timerRef.current = setTimeout(() => {
      setAnimatingId(null);
    }, durationMs);
  };

  const visualCount = group.items.filter((entry) => hasHandSignalVisual(entry.id)).length;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Интерактивные ручные сигналы</Text>
      <Text style={[styles.hint, { color: theme.colors.textMuted }]}>
        Выберите «День» или «Ночь», затем нажмите на жест — покажем схему подачи сигнала по Инструкции.
      </Text>
      <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
        Схем: {visualCount} из {group.items.length}
      </Text>

      {group.summary_ru ? (
        <Text style={[styles.summary, { color: theme.colors.textSecondary }]}>{group.summary_ru}</Text>
      ) : null}

      <View style={styles.list}>
        {group.items.map((entry) => (
          <HandSignalRow
            key={entry.id}
            entry={entry}
            isAnimating={animatingId === entry.id}
            timeOfDay={timeOfDayByItem[entry.id] ?? 'day'}
            onTimeOfDayChange={(value) => {
              setTimeOfDayByItem((current) => ({ ...current, [entry.id]: value }));
            }}
            onAnimate={() => handleAnimate(entry)}
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
    marginBottom: 8,
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
  timeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  timeChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  patternLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  regulation: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
  },
});
