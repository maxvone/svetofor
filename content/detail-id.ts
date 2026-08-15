import type { SignalCategory } from './types';

const SEP = '__';

const signalCategories: SignalCategory[] = [
  'railway_signals',
  'metro_signals',
  'signs_and_indications',
  'foul_protection',
  'train_designation',
  'hand_signals',
  'audible_signals',
];

function isSignalCategory(value: string): value is SignalCategory {
  return signalCategories.includes(value as SignalCategory);
}

export function encodeDetailId(category: SignalCategory, id: string): string {
  return `${category}${SEP}${id}`;
}

export function parseDetailId(raw: string): { category?: SignalCategory; id: string } {
  const index = raw.indexOf(SEP);
  if (index === -1) {
    return { id: raw };
  }

  const categoryPart = raw.slice(0, index);
  if (!isSignalCategory(categoryPart)) {
    return { id: raw };
  }

  return {
    category: categoryPart,
    id: raw.slice(index + SEP.length),
  };
}
