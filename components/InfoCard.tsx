import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/components/AppThemeProvider';
import { LucideIconByName } from '@/components/LucideIcon';

export function InfoCard() {
  const router = useRouter();
  const { theme } = useAppTheme();

  return (
    <Pressable
      style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      onPress={() => router.push('/about')}
      accessibilityRole="button">
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary }]}>
        <LucideIconByName name="Info" size={18} color={theme.colors.headerText} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Справочник сигнализации</Text>
        <Text style={[styles.body, { color: theme.colors.textMuted }]}>
          Выберите категорию ниже, чтобы просмотреть типы сигналов и их описания.
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
  },
});
