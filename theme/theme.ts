export type ThemeMode = 'light' | 'dark';

export const palette = {
  brandBlue: '#3B78F6',
  brandBlueDark: '#2F6AE8',
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F8F9FA',
  gray100: '#F1F3F5',
  gray200: '#E9ECEF',
  gray400: '#ADB5BD',
  gray600: '#6C757D',
  gray800: '#343A40',
  gray900: '#212529',
  cardLight: '#FFFFFF',
  cardDark: '#1E2430',
  overlay: 'rgba(0, 0, 0, 0.45)',
} as const;

export interface AppTheme {
  mode: ThemeMode;
  colors: {
    primary: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    headerText: string;
    splashBackground: string;
    overlay: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
  typography: {
    logo: { fontSize: number; fontWeight: '700' | '600' | '400' };
    title: { fontSize: number; fontWeight: '700' | '600' | '400' };
    subtitle: { fontSize: number; fontWeight: '700' | '600' | '400' };
    body: { fontSize: number; fontWeight: '700' | '600' | '400' };
    caption: { fontSize: number; fontWeight: '700' | '600' | '400' };
  };
}

const shared = {
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 12, lg: 16, full: 999 },
  typography: {
    logo: { fontSize: 28, fontWeight: '700' as const },
    title: { fontSize: 18, fontWeight: '600' as const },
    subtitle: { fontSize: 16, fontWeight: '600' as const },
    body: { fontSize: 15, fontWeight: '400' as const },
    caption: { fontSize: 13, fontWeight: '400' as const },
  },
};

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    primary: palette.brandBlue,
    background: palette.gray50,
    surface: palette.gray100,
    card: palette.cardLight,
    text: palette.gray900,
    textSecondary: palette.gray800,
    textMuted: palette.gray600,
    border: palette.gray200,
    headerText: palette.white,
    splashBackground: palette.brandBlue,
    overlay: palette.overlay,
  },
  ...shared,
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    primary: palette.brandBlueDark,
    background: '#12151C',
    surface: '#1A1F2B',
    card: palette.cardDark,
    text: '#F1F3F5',
    textSecondary: '#DEE2E6',
    textMuted: palette.gray400,
    border: '#2B3240',
    headerText: palette.white,
    splashBackground: palette.brandBlueDark,
    overlay: palette.overlay,
  },
  ...shared,
};

export function getTheme(mode: ThemeMode): AppTheme {
  return mode === 'dark' ? darkTheme : lightTheme;
}
