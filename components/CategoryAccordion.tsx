import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/components/AppThemeProvider';
import { LucideIconByName } from '@/components/LucideIcon';
import { getCategoryContent, topLevelCategories, type SignalCategory } from '@/content';

interface CategoryAccordionProps {
  initialExpandedCategory?: SignalCategory | null;
}

export function CategoryAccordion({ initialExpandedCategory = null }: CategoryAccordionProps) {
  const router = useRouter();
  const { theme } = useAppTheme();
  const [expandedCategory, setExpandedCategory] = useState<SignalCategory | null>(initialExpandedCategory);

  useEffect(() => {
    if (initialExpandedCategory) {
      setExpandedCategory(initialExpandedCategory);
    }
  }, [initialExpandedCategory]);

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      {topLevelCategories.map((category, index) => {
        const isExpanded = expandedCategory === category.id;
        const content = getCategoryContent(category.id);
        const isLast = index === topLevelCategories.length - 1;

        return (
          <View
            key={category.id}
            style={[
              !isLast ? [styles.divider, { borderBottomColor: theme.colors.border }] : null,
            ]}>
            <Pressable
              style={styles.categoryRow}
              onPress={() => setExpandedCategory(isExpanded ? null : category.id)}
              accessibilityRole="button"
              accessibilityState={{ expanded: isExpanded }}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary }]}>
                <LucideIconByName name={category.icon} size={18} color={theme.colors.headerText} />
              </View>
              <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>{category.title_ru}</Text>
              <LucideIconByName
                name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                size={18}
                color={theme.colors.textMuted}
              />
            </Pressable>

            {isExpanded ? (
              <View style={styles.subList}>
                {content.groups.map((group) => (
                  <Pressable
                    key={group.id}
                    style={styles.subItem}
                    onPress={() =>
                      router.push({
                        pathname: '/detail/[id]',
                        params: { id: group.id },
                      })
                    }
                    accessibilityRole="button">
                    <Text style={[styles.subItemTitle, { color: theme.colors.textMuted }]}>{group.title_ru}</Text>
                    {group.itemCount ? (
                      <Text style={[styles.subItemMeta, { color: theme.colors.textMuted }]}>
                        {group.itemCount} сигналов
                      </Text>
                    ) : null}
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  categoryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 8,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  categoryTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  subList: {
    paddingBottom: 10,
    paddingTop: 2,
  },
  subItem: {
    paddingLeft: 60,
    paddingRight: 16,
    paddingVertical: 9,
  },
  subItemTitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  subItemMeta: {
    fontSize: 11,
    marginTop: 2,
    opacity: 0.85,
  },
});
