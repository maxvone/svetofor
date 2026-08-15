import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { BackHandler, Platform } from 'react-native';

const EXIT_WINDOW_MS = 2000;

export function useAndroidBackExit(enabled = true) {
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const lastBackPressRef = useRef(0);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android' || !enabled) {
        return undefined;
      }

      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        const now = Date.now();
        if (now - lastBackPressRef.current < EXIT_WINDOW_MS) {
          setShowExitPrompt(false);
          BackHandler.exitApp();
          return true;
        }

        lastBackPressRef.current = now;
        setShowExitPrompt(true);

        setTimeout(() => {
          setShowExitPrompt(false);
        }, EXIT_WINDOW_MS);

        return true;
      });

      return () => {
        subscription.remove();
        setShowExitPrompt(false);
      };
    }, [enabled])
  );

  return { showExitPrompt };
}
