import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme } from '@/components/AppThemeProvider';
import type { HandSignalPose, HandSignalProp } from '@/content/interactive-hand-signals';

interface HandSignalVisualProps {
  pose: HandSignalPose;
  animating: boolean;
  compact?: boolean;
}

const PROP_COLORS: Record<HandSignalProp, { main: string; accent?: string; ring?: string }> = {
  red_flag: { main: '#ef4444' },
  yellow_flag_open: { main: '#facc15' },
  yellow_flag_closed: { main: '#eab308', accent: '#ca8a04' },
  white_disc: { main: '#f8fafc', ring: '#111827' },
  hand: { main: '#fbbf24' },
  lantern_red: { main: '#ef4444', accent: '#374151' },
  lantern_yellow: { main: '#facc15', accent: '#374151' },
  lantern_green: { main: '#22c55e', accent: '#374151' },
  lantern_white: { main: '#f8fafc', accent: '#374151' },
};

function PropGraphic({ prop }: { prop: HandSignalProp }) {
  const colors = PROP_COLORS[prop];

  if (prop === 'hand') {
    return <View style={[styles.hand, { backgroundColor: colors.main }]} />;
  }

  if (prop === 'white_disc') {
    return (
      <View style={[styles.disc, { backgroundColor: colors.main, borderColor: colors.ring }]}>
        <View style={[styles.discInner, { borderColor: colors.ring }]} />
      </View>
    );
  }

  if (prop.startsWith('lantern_')) {
    return (
      <View style={[styles.lanternBody, { backgroundColor: colors.accent }]}>
        <View style={[styles.lanternLens, { backgroundColor: colors.main }]} />
      </View>
    );
  }

  const folded = prop === 'yellow_flag_closed';

  return (
    <View style={styles.flagPole}>
      <View style={[styles.flagFabric, folded ? styles.flagFolded : styles.flagOpen, { backgroundColor: colors.main }]}>
        {folded ? <View style={[styles.flagStripe, { backgroundColor: colors.accent }]} /> : null}
      </View>
    </View>
  );
}

export function HandSignalVisual({ pose, animating, compact = false }: HandSignalVisualProps) {
  const { theme } = useAppTheme();
  const motion = useSharedValue(0);
  const spin = useSharedValue(0);

  useEffect(() => {
    if (!animating) {
      motion.value = 0;
      spin.value = 0;
      return;
    }

    if (pose.motion === 'circle') {
      spin.value = withRepeat(withTiming(1, { duration: 900, easing: Easing.linear }), 3, false);
      return;
    }

    if (pose.motion === 'vertical') {
      motion.value = withRepeat(
        withSequence(withTiming(1, { duration: 450 }), withTiming(-1, { duration: 450 })),
        3,
        true
      );
      return;
    }

    if (pose.motion === 'horizontal') {
      motion.value = withRepeat(
        withSequence(withTiming(1, { duration: 350 }), withTiming(-1, { duration: 350 })),
        4,
        true
      );
    }
  }, [animating, motion, pose.motion, spin]);

  const armRotation =
    pose.arm === 'raised' ? '-58deg' : pose.arm === 'lowered' ? '52deg' : '-12deg';

  const animatedArmStyle = useAnimatedStyle(() => {
    if (pose.motion === 'circle') {
      return {
        transform: [{ rotate: `${-58 + spin.value * 360}deg` }],
      };
    }

    if (pose.motion === 'vertical') {
      return {
        transform: [{ rotate: armRotation }, { translateY: motion.value * 14 }],
      };
    }

    if (pose.motion === 'horizontal') {
      return {
        transform: [{ rotate: armRotation }, { translateX: motion.value * 18 }],
      };
    }

    return {
      transform: [{ rotate: armRotation }],
    };
  });

  return (
    <View
      style={[
        styles.stage,
        compact ? styles.stageCompact : null,
        { backgroundColor: theme.mode === 'dark' ? '#111827' : '#dbeafe', borderColor: theme.colors.border },
      ]}>
      <View style={styles.ground} />
      <View style={styles.person}>
        <View style={styles.head} />
        <View style={styles.torso} />
        <Animated.View style={[styles.arm, animatedArmStyle]}>
          <View style={styles.upperArm} />
          <PropGraphic prop={pose.prop} />
        </Animated.View>
        <View style={styles.legs}>
          <View style={styles.leg} />
          <View style={styles.leg} />
        </View>
      </View>
      <Text style={[styles.caption, { color: theme.colors.textSecondary }]} numberOfLines={2}>
        {pose.caption_ru}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    height: 190,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    paddingBottom: 10,
    width: '100%',
  },
  stageCompact: {
    height: 160,
  },
  ground: {
    backgroundColor: '#64748b55',
    bottom: 36,
    height: 2,
    position: 'absolute',
    width: '72%',
  },
  person: {
    alignItems: 'center',
    height: 130,
    justifyContent: 'flex-end',
    width: 120,
  },
  head: {
    backgroundColor: '#fde68a',
    borderRadius: 999,
    height: 22,
    marginBottom: 2,
    width: 22,
  },
  torso: {
    backgroundColor: '#2563eb',
    borderRadius: 6,
    height: 42,
    width: 28,
  },
  arm: {
    alignItems: 'center',
    height: 68,
    justifyContent: 'flex-start',
    left: 58,
    position: 'absolute',
    top: 24,
    width: 68,
  },
  upperArm: {
    backgroundColor: '#2563eb',
    borderRadius: 4,
    height: 28,
    width: 8,
  },
  legs: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  leg: {
    backgroundColor: '#1e3a8a',
    borderRadius: 3,
    height: 28,
    width: 10,
  },
  flagPole: {
    alignItems: 'flex-start',
    height: 34,
    justifyContent: 'flex-start',
    marginTop: -2,
  },
  flagFabric: {
    borderRadius: 2,
    height: 18,
    marginLeft: 2,
  },
  flagOpen: {
    width: 28,
  },
  flagFolded: {
    width: 10,
  },
  flagStripe: {
    alignSelf: 'center',
    height: 18,
    width: 2,
  },
  disc: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginTop: 2,
    width: 24,
  },
  discInner: {
    borderRadius: 999,
    borderWidth: 1,
    height: 14,
    width: 14,
  },
  hand: {
    borderRadius: 999,
    height: 16,
    marginTop: 4,
    width: 16,
  },
  lanternBody: {
    alignItems: 'center',
    borderRadius: 4,
    height: 24,
    justifyContent: 'center',
    marginTop: 2,
    width: 16,
  },
  lanternLens: {
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  caption: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 8,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
});
