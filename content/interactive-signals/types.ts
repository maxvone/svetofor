export type LensColor = 'green' | 'yellow' | 'red' | 'white' | 'blue';

export type LensMode = 'off' | 'steady' | 'flashing';

export interface LensDefinition {
  id: string;
  defaultColor: LensColor;
  label_ru: string;
}

export interface LensState {
  /** Which color is lit in this lens position. */
  displayColor: LensColor;
  mode: LensMode;
}

export interface SignalAspect {
  id: string;
  label_ru: string;
  lensStates: LensState[];
  meaning_ru: string;
  regulationRef: string;
}

export interface InteractiveSignalDefinition {
  groupId: string;
  title_ru: string;
  sourceNote: string;
  lenses: LensDefinition[];
  aspects: SignalAspect[];
}
