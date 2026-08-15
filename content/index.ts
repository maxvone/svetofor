import type { CategoryContent, ContentGroup, ContentItem, SignalCategory, TopLevelCategory } from './types';

import audibleSignals from './audible_signals.json';
import foulProtection from './foul_protection.json';
import handSignals from './hand_signals.json';
import metroSignals from './metro_signals.json';
import railwaySignals from './railway_signals.json';
import signsAndIndications from './signs_and_indications.json';
import trainDesignation from './train_designation.json';

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

export function findGroupById(id: string): ContentGroup | undefined {
  for (const content of Object.values(categoryContentMap)) {
    const group = content.groups.find((entry) => entry.id === id);
    if (group) return group;
  }
  return undefined;
}

export function findItemById(id: string): { group: ContentGroup; item: ContentItem } | undefined {
  for (const content of Object.values(categoryContentMap)) {
    for (const group of content.groups) {
      const item = group.items.find((entry) => entry.id === id);
      if (item) return { group, item };
    }
  }
  return undefined;
}

export function resolveDetailTarget(id: string): {
  type: 'group' | 'item';
  group: ContentGroup;
  item?: ContentItem;
} | undefined {
  const group = findGroupById(id);
  if (group) {
    return { type: 'group', group };
  }

  const itemResult = findItemById(id);
  if (itemResult) {
    return { type: 'item', group: itemResult.group, item: itemResult.item };
  }

  return undefined;
}

export * from './types';
