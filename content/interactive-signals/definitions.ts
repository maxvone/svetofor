import { aspect, GYR_LENSES, lit, off, REGULATION } from './helpers';
import { metroInteractiveSignals } from './metro-definitions';
import { railwayRemainingSignals } from './railway-remaining';
import type { InteractiveSignalDefinition } from './types';
import type { SignalCategory } from '../types';

const SOURCE = `Источник: Инструкция по сигнализации (${REGULATION}).`;

const railwayInteractiveSignals: Record<string, InteractiveSignalDefinition> = {
  vhodnoy: {
    groupId: 'vhodnoy',
    title_ru: 'Входной светофор',
    sourceNote: SOURCE,
    lenses: [
      ...GYR_LENSES,
      { id: 'white', defaultColor: 'white', label_ru: 'Лунно-белый' },
    ],
    aspects: [
      aspect(
        'vh-green',
        '1 зелёный',
        'Разрешается поезду следовать на железнодорожную станцию по главному пути с установленной скоростью; следующий светофор (маршрутный или выходной) открыт.',
        `${REGULATION}, п. 9, 1)`,
        [lit('green'), off('yellow'), off('red'), off('white')]
      ),
      aspect(
        'vh-yellow-flash',
        '1 жёлтый мигающий',
        'Разрешается поезду следовать на станцию по главному пути с установленной скоростью; следующий светофор открыт и требует проследования с уменьшенной скоростью.',
        `${REGULATION}, п. 9, 2)`,
        [off('green'), lit('yellow', true), off('red'), off('white')]
      ),
      aspect(
        'vh-yellow',
        '1 жёлтый',
        'Разрешается поезду следовать на станцию по главному пути с готовностью остановиться; следующий светофор закрыт.',
        `${REGULATION}, п. 9, 3)`,
        [off('green'), lit('yellow'), off('red'), off('white')]
      ),
      aspect(
        'vh-2yellow-top-flash',
        '2 жёлтых (верхний мигает)',
        'Разрешается следование на станцию с уменьшенной скоростью на боковой путь; следующий светофор открыт.',
        `${REGULATION}, п. 9, 4)`,
        [lit('yellow', true), lit('yellow'), off('red'), off('white')]
      ),
      aspect(
        'vh-2yellow',
        '2 жёлтых',
        'Разрешается следование на станцию с уменьшенной скоростью на боковой путь и готовностью остановиться; следующий светофор закрыт.',
        `${REGULATION}, п. 9, 5)`,
        [lit('yellow'), lit('yellow'), off('red'), off('white')]
      ),
      aspect(
        'vh-red',
        '1 красный',
        'Стой! Запрещается проезжать сигнал.',
        `${REGULATION}, п. 9, 6)`,
        [off('green'), off('yellow'), lit('red'), off('white')]
      ),
      aspect(
        'vh-white-npp',
        '1 лунно-белый (НПП)',
        'Разрешается поезду следовать на железнодорожную станцию при погашенных основных огнях светофора до первого попутного маневрового светофора с дальнейшим движением маневровым порядком на железнодорожный путь, частично занятый подвижным составом или к объекту на путях необщего пользования, с особой бдительностью и готовностью остановиться.',
        `${REGULATION}, п. 9 (НПП)`,
        [off('green'), off('yellow'), off('red'), lit('white')]
      ),
      aspect(
        'vh-green-flash',
        '1 зелёный мигающий (п. 10)',
        'Разрешается поезду следовать на железнодорожную станцию по главному пути с установленной скоростью; следующий светофор (маршрутный или выходной) открыт и требует проследования его со скоростью не более 60 км/ч.',
        `${REGULATION}, п. 10 (доп.)`,
        [lit('green', true), off('yellow'), off('red'), off('white')]
      ),
    ],
  },

  vyhodnoy: {
    groupId: 'vyhodnoy',
    title_ru: 'Выходной светофор (автоблокировка)',
    sourceNote: SOURCE,
    lenses: [
      ...GYR_LENSES,
      { id: 'white', defaultColor: 'white', label_ru: 'Лунно-белый (АЛС)' },
    ],
    aspects: [
      aspect(
        'vy-green',
        '1 зелёный',
        'Разрешается отправиться со станции и следовать с установленной скоростью; впереди свободны два или более блок-участка (трёхзначная АБ) или три и более блок-участка (четырёхзначная АБ).',
        `${REGULATION}, п. 12, 1); п. 21, 1)`,
        [lit('green'), off('yellow'), off('red'), off('white')]
      ),
      aspect(
        'vy-yellow',
        '1 жёлтый',
        'Разрешается отправиться со станции и следовать с готовностью остановиться; следующий светофор закрыт (трёхзначная АБ) или впереди свободен один блок-участок (четырёхзначная АБ).',
        `${REGULATION}, п. 12, 2); п. 21, 3)`,
        [off('green'), lit('yellow'), off('red'), off('white')]
      ),
      aspect(
        'vy-2yellow-top-flash',
        '2 жёлтых (верхний мигает)',
        'Разрешается отправиться со станции с уменьшенной скоростью; поезд следует с отклонением по стрелочному переводу; следующий светофор открыт.',
        `${REGULATION}, п. 12, 3)`,
        [lit('yellow', true), lit('yellow'), off('red'), off('white')]
      ),
      aspect(
        'vy-2yellow',
        '2 жёлтых',
        'Разрешается отправиться со станции с уменьшенной скоростью; поезд следует с отклонением по стрелочному переводу; следующий светофор закрыт.',
        `${REGULATION}, п. 12, 4)`,
        [lit('yellow'), lit('yellow'), off('red'), off('white')]
      ),
      aspect(
        'vy-green-yellow',
        '1 зелёный + 1 жёлтый (АБ 4-значная)',
        'Разрешается отправиться со станции и следовать с установленной скоростью; впереди свободны два блок-участка.',
        `${REGULATION}, п. 21, 2)`,
        [lit('green'), lit('yellow'), off('red'), off('white')]
      ),
      aspect(
        'vy-red',
        '1 красный',
        'Стой! Запрещается проезжать сигнал.',
        `${REGULATION}, п. 12, 5); п. 21, 4)`,
        [off('green'), off('yellow'), lit('red'), off('white')]
      ),
      aspect(
        'vy-als-green-white',
        '1 зелёный + лунно-белый (АЛС)',
        'Разрешается отправиться с железнодорожной станции; впереди свободны два или более блок-участка.',
        `${REGULATION}, п. 15, 1)`,
        [lit('green'), off('yellow'), off('red'), lit('white')]
      ),
      aspect(
        'vy-als-yellow-white',
        '1 жёлтый + лунно-белый (АЛС)',
        'Разрешается отправиться с железнодорожной станции; впереди свободен один блок-участок.',
        `${REGULATION}, п. 15, 2)`,
        [off('green'), lit('yellow'), off('red'), lit('white')]
      ),
      aspect(
        'vy-als-red',
        '1 красный (АЛС)',
        'Стой! Запрещается проезжать сигнал.',
        `${REGULATION}, п. 15, 9)`,
        [off('green'), off('yellow'), lit('red'), off('white')]
      ),
    ],
  },

  marshrutnyy: {
    groupId: 'marshrutnyy',
    title_ru: 'Маршрутный светофор',
    sourceNote: SOURCE,
    lenses: GYR_LENSES,
    aspects: [
      aspect(
        'mr-green',
        '1 зелёный',
        'Разрешается движение с установленной скоростью; следующий светофор (маршрутный или выходной) открыт; впереди свободны три или более блок-участка (четырёхзначная АБ).',
        `${REGULATION}, п. 18, 1); п. 21, 1)`,
        [lit('green'), off('yellow'), off('red')]
      ),
      aspect(
        'mr-yellow',
        '1 жёлтый',
        'Разрешается движение с готовностью остановиться; следующий светофор (маршрутный или выходной) закрыт; впереди свободен один блок-участок (четырёхзначная АБ).',
        `${REGULATION}, п. 18, 2); п. 21, 3)`,
        [off('green'), lit('yellow'), off('red')]
      ),
      aspect(
        'mr-yellow-flash',
        '1 жёлтый мигающий',
        'Разрешается проследование с установленной скоростью; следующий светофор открыт и требует проследования с уменьшенной скоростью.',
        `${REGULATION}, п. 18, 3)`,
        [off('green'), lit('yellow', true), off('red')]
      ),
      aspect(
        'mr-2yellow-top-flash',
        '2 жёлтых (верхний мигает)',
        'Разрешается проследование с уменьшенной скоростью; поезд следует на боковой железнодорожный путь; следующий светофор (маршрутный или выходной) открыт.',
        `${REGULATION}, п. 18, 4)`,
        [lit('yellow', true), lit('yellow'), off('red')]
      ),
      aspect(
        'mr-2yellow',
        '2 жёлтых',
        'Разрешается проследование с уменьшенной скоростью и готовностью остановиться на станции; поезд следует на боковой железнодорожный путь; следующий светофор закрыт.',
        `${REGULATION}, п. 18, 5)`,
        [lit('yellow'), lit('yellow'), off('red')]
      ),
      aspect(
        'mr-green-yellow',
        '1 зелёный + 1 жёлтый (АБ 4-значная)',
        'Разрешается движение с установленной скоростью; впереди свободны два блок-участка.',
        `${REGULATION}, п. 21, 2)`,
        [lit('green'), lit('yellow'), off('red')]
      ),
      aspect(
        'mr-red',
        '1 красный',
        'Стой! Запрещается проезжать сигнал.',
        `${REGULATION}, п. 18, 6); п. 21, 4)`,
        [off('green'), off('yellow'), lit('red')]
      ),
    ],
  },

  prohodnoy: {
    groupId: 'prohodnoy',
    title_ru: 'Проходной светофор (автоблокировка)',
    sourceNote: SOURCE,
    lenses: GYR_LENSES,
    aspects: [
      aspect(
        'pr-green',
        '1 зелёный',
        'Разрешается движение с установленной скоростью; впереди свободны два или более блок-участка (трёхзначная АБ) или три и более блок-участка (четырёхзначная АБ).',
        `${REGULATION}, п. 19, 1); п. 20, 1); п. 21, 1)`,
        [lit('green'), off('yellow'), off('red')]
      ),
      aspect(
        'pr-green-yellow',
        '1 зелёный + 1 жёлтый',
        'Разрешается движение с уменьшенной скоростью (трёхзначная АБ) или с установленной скоростью при двух свободных блок-участках (четырёхзначная АБ).',
        `${REGULATION}, п. 20, 2); п. 21, 2)`,
        [lit('green'), lit('yellow'), off('red')]
      ),
      aspect(
        'pr-yellow',
        '1 жёлтый',
        'Разрешается движение с готовностью остановиться; следующий светофор закрыт (трёхзначная АБ) или впереди свободен один блок-участок (четырёхзначная АБ).',
        `${REGULATION}, п. 19, 2); п. 20, 3); п. 21, 3)`,
        [off('green'), lit('yellow'), off('red')]
      ),
      aspect(
        'pr-red',
        '1 красный',
        'Стой! Запрещается проезжать сигнал.',
        `${REGULATION}, п. 19, 3); п. 21, 4)`,
        [off('green'), off('yellow'), lit('red')]
      ),
    ],
  },

  predupreditelnyy: {
    groupId: 'predupreditelnyy',
    title_ru: 'Предупредительный светофор',
    sourceNote: SOURCE,
    lenses: GYR_LENSES,
    aspects: [
      aspect(
        'pu-green',
        '1 зелёный (перед основным)',
        'Разрешается движение с установленной скоростью; основной светофор открыт.',
        `${REGULATION}, п. 27, 1)`,
        [lit('green'), off('yellow'), off('red')]
      ),
      aspect(
        'pu-yellow',
        '1 жёлтый',
        'Разрешается движение с готовностью остановиться; основной светофор закрыт.',
        `${REGULATION}, п. 27, 2)`,
        [off('green'), lit('yellow'), off('red')]
      ),
      aspect(
        'pu-yellow-flash',
        '1 жёлтый мигающий',
        'Разрешается движение с установленной скоростью; входной светофор открыт и требует проследования его с уменьшенной скоростью; поезд принимается на боковой железнодорожный путь станции.',
        `${REGULATION}, п. 27, 3)`,
        [off('green'), lit('yellow', true), off('red')]
      ),
    ],
  },

  zagraditelnyy: {
    groupId: 'zagraditelnyy',
    title_ru: 'Заградительный светофор',
    sourceNote: SOURCE,
    lenses: [{ id: 'red', defaultColor: 'red', label_ru: 'Красный' }],
    aspects: [
      aspect(
        'zg-red',
        '1 красный',
        'Стой! Запрещается проезжать сигнал.',
        `${REGULATION}, п. 26`,
        [lit('red')]
      ),
    ],
  },

  manevrovyy: {
    groupId: 'manevrovyy',
    title_ru: 'Маневровый светофор',
    sourceNote: SOURCE,
    lenses: [
      { id: 'white', defaultColor: 'white', label_ru: 'Лунно-белый' },
      { id: 'blue', defaultColor: 'blue', label_ru: 'Синий' },
    ],
    aspects: [
      aspect(
        'mn-white',
        '1 лунно-белый',
        'Разрешается маневровому составу проследовать маневровый светофор и далее руководствоваться показаниями попутных светофоров или указаниями руководителя маневров.',
        `${REGULATION}, п. 80, 1)`,
        [lit('white'), off('blue')]
      ),
      aspect(
        'mn-blue',
        '1 синий',
        'Запрещается маневровому составу проследовать маневровый светофор.',
        `${REGULATION}, п. 80, 2)`,
        [off('white'), lit('blue')]
      ),
    ],
  },

  gorochnyy: {
    groupId: 'gorochnyy',
    title_ru: 'Горочный светофор',
    sourceNote: SOURCE,
    lenses: [
      { id: 'green', defaultColor: 'green', label_ru: 'Зелёный' },
      { id: 'yellow', defaultColor: 'yellow', label_ru: 'Жёлтый' },
      { id: 'red', defaultColor: 'red', label_ru: 'Красный' },
      { id: 'white', defaultColor: 'white', label_ru: 'Лунно-белый' },
    ],
    aspects: [
      aspect(
        'gr-green',
        '1 зелёный',
        'Разрешается роспуск вагонов с установленной скоростью.',
        `${REGULATION}, п. 81, 1)`,
        [lit('green'), off('yellow'), off('red'), off('white')]
      ),
      aspect(
        'gr-yellow',
        '1 жёлтый',
        'Разрешается роспуск вагонов с уменьшенной скоростью.',
        `${REGULATION}, п. 81, 2)`,
        [off('green'), lit('yellow'), off('red'), off('white')]
      ),
      aspect(
        'gr-green-yellow',
        '1 жёлтый + 1 зелёный',
        'Разрешается роспуск вагонов со скоростью, промежуточной между установленной и уменьшенной.',
        `${REGULATION}, п. 81, 3)`,
        [lit('green'), lit('yellow'), off('red'), off('white')]
      ),
      aspect(
        'gr-white',
        '1 лунно-белый',
        'Разрешается горочному локомотиву проследовать через горб горки и производить маневры на пути сортировочного парка.',
        `${REGULATION}, п. 81, 4)`,
        [off('green'), off('yellow'), off('red'), lit('white')]
      ),
      aspect(
        'gr-red',
        '1 красный',
        'Стой! Запрещается роспуск.',
        `${REGULATION}, п. 81, 5)`,
        [off('green'), off('yellow'), lit('red'), off('white')]
      ),
    ],
  },

  priglasitelnyy: {
    groupId: 'priglasitelnyy',
    title_ru: 'Пригласительный сигнал',
    sourceNote: SOURCE,
    lenses: [
      { id: 'white', defaultColor: 'white', label_ru: 'Лунно-белый' },
      { id: 'red', defaultColor: 'red', label_ru: 'Красный' },
    ],
    aspects: [
      aspect(
        'pg-invite',
        'Лунно-белый мигающий',
        'Разрешает проследовать светофор с красным огнём и продолжать движение до следующего светофора со скоростью не более 20 км/ч с особой бдительностью.',
        `${REGULATION}, п. 11`,
        [lit('white', true), lit('red')]
      ),
      aspect(
        'pg-invite-steady',
        'Лунно-белый (НПП)',
        'Разрешает проследовать светофор с красным огнём и продолжать движение до следующего светофора со скоростью не более 15 км/ч с особой бдительностью (пути необщего пользования).',
        `${REGULATION}, п. 11 (НПП)`,
        [lit('white'), lit('red')]
      ),
    ],
  },

  svetofor_prikrytiya: {
    groupId: 'svetofor_prikrytiya',
    title_ru: 'Светофор прикрытия',
    sourceNote: SOURCE,
    lenses: GYR_LENSES,
    aspects: [
      aspect(
        'sp-green',
        '1 зелёный',
        'Разрешается движение с установленной скоростью; путь свободен в пределах видимости.',
        `${REGULATION}, п. 25, 1)`,
        [lit('green'), off('yellow'), off('red')]
      ),
      aspect(
        'sp-red',
        '1 красный',
        'Стой! Запрещается проезжать сигнал.',
        `${REGULATION}, п. 25, 2)`,
        [off('green'), off('yellow'), lit('red')]
      ),
    ],
  },

  ...railwayRemainingSignals,
};

