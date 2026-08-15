import { aspect, lit, off } from './helpers';
import type { InteractiveSignalDefinition, LensDefinition } from './types';

export const METRO_REGULATION =
  'Инструкция по сигнализации на метрополитенах РФ (Международная Ассоциация «Метро», согласовано с ПТЭ)';

const SOURCE = `Источник: ${METRO_REGULATION}.`;

const METRO_ROUTE_LENSES: LensDefinition[] = [
  { id: 'green', defaultColor: 'green', label_ru: 'Зелёный' },
  { id: 'yellow1', defaultColor: 'yellow', label_ru: 'Жёлтый' },
  { id: 'yellow2', defaultColor: 'yellow', label_ru: 'Жёлтый (2-й)' },
  { id: 'red', defaultColor: 'red', label_ru: 'Красный' },
  { id: 'white', defaultColor: 'white', label_ru: 'Лунно-белый' },
];

const offRoute = () => [off('green'), off('yellow'), off('yellow'), off('red'), off('white')];

function buildRouteAspects(prefix: string, { includeInvitation = true } = {}) {
  const aspects = [
    aspect(
      `${prefix}-green`,
      '1 зелёный',
      'Разрешается движение с установленной скоростью.',
      `${METRO_REGULATION}, п. 2.8`,
      [lit('green'), off('yellow'), off('yellow'), off('red'), off('white')]
    ),
    aspect(
      `${prefix}-yellow`,
      '1 жёлтый',
      'Разрешается движение с готовностью остановиться; следующий светофор закрыт.',
      `${METRO_REGULATION}, п. 2.8`,
      [off('green'), lit('yellow'), off('yellow'), off('red'), off('white')]
    ),
    aspect(
      `${prefix}-yellow-green`,
      '1 жёлтый и 1 зелёный',
      'Разрешается движение с уменьшенной скоростью (не более 60 км/ч) и готовностью проследовать следующий светофор с жёлтым показанием (не более 35 км/ч, на наземных — 25 км/ч).',
      `${METRO_REGULATION}, п. 2.8`,
      [lit('green'), lit('yellow'), off('yellow'), off('red'), off('white')]
    ),
    aspect(
      `${prefix}-two-yellow`,
      '2 жёлтых',
      'Разрешается проследование светофора со скоростью не более 35 км/ч с отклонением по стрелочному переводу; следующий светофор закрыт.',
      `${METRO_REGULATION}, п. 2.8`,
      [off('green'), lit('yellow'), lit('yellow'), off('red'), off('white')]
    ),
    aspect(
      `${prefix}-red`,
      '1 красный',
      'Стой! Запрещается проезжать сигнал.',
      `${METRO_REGULATION}, п. 2.8`,
      [off('green'), off('yellow'), off('yellow'), lit('red'), off('white')]
    ),
  ];

  if (includeInvitation) {
    aspects.push(
      aspect(
        `${prefix}-invitation`,
        'Пригласительный (лунно-белый мигающий)',
        'После остановки разрешает проследовать светофор с запрещающим показанием со скоростью не более 20 км/ч до разрешающего показания АЛС или следующего светофора.',
        `${METRO_REGULATION}, п. 2.10`,
        [off('green'), off('yellow'), off('yellow'), off('red'), lit('white', true)]
      )
    );
  }

  return aspects;
}

function mirrorAspects(prefix: string, note: string) {
  return buildRouteAspects(prefix).map((entry) => ({
    ...entry,
    id: `${entry.id}-mirror`,
    meaning_ru: `${entry.meaning_ru} ${note}`,
  }));
}

function metroKey(groupId: string): string {
  return `metro_signals:${groupId}`;
}

