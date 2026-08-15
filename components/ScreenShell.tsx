import { Platform, StyleSheet, View, type ViewProps } from 'react-native';
import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AdBanner } from '@/components/AdBanner';
import { TrackBackground } from '@/components/TrackBackground';
import { useAppTheme } from '@/components/AppThemeProvider';

interface ScreenShellProps extends ViewProps {
  children: ReactNode;
  showTrackBackground?: boolean;
  showAd?: boolean;
}

export function ScreenShell({
  children,
  showTrackBackground = false,
  showAd = true,
  style,
  ...props
}: ScreenShellProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();

  const body = (
    <View
      style={[
        styles.shell,
        Platform.OS === 'web' ? styles.webShell : null,
        { backgroundColor: showTrackBackground ? 'transparent' : theme.colors.background },
        style,
      ]}
      {...props}>
      <View style={styles.content}>{children}</View>
      {showAd ? <AdBanner /> : null}
      <View style={{ height: Math.max(insets.bottom, 8) }} />
    </View>
  );

  if (showTrackBackground) {
    return <TrackBackground>{body}</TrackBackground>;
  }

  return body;
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  webShell: {
    alignSelf: 'center',
    maxWidth: 480,
    width: '100%',
  },
  content: {
    flex: 1,
  },
});
