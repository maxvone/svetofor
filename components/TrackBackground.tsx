import { ImageBackground, Platform, StyleSheet, View, type ViewProps } from 'react-native';
import type { ReactNode } from 'react';

import { useAppTheme } from '@/components/AppThemeProvider';

interface TrackBackgroundProps extends ViewProps {
  children: ReactNode;
  dimmed?: boolean;
}

export function TrackBackground({ children, dimmed = true, style, ...props }: TrackBackgroundProps) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.root, style]} {...props}>
      <ImageBackground
        source={require('@/assets/images/track-texture.jpg')}
        style={StyleSheet.absoluteFill}
        imageStyle={styles.image}
        resizeMode="cover"
      />
      {dimmed ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: theme.mode === 'dark' ? 'rgba(10, 12, 18, 0.82)' : 'rgba(248, 249, 250, 0.88)',
            },
          ]}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    opacity: Platform.OS === 'web' ? 0.35 : 0.45,
  },
});
