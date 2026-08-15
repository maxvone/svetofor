import { useRouter } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/components/AppThemeProvider';
import { LucideIconByName } from '@/components/LucideIcon';
import { topLevelCategories } from '@/content';
import { useSettingsStore } from '@/store/settings';

interface DrawerMenuProps {
  onSelectCategory?: (categoryId: string) => void;
}

export function DrawerMenu({ onSelectCategory }: DrawerMenuProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const drawerOpen = useSettingsStore((state) => state.drawerOpen);
  const setDrawerOpen = useSettingsStore((state) => state.setDrawerOpen);

  const close = () => setDrawerOpen(false);

  const handleSelect = (categoryId: string) => {
    close();
    onSelectCategory?.(categoryId);
    router.push({ pathname: '/home', params: { expand: categoryId } });
  };

  return (
    <Modal visible={drawerOpen} transparent animationType="fade" onRequestClose={close}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={close} accessibilityLabel="Закрыть меню" />
        <View
          style={[
            styles.panel,
            {
              backgroundColor: theme.colors.card,
              paddingTop: insets.top + 16,
              paddingBottom: insets.bottom + 16,
            },
          ]}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Разделы</Text>
            <Pressable onPress={close} hitSlop={12}>
              <LucideIconByName name="X" size={22} color={theme.colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.list}>
            {topLevelCategories.map((category) => (
              <Pressable
                key={category.id}
                style={[styles.item, { borderColor: theme.colors.border }]}
                onPress={() => handleSelect(category.id)}>
                <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary }]}>
                  <LucideIconByName name={category.icon} size={18} color={theme.colors.headerText} />
                </View>
                <Text style={[styles.itemLabel, { color: theme.colors.text }]}>{category.title_ru}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    flex: 1,
  },
  panel: {
    elevation: 8,
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    width: '82%',
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  list: {
    gap: 8,
    paddingHorizontal: 12,
  },
  item: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  itemLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
});
