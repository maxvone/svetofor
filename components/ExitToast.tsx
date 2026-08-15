import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { useAppTheme } from '@/components/AppThemeProvider';

interface ExitToastProps {
  visible: boolean;
}

export function ExitToast({ visible }: ExitToastProps) {
  const { theme } = useAppTheme();

  if (Platform.OS !== 'android' || !visible) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(180)}
      exiting={FadeOutDown.duration(180)}
      style={[styles.toast, { backgroundColor: theme.mode === 'dark' ? '#2A3140' : 'rgba(33, 37, 41, 0.92)' }]}>
      <Text style={styles.text}>Нажмите «Назад» ещё раз для выхода</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    alignSelf: 'center',
    borderRadius: 999,
    bottom: 88,
    paddingHorizontal: 18,
    paddingVertical: 10,
    position: 'absolute',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
});