export const metroInteractiveSignals: Record<string, InteractiveSignalDefinition> = {
  [metroKey('vhodnoy')]: {
    groupId: 'vhodnoy',
    title_ru: 'Входной светофор (метро)',
    sourceNote: SOURCE,
    lenses: METRO_ROUTE_LENSES,
    aspects: buildRouteAspects('metro-vh'),
  },

  [metroKey('vyhodnoy')]: {
    groupId: 'vyhodnoy',
    title_ru: 'Выходной светофор (метро)',
    sourceNote: SOURCE,
    lenses: [
      ...METRO_ROUTE_LENSES,
      { id: 'blue', defaultColor: 'blue', label_ru: 'Синий (АЛС)' },
    ],
    aspects: [
      aspect(
        'metro-vy-blue',
        '1 синий (АЛС-АРС, автоблокировка отключена)',
        'Разрешается движение по сигналам указателя АЛС в кабине; при «0» или «НЧ» после остановки — не более 20 км/ч с нажатой неделей до разрешающего показания АЛС.',
        `${METRO_REGULATION}, п. 2.9`,
        [off('green'), off('yellow'), off('yellow'), off('red'), off('white'), lit('blue')]
      ),
      ...buildRouteAspects('metro-vy', { includeInvitation: false }).map((entry) => ({
        ...entry,
        lensStates: [...entry.lensStates, off('blue')],
      })),
    ],
  },

  [metroKey('prohodnoy')]: {
    groupId: 'prohodnoy',
    title_ru: 'Проходной светофор (метро)',
    sourceNote: SOURCE,
    lenses: METRO_ROUTE_LENSES,
    aspects: buildRouteAspects('metro-ph'),
  },

  [metroKey('manevrovyy')]: {
    groupId: 'manevrovyy',
    title_ru: 'Маневровый светофор (метро)',
    sourceNote: SOURCE,
    lenses: [
      { id: 'white', defaultColor: 'white', label_ru: 'Лунно-белый' },
      { id: 'yellow', defaultColor: 'yellow', label_ru: 'Жёлтый' },
      { id: 'red', defaultColor: 'red', label_ru: 'Красный' },
      { id: 'blue', defaultColor: 'blue', label_ru: 'Синий (АЛС)' },
    ],
    aspects: [
      aspect(
        'metro-mn-white',
        '1 лунно-белый',
        'Разрешается производить маневры (по показаниям АЛС в кабине — на линиях с АЛС-АРС).',
        `${METRO_REGULATION}, п. 7.1`,
        [lit('white'), off('yellow'), off('red'), off('blue')]
      ),
      aspect(
        'metro-mn-red',
        '1 красный',
        'Запрещается производить маневры.',
        `${METRO_REGULATION}, п. 7.1`,
        [off('white'), off('yellow'), lit('red'), off('blue')]
      ),
      aspect(
        'metro-mn-red-yellow',
        '1 красный и 1 жёлтый',
        'Запрещается производить маневры (допускается применение).',
        `${METRO_REGULATION}, п. 7.1`,
        [off('white'), lit('yellow'), lit('red'), off('blue')]
      ),
      aspect(
        'metro-mn-blue',
        '1 синий (АЛС-АРС, автоблокировка отключена)',
        'Разрешается производить маневры по сигнальным показаниям указателя АЛС в кабине.',
        `${METRO_REGULATION}, п. 7.2`,
        [off('white'), off('yellow'), off('red'), lit('blue')]
      ),
    ],
  },

  [metroKey('povtoritelnyy')]: {
    groupId: 'povtoritelnyy',
    title_ru: 'Повторительный светофор (метро)',
    sourceNote: SOURCE,
    lenses: METRO_ROUTE_LENSES,
    aspects: mirrorAspects(
      'metro-pv',
      'Повторительный светофор подаёт то же показание, что и основной светофор.'
    ),
  },

  [metroKey('rezervnyy')]: {
    groupId: 'rezervnyy',
    title_ru: 'Резервный светофор (метро)',
    sourceNote: SOURCE,
    lenses: METRO_ROUTE_LENSES,
    aspects: [
      aspect(
        'metro-rz-off',
        'Нормально погашен',
        'Резервный светофор в штатном режиме не горит и сигнального значения не имеет.',
        `${METRO_REGULATION}, п. 2.13`,
        offRoute()
      ),
      ...mirrorAspects(
        'metro-rz',
        'При включении резервный светофор повторяет показание основного светофора.'
      ),
    ],
  },

  [metroKey('predupreditelnyy')]: {
    groupId: 'predupreditelnyy',
    title_ru: 'Предупредительный светофор (метро)',
    sourceNote: SOURCE,
    lenses: [
      { id: 'green', defaultColor: 'green', label_ru: 'Зелёный' },
      { id: 'yellow', defaultColor: 'yellow', label_ru: 'Жёлтый' },
    ],
    aspects: [
      aspect(
        'metro-pd-green',
        '1 зелёный',
        'Разрешается движение с установленной скоростью; основной светофор открыт.',
        `${METRO_REGULATION}, п. 2.14`,
        [lit('green'), off('yellow')]
      ),
      aspect(
        'metro-pd-yellow',
        '1 жёлтый',
        'Разрешается движение с готовностью остановиться; основной светофор закрыт.',
        `${METRO_REGULATION}, п. 2.14`,
        [off('green'), lit('yellow')]
      ),
    ],
  },

  [metroKey('prikrytiya')]: {
    groupId: 'prikrytiya',
    title_ru: 'Светофор прикрытия (метро)',
    sourceNote: SOURCE,
    lenses: [
      { id: 'red1', defaultColor: 'red', label_ru: 'Красный' },
      { id: 'red2', defaultColor: 'red', label_ru: 'Красный (2-й)' },
      { id: 'yellow', defaultColor: 'yellow', label_ru: 'Жёлтый' },
    ],
    aspects: [
      aspect(
        'metro-pr-off',
        'Огни погашены (норма)',
        'Нормально огни не горят — в этом положении светофор сигнального значения не имеет.',
        `${METRO_REGULATION}, п. 2.15`,
        [off('red'), off('red'), off('yellow')]
      ),
      aspect(
        'metro-pr-red',
        '1 красный',
        'Стой! Запрещается проезжать сигнал.',
        `${METRO_REGULATION}, п. 2.15`,
        [lit('red'), off('red'), off('yellow')]
      ),
      aspect(
        'metro-pr-two-red',
        '2 красных',
        'Стой! Запрещается проезжать сигнал.',
        `${METRO_REGULATION}, п. 2.15`,
        [lit('red'), lit('red'), off('yellow')]
      ),
      aspect(
        'metro-pr-yellow',
        '1 жёлтый (исправное состояние)',
        'Металлоконструкция в исправном состоянии, разрешается проезжать сигнал.',
        `${METRO_REGULATION}, п. 2.15`,
        [off('red'), off('red'), lit('yellow')]
      ),
    ],
  },
};
