export type LensColor = 'green' | 'yellow' | 'red' | 'white' | 'blue';

export type LensMode = 'off' | 'steady' | 'flashing';

export type InteractiveDisplayKind = 'lenses' | 'semaphore';

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

export interface SemaphoreAspect {
  id: string;
  label_ru: string;
  wing: 'raised' | 'horizontal' | 'double';
  nightColor: 'green' | 'red' | 'green-yellow';
  meaning_ru: string;
  regulationRef: string;
}

export interface InteractiveSignalDefinition {
  groupId: string;
  title_ru: string;
  sourceNote: string;
  displayKind?: InteractiveDisplayKind;
  lenses: LensDefinition[];
  aspects: SignalAspect[];
  semaphoreAspects?: SemaphoreAspect[];
}