function withRailwayCategoryKeys(
  signals: Record<string, InteractiveSignalDefinition>
): Record<string, InteractiveSignalDefinition> {
  const keyed: Record<string, InteractiveSignalDefinition> = {};

  for (const [groupId, definition] of Object.entries(signals)) {
    keyed[`railway_signals:${groupId}`] = definition;
    keyed[groupId] = definition;
  }

  return keyed;
}

export const interactiveSignals: Record<string, InteractiveSignalDefinition> = {
  ...withRailwayCategoryKeys(railwayInteractiveSignals),
  ...metroInteractiveSignals,
};

function lookupKey(category: SignalCategory | undefined, groupId: string): string | undefined {
  if (category) {
    const scoped = `${category}:${groupId}`;
    if (scoped in interactiveSignals) {
      return scoped;
    }
  }

  if (groupId in interactiveSignals) {
    return groupId;
  }

  const railwayScoped = `railway_signals:${groupId}`;
  if (railwayScoped in interactiveSignals) {
    return railwayScoped;
  }

  return undefined;
}

export function getInteractiveSignal(
  category: SignalCategory | undefined,
  groupId: string
): InteractiveSignalDefinition | undefined {
  const key = lookupKey(category, groupId);
  return key ? interactiveSignals[key] : undefined;
}

export function hasInteractiveSignal(category: SignalCategory | undefined, groupId: string): boolean {
  return lookupKey(category, groupId) !== undefined;
}
