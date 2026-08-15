import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/components/AppThemeProvider';
import { LucideIconByName } from '@/components/LucideIcon';

export default function SplashScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.splashBackground }]}>
      <View style={styles.logoWrap}>
        <LucideIconByName name="TrafficCone" size={42} color={theme.colors.headerText} strokeWidth={1.75} />
      </View>
      <Text style={[styles.logo, { color: theme.colors.headerText }]}>Светофор</Text>
      <Text style={[styles.tagline, { color: theme.colors.headerText }]}>ЖЕЛЕЗНОДОРОЖНАЯ СИГНАЛИЗАЦИЯ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoWrap: {
    marginBottom: 14,
    opacity: 0.95,
  },
  logo: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    opacity: 0.95,
    textAlign: 'center',
  },
});
