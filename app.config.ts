import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const baseUrl = process.env.EXPO_BASE_URL ?? '';

  return {
    ...(config as ExpoConfig),
    experiments: {
      ...config.experiments,
      baseUrl,
    },
  };
};
