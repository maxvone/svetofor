import type { CategoryContent, ContentGroup, ContentItem, SignalCategory, TopLevelCategory } from './types';

import audibleSignals from './audible_signals.json';
import foulProtection from './foul_protection.json';
import handSignals from './hand_signals.json';
import metroSignals from './metro_signals.json';
import railwaySignals from './railway_signals.json';
import signsAndIndications from './signs_and_indications.json';
import trainDesignation from './train_designation.json';
import { encodeDetailId, parseDetailId } from './detail-id';

export const topLevelCategories: TopLevelCategory[] = [
  {
    id: 'railway_signals',
    title_ru: railwaySignals.title_ru,
    title_en: railwaySignals.title_en ?? 'Railway signals',
    icon: railwaySignals.icon,
  },
  {
    id: 'metro_signals',
    title_ru: metroSignals.title_ru,
    title_en: metroSignals.title_en ?? 'Metro signals',
    icon: metroSignals.icon,
  },
  {
    id: 'signs_and_indications',
    title_ru: signsAndIndications.title_ru,
    title_en: signsAndIndications.title_en ?? 'Signs and indications',
    icon: signsAndIndications.icon,
  },
  {
    id: 'foul_protection',
    title_ru: foulProtection.title_ru,
    title_en: foulProtection.title_en ?? 'Foul protection',
    icon: foulProtection.icon,
  },
  {
    id: 'train_designation',
    title_ru: trainDesignation.title_ru,
    title_en: trainDesignation.title_en ?? 'Train designation',
    icon: trainDesignation.icon,
  },
  {
    id: 'hand_signals',
    title_ru: handSignals.title_ru,
    title_en: handSignals.title_en ?? 'Hand signals',
    icon: handSignals.icon,
  },
  {
    id: 'audible_signals',
    title_ru: audibleSignals.title_ru,
    title_en: audibleSignals.title_en ?? 'Audible signals',
    icon: audibleSignals.icon,
  },
];

export const categoryContentMap: Record<SignalCategory, CategoryContent> = {
  railway_signals: railwaySignals as CategoryContent,
  metro_signals: metroSignals as CategoryContent,
  signs_and_indications: signsAndIndications as CategoryContent,
  foul_protection: foulProtection as CategoryContent,
  train_designation: trainDesignation as CategoryContent,
  hand_signals: handSignals as CategoryContent,
  audible_signals: audibleSignals as CategoryContent,
};

export function getCategoryContent(category: SignalCategory): CategoryContent {
  return categoryContentMap[category];
}

export function findGroupById(id: string, category?: SignalCategory): ContentGroup | undefined {
  if (category) {
    return categoryContentMap[category]?.groups.find((entry) => entry.id === id);
  }

  for (const content of Object.values(categoryContentMap)) {
    const group = content.groups.find((entry) => entry.id === id);
    if (group) return group;
  }
  return undefined;
}

export function findItemById(
  id: string,
  category?: SignalCategory
): { group: ContentGroup; item: ContentItem } | undefined {
  const categories = category ? [categoryContentMap[category]] : Object.values(categoryContentMap);

  for (const content of categories) {
    if (!content) continue;
    for (const group of content.groups) {
      const item = group.items.find((entry) => entry.id === id);
      if (item) return { group, item };
    }
  }
  return undefined;
}

export function resolveDetailTarget(rawId: string): {
  type: 'group' | 'item';
  group: ContentGroup;
  item?: ContentItem;
  category: SignalCategory;
} | undefined {
  const parsed = parseDetailId(rawId);
  const group = findGroupById(parsed.id, parsed.category);
  if (group) {
    return { type: 'group', group, category: group.category };
  }

  const itemResult = findItemById(parsed.id, parsed.category);
  if (itemResult) {
    return { type: 'item', group: itemResult.group, item: itemResult.item, category: itemResult.group.category };
  }

  return undefined;
}

export function getAllDetailIds(): string[] {
  const ids = new Set<string>();

  for (const [category, content] of Object.entries(categoryContentMap) as Array<
    [SignalCategory, CategoryContent]
  >) {
    for (const group of content.groups) {
      ids.add(encodeDetailId(category, group.id));
      for (const item of group.items) {
        ids.add(encodeDetailId(category, item.id));
      }
    }
  }

  return [...ids];
}

export { encodeDetailId, parseDetailId } from './detail-id';

export * from './types';
