import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/components/AppThemeProvider';
import { lensColorHex } from '@/content/interactive-signals/helpers';
import type { InteractiveSignalDefinition, SemaphoreAspect } from '@/content/interactive-signals/types';

interface InteractiveSemaphoreProps {
  definition: InteractiveSignalDefinition;
}

function SemaphoreWing({ wing }: { wing: SemaphoreAspect['wing'] }) {
  if (wing === 'double') {
    return (
      <View style={styles.wingRow}>
        <View style={[styles.wing, styles.wingRaised]} />
        <View style={[styles.wing, styles.wingRaised, { marginLeft: -8 }]} />
      </View>
    );
  }

  return (
    <View style={styles.wingRow}>
      <View style={[styles.wing, wing === 'raised' ? styles.wingRaised : styles.wingHorizontal]} />
    </View>
  );
}

function NightLens({ color }: { color: SemaphoreAspect['nightColor'] }) {
  if (color === 'green-yellow') {
    return (
      <View style={styles.nightRow}>
        <View style={[styles.nightLens, { backgroundColor: lensColorHex('green', true) }]} />
        <View style={[styles.nightLens, { backgroundColor: lensColorHex('yellow', true) }]} />
      </View>
    );
  }

  const lensColor = color === 'green' ? 'green' : 'red';
  return (
    <View style={styles.nightRow}>
      <View style={[styles.nightLens, { backgroundColor: lensColorHex(lensColor, true) }]} />
    </View>
  );
}

export function InteractiveSemaphore({ definition }: InteractiveSemaphoreProps) {
  const { theme } = useAppTheme();
  const aspects = definition.semaphoreAspects ?? [];
  const [selectedId, setSelectedId] = useState(aspects[0]?.id ?? '');
  const [nightMode, setNightMode] = useState(false);

  const matchedAspect = useMemo(
    () => aspects.find((item) => item.id === selectedId) ?? null,
    [aspects, selectedId]
  );

  const cycleAspect = () => {
    if (!aspects.length) return;
    const index = aspects.findIndex((item) => item.id === selectedId);
    const next = aspects[(index + 1) % aspects.length];
    setSelectedId(next.id);
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Интерактивный семафор</Text>
      <Text style={[styles.hint, { color: theme.colors.textMuted }]}>
        Нажимайте на семафор, чтобы переключать положение крыла, или выберите показание из списка.
      </Text>

      <Pressable
        onPress={cycleAspect}
        style={[styles.signalBody, { backgroundColor: theme.mode === 'dark' ? '#111827' : '#1f2937' }]}
        accessibilityRole="button"
        accessibilityLabel="Переключить положение семафора">
        <View style={styles.mast} />
        {matchedAspect ? <SemaphoreWing wing={matchedAspect.wing} /> : null}
        {nightMode && matchedAspect ? (
          <View style={styles.nightBlock}>
            <Text style={styles.nightLabel}>Ночью</Text>
            <NightLens color={matchedAspect.nightColor} />
          </View>
        ) : null}
      </Pressable>

      <View style={styles.controlRow}>
        <Pressable
          onPress={() => setNightMode((value) => !value)}
          style={[styles.resetButton, { borderColor: theme.colors.border }]}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>
            {nightMode ? 'День' : 'Ночь'}
          </Text>
        </Pressable>
        {matchedAspect ? (
          <Text style={[styles.activeCombo, { color: theme.colors.textMuted }]}>{matchedAspect.label_ru}</Text>
        ) : null}
      </View>

      <View
        style={[
          styles.meaningBox,
          {
            backgroundColor: matchedAspect
              ? theme.mode === 'dark'
                ? '#16301f'
                : '#ecfdf3'
              : theme.colors.surface,
            borderColor: matchedAspect ? '#22c55e55' : theme.colors.border,
          },
        ]}>
        {matchedAspect ? (
          <>
            <Text style={[styles.meaningTitle, { color: theme.colors.text }]}>{matchedAspect.label_ru}</Text>
            <Text style={[styles.meaningBody, { color: theme.colors.textSecondary }]}>
              {matchedAspect.meaning_ru}
            </Text>
            <Text style={[styles.ref, { color: theme.colors.textMuted }]}>{matchedAspect.regulationRef}</Text>
          </>
        ) : (
          <Text style={[styles.meaningBody, { color: theme.colors.textMuted }]}>
            Выберите показание семафора из списка.
          </Text>
        )}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Все показания</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetRow}>
        {aspects.map((item) => {
          const selected = matchedAspect?.id === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setSelectedId(item.id)}
              style={[
                styles.presetChip,
                {
                  backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
                  borderColor: selected ? theme.colors.primary : theme.colors.border,
                },
              ]}>
              <Text style={{ color: selected ? '#fff' : theme.colors.text, fontSize: 13, fontWeight: '600' }}>
                {item.label_ru}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={[styles.source, { color: theme.colors.textMuted }]}>{definition.sourceNote}</Text>
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
    marginBottom: 14,
  },
  signalBody: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 16,
    minHeight: 160,
    justifyContent: 'flex-end',
    paddingBottom: 16,
    paddingHorizontal: 24,
    paddingTop: 24,
    width: 160,
  },
  mast: {
    backgroundColor: '#64748b',
    borderRadius: 4,
    height: 90,
    position: 'absolute',
    top: 16,
    width: 8,
  },
  wingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  wing: {
    backgroundColor: '#ef4444',
    borderRadius: 2,
    height: 8,
    width: 56,
  },
  wingRaised: {
    transform: [{ rotate: '-45deg' }],
  },
  wingHorizontal: {
    transform: [{ rotate: '0deg' }],
  },
  nightBlock: {
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  nightLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  nightRow: {
    flexDirection: 'row',
    gap: 6,
  },
  nightLens: {
    borderColor: '#ffffff55',
    borderRadius: 999,
    borderWidth: 2,
    height: 22,
    width: 22,
  },
  controlRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 12,
  },
  resetButton: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activeCombo: {
    flex: 1,
    fontSize: 12,
    textAlign: 'right',
  },
  meaningBox: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 14,
    padding: 12,
  },
  meaningTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  meaningBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  ref: {
    fontSize: 11,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 14,
  },
  presetRow: {
    gap: 8,
    paddingBottom: 4,
  },
  presetChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  source: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 12,
  },
});
