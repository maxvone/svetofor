export type SignalCategory =
  | 'railway_signals'
  | 'metro_signals'
  | 'signs_and_indications'
  | 'foul_protection'
  | 'train_designation'
  | 'hand_signals'
  | 'audible_signals';

export interface ContentItem {
  id: string;
  title_ru: string;
  shortDescription_ru: string;
  fullDescription_ru?: string;
  imageAsset?: string;
  regulationRef?: string;
  placement?: string;
  visibilityDistance?: string;
  markerPlates?: string;
}

export interface ContentGroup {
  id: string;
  category: SignalCategory;
  title_ru: string;
  title_en?: string;
  icon: string;
  itemCount?: number;
  summary_ru?: string;
  items: ContentItem[];
}

export interface CategoryContent {
  category: SignalCategory;
  title_ru: string;
  title_en?: string;
  icon: string;
  groups: ContentGroup[];
}

export interface TopLevelCategory {
  id: SignalCategory;
  title_ru: string;
  title_en: string;
  icon: string;
}
