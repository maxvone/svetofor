export type WhistleBeat = 'short' | 'long';

export interface WhistlePattern {
  beats: WhistleBeat[];
  /** Repeat the whole pattern (e.g. fog). */
  repeat?: number;
  /** Abbreviated looping demo for prolonged alarm signals. */
  demoLoopSeconds?: number;
  /** Relative loudness 0–1 (e.g. quiet whistle). */
  volume?: number;
}

export interface AudiblePatternDefinition {
  itemId: string;
  pattern: WhistlePattern;
  patternLabel_ru: string;
}
