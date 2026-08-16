import type { AudiblePatternDefinition, WhistlePattern } from './types';

function define(itemId: string, patternLabel_ru: string, pattern: WhistlePattern): AudiblePatternDefinition {
  return { itemId, patternLabel_ru, pattern };
}

/** Playable whistle patterns keyed by content item id. */
export const audiblePatterns: Record<string, AudiblePatternDefinition> = {
  'alarm-p103-general': define('alarm-p103-general', '1 длинный + 3 коротких', {
    beats: ['long', 'short', 'short', 'short'],
  }),
  'alarm-p104-fire': define('alarm-p104-fire', '1 длинный + 2 коротких', {
    beats: ['long', 'short', 'short'],
  }),
  'alarm-p105-air': define('alarm-p105-air', 'Сокращённый фрагмент (6 с)', {
    beats: ['long'],
    demoLoopSeconds: 6,
  }),
  'alarm-p106-rad-chem': define('alarm-p106-rad-chem', '1 длинный + 1 короткий (×5)', {
    beats: ['long', 'short'],
    repeat: 5,
  }),

  'general-p96-stop': define('general-p96-stop', '3 коротких', { beats: ['short', 'short', 'short'] }),
  'general-p96-depart': define('general-p96-depart', '1 длинный', { beats: ['long'] }),
  'general-p96-brake': define('general-p96-brake', '3 длинных', { beats: ['long', 'long', 'long'] }),
  'general-p96-release': define('general-p96-release', '2 длинных', { beats: ['long', 'long'] }),
  'general-p96-incomplete': define('general-p96-incomplete', '3 длинных + 1 короткий', {
    beats: ['long', 'long', 'long', 'short'],
  }),
  'general-p96-call': define('general-p96-call', '3 длинных + 2 коротких', {
    beats: ['long', 'long', 'long', 'short', 'short'],
  }),
  'general-p51-brake-test': define('general-p51-brake-test', '1 короткий', { beats: ['short'] }),
  'general-p51-release-test': define('general-p51-release-test', '2 коротких', { beats: ['short', 'short'] }),
  'general-p97-notify': define('general-p97-notify', '1 длинный', { beats: ['long'] }),
  'general-p97-notify-wrong': define('general-p97-notify-wrong', 'Длинный — короткий — длинный', {
    beats: ['long', 'short', 'long'],
  }),
  'general-p98-case1': define('general-p98-case1', '1 короткий + 1 длинный', { beats: ['short', 'long'] }),
  'general-p99-meet': define('general-p99-meet', '1 длинный (оповестительный)', { beats: ['long'] }),
  'general-p100-parity': define('general-p100-parity', '2 длинных (чётный поезд)', {
    beats: ['long', 'long'],
  }),
  'general-p101-quiet': define('general-p101-quiet', '1 длинный (тихий свисток)', {
    beats: ['long'],
    volume: 0.45,
  }),
  'general-p97-fog': define('general-p97-fog', '1 длинный (×3)', { beats: ['long'], repeat: 3 }),
  'general-p35-yellow-long': define('general-p35-yellow-long', '1 длинный', { beats: ['long'] }),

  'double_heading-p96-1short': define('double_heading-p96-1short', '1 короткий', { beats: ['short'] }),
  'double_heading-p96-2short': define('double_heading-p96-2short', '2 коротких', { beats: ['short', 'short'] }),
  'double_heading-p96-pantograph': define('double_heading-p96-pantograph', '2 длинных + 2 коротких', {
    beats: ['long', 'long', 'short', 'short'],
  }),

  'pusher-p96-start': define('pusher-p96-start', '2 коротких', { beats: ['short', 'short'] }),
  'pusher-p96-hold': define('pusher-p96-hold', 'Короткий — длинный — короткий', {
    beats: ['short', 'long', 'short'],
  }),
  'pusher-p96-return': define('pusher-p96-return', '4 длинных', { beats: ['long', 'long', 'long', 'long'] }),
};

export function getAudiblePattern(itemId: string): AudiblePatternDefinition | undefined {
  return audiblePatterns[itemId];
}

export function hasAudiblePattern(itemId: string): boolean {
  return itemId in audiblePatterns;
}

export function getPlayableItemIdsForGroup(groupId: string, itemIds: string[]): string[] {
  return itemIds.filter((itemId) => itemId.startsWith(`${groupId}-`) && hasAudiblePattern(itemId));
}

export function hasPlayableAudibleGroup(groupId: string, itemIds: string[]): boolean {
  return getPlayableItemIdsForGroup(groupId, itemIds).length > 0;
}
