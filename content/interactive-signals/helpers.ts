import type { LensColor, LensMode, LensState } from './types';

export const REGULATION = 'Прил. №1 к ПТЭ, Приказ Минтранса России №250 от 23.06.2022';

export function off(defaultColor: LensColor): LensState {
  return { displayColor: defaultColor, mode: 'off' };
}

export function lit(color: LensColor, flashing = false): LensState {
  return { displayColor: color, mode: flashing ? 'flashing' : 'steady' };
}

export function aspect(
  id: string,
  label_ru: string,
  meaning_ru: string,
  regulationRef: string,
  lensStates: LensState[]
) {
  return { id, label_ru, meaning_ru, regulationRef, lensStates };
}

export const GYR_LENSES = [
  { id: 'top', defaultColor: 'green' as const, label_ru: 'Верхний' },
  { id: 'middle', defaultColor: 'yellow' as const, label_ru: 'Средний' },
  { id: 'bottom', defaultColor: 'red' as const, label_ru: 'Нижний' },
];

export function lensStatesMatch(a: LensState[], b: LensState[]) {
  if (a.length !== b.length) return false;
  return a.every(
    (state, index) =>
      state.displayColor === b[index].displayColor && state.mode === b[index].mode
  );
}

export function formatLensState(states: LensState[]) {
  return states
    .filter((state) => state.mode !== 'off')
    .map((state) => {
      const colorName = {
        green: 'зелёный',
        yellow: 'жёлтый',
        red: 'красный',
        white: 'лунно-белый',
        blue: 'синий',
      }[state.displayColor];
      return state.mode === 'flashing' ? `мигающий ${colorName}` : colorName;
    })
    .join(' + ');
}

export const LENS_COLORS: LensColor[] = ['green', 'yellow', 'red', 'white', 'blue'];

export function nextLensState(current: LensState, defaultColor: LensColor): LensState {
  const cycle: Array<{ displayColor: LensColor; mode: LensMode } | 'off'> = [
    'off',
    { displayColor: defaultColor, mode: 'steady' },
    { displayColor: defaultColor, mode: 'flashing' },
    { displayColor: 'yellow', mode: 'steady' },
    { displayColor: 'yellow', mode: 'flashing' },
    { displayColor: 'green', mode: 'steady' },
    { displayColor: 'green', mode: 'flashing' },
    { displayColor: 'red', mode: 'steady' },
    { displayColor: 'white', mode: 'steady' },
    { displayColor: 'white', mode: 'flashing' },
    { displayColor: 'blue', mode: 'steady' },
  ];

  const key = (state: LensState | 'off') =>
    state === 'off'
      ? 'off'
      : `${state.displayColor}:${state.mode}`;

  const currentKey = current.mode === 'off' ? 'off' : key(current);
  const index = cycle.findIndex((entry) => key(entry) === currentKey);
  const next = cycle[(index + 1) % cycle.length];

  if (next === 'off') {
    return off(defaultColor);
  }

  return { displayColor: next.displayColor, mode: next.mode };
}

export function lensColorHex(color: LensColor, active: boolean) {
  if (!active) return '#2a3140';
  switch (color) {
    case 'green':
      return '#22c55e';
    case 'yellow':
      return '#facc15';
    case 'red':
      return '#ef4444';
    case 'white':
      return '#f8fafc';
    case 'blue':
      return '#3b82f6';
    default:
      return '#64748b';
  }
}

export function lensColorLabel(color: LensColor) {
  return {
    green: 'З',
    yellow: 'Ж',
    red: 'К',
    white: 'Б',
    blue: 'С',
  }[color];
}
