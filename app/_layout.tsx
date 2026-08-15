import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppThemeProvider } from '@/components/AppThemeProvider';
import '@/i18n';

export { ErrorBoundary } from 'expo-router';

function RootStack() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="detail/[id]" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="about" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <RootStack />
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
