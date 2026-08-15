import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme } from '@/components/AppThemeProvider';
import {
  formatLensState,
  lensColorHex,
  lensColorLabel,
  lensStatesMatch,
  nextLensState,
  off,
} from '@/content/interactive-signals/helpers';
import type { InteractiveSignalDefinition, LensState, SignalAspect } from '@/content/interactive-signals/types';

interface InteractiveSignalProps {
  definition: InteractiveSignalDefinition;
}

function SignalLens({
  state,
  defaultColor,
  label,
  onPress,
}: {
  state: LensState;
  defaultColor: LensState['displayColor'];
  label: string;
  onPress: () => void;
}) {
  const active = state.mode !== 'off';
  const flash = useSharedValue(1);

  useEffect(() => {
    if (state.mode === 'flashing') {
      flash.value = withRepeat(
        withSequence(withTiming(0.25, { duration: 450 }), withTiming(1, { duration: 450 })),
        -1,
        false
      );
    } else {
      flash.value = 1;
    }
  }, [flash, state.mode]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: state.mode === 'flashing' ? flash.value : 1,
  }));

  const glow = lensColorHex(state.displayColor, active);

  return (
    <Pressable onPress={onPress} style={styles.lensPressable} accessibilityRole="button" accessibilityLabel={label}>
      <View style={styles.lensOuter}>
        <Animated.View
          style={[
            styles.lensInner,
            animatedStyle,
            {
              backgroundColor: glow,
              borderColor: active ? '#ffffff55' : '#475569',
            },
          ]}
        />
      </View>
      <Text style={styles.lensHint}>
        {active ? lensColorLabel(state.displayColor) : '—'}
        {state.mode === 'flashing' ? ' ◌' : ''}
      </Text>
    </Pressable>
  );
}

export function InteractiveSignal({ definition }: InteractiveSignalProps) {
  const { theme } = useAppTheme();
  const [lensStates, setLensStates] = useState<LensState[]>(() =>
    definition.lenses.map((lens) => off(lens.defaultColor))
  );

  const matchedAspect = useMemo<SignalAspect | null>(() => {
    for (const item of definition.aspects) {
      if (lensStatesMatch(lensStates, item.lensStates)) {
        return item;
      }
    }
    return null;
  }, [definition.aspects, lensStates]);

  const activeDescription = formatLensState(lensStates);

  const applyAspect = (item: SignalAspect) => {
    setLensStates(item.lensStates);
  };

  const cycleLens = (index: number) => {
    setLensStates((current) => {
      const next = [...current];
      next[index] = nextLensState(next[index], definition.lenses[index].defaultColor);
      return next;
    });
  };

  const resetLenses = () => {
    setLensStates(definition.lenses.map((lens) => off(lens.defaultColor)));
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Интерактивный светофор</Text>
      <Text style={[styles.hint, { color: theme.colors.textMuted }]}>
        Нажимайте на огни, чтобы включать цвета, или выберите показание из списка.
      </Text>

      <View style={[styles.signalBody, { backgroundColor: theme.mode === 'dark' ? '#111827' : '#1f2937' }]}>
        {definition.lenses.map((lens, index) => (
          <SignalLens
            key={lens.id}
            state={lensStates[index]}
            defaultColor={lens.defaultColor}
            label={lens.label_ru}
            onPress={() => cycleLens(index)}
          />
        ))}
      </View>

      <View style={styles.controlRow}>
        <Pressable onPress={resetLenses} style={[styles.resetButton, { borderColor: theme.colors.border }]}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>Погасить все</Text>
        </Pressable>
        {activeDescription ? (
          <Text style={[styles.activeCombo, { color: theme.colors.textMuted }]}>{activeDescription}</Text>
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
            {activeDescription
              ? 'Такая комбинация не найдена в базовых показаниях этого светофора. Выберите показание из списка ниже.'
              : 'Включите огни светофора или выберите показание из списка.'}
          </Text>
        )}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Все показания</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetRow}>
        {definition.aspects.map((item) => {
          const selected = matchedAspect?.id === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => applyAspect(item)}
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
    alignSelf: 'center',
    borderRadius: 16,
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 16,
    width: 120,
  },
  lensPressable: {
    alignItems: 'center',
    gap: 4,
  },
  lensOuter: {
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 999,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  lensInner: {
    borderRadius: 999,
    borderWidth: 2,
    height: 40,
    width: 40,
  },
  lensHint: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
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
