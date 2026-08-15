import { aspect, GYR_LENSES, lit, off, REGULATION } from './helpers';
import { railwayRemainingSignals } from './railway-remaining';
import type { InteractiveSignalDefinition } from './types';

const SOURCE = `Источник: Инструкция по сигнализации (${REGULATION}).`;

export const interactiveSignals: Record<string, InteractiveSignalDefinition> = {
  vhodnoy: {
    groupId: 'vhodnoy',
    title_ru: 'Входной светофор',
    sourceNote: SOURCE,
    lenses: GYR_LENSES,
    aspects: [
      aspect(
        'vh-green',
        '1 зелёный',
        'Разрешается поезду следовать на железнодорожную станцию по главному пути с установленной скоростью; следующий светофор (маршрутный или выходной) открыт.',
        `${REGULATION}, п. 9, 1)`,
        [lit('green'), off('yellow'), off('red')]
      ),
      aspect(
        'vh-yellow-flash',
        '1 жёлтый мигающий',
        'Разрешается поезду следовать на станцию по главному пути с установленной скоростью; следующий светофор открыт и требует проследования с уменьшенной скоростью.',
        `${REGULATION}, п. 9, 2)`,
        [off('green'), lit('yellow', true), off('red')]
      ),
      aspect(
        'vh-yellow',
        '1 жёлтый',
        'Разрешается поезду следовать на станцию по главному пути с готовностью остановиться; следующий светофор закрыт.',
        `${REGULATION}, п. 9, 3)`,
        [off('green'), lit('yellow'), off('red')]
      ),
      aspect(
        'vh-2yellow-top-flash',
        '2 жёлтых (верхний мигает)',
        'Разрешается следование на станцию с уменьшенной скоростью на боковой путь; следующий светофор открыт.',
        `${REGULATION}, п. 9, 4)`,
        [lit('yellow', true), lit('yellow'), off('red')]
      ),
      aspect(
        'vh-2yellow',
        '2 жёлтых',
        'Разрешается следование на станцию с уменьшенной скоростью на боковой путь и готовностью остановиться; следующий светофор закрыт.',
        `${REGULATION}, п. 9, 5)`,
        [lit('yellow'), lit('yellow'), off('red')]
      ),
      aspect(
        'vh-red',
        '1 красный',
        'Стой! Запрещается проезжать сигнал.',
        `${REGULATION}, п. 9, 6)`,
        [off('green'), off('yellow'), lit('red')]
      ),
    ],
  },

  vyhodnoy: {
    groupId: 'vyhodnoy',
    title_ru: 'Выходной светофор (автоблокировка)',
    sourceNote: SOURCE,
    lenses: GYR_LENSES,
    aspects: [
      aspect(
        'vy-green',
        '1 зелёный',
        'Разрешается отправиться со станции и следовать с установленной скоростью; впереди свободны два или более блок-участка.',
        `${REGULATION}, п. 12, 1)`,
        [lit('green'), off('yellow'), off('red')]
      ),
      aspect(
        'vy-yellow',
        '1 жёлтый',
        'Разрешается отправиться со станции и следовать с готовностью остановиться; следующий светофор закрыт.',
        `${REGULATION}, п. 12, 2)`,
        [off('green'), lit('yellow'), off('red')]
      ),
      aspect(
        'vy-green-yellow',
        '1 зелёный + 1 жёлтый',
        'Разрешается отправиться со станции и следовать с уменьшенной скоростью; впереди свободен один блок-участок.',
        `${REGULATION}, п. 12, 3)`,
        [lit('green'), lit('yellow'), off('red')]
      ),
      aspect(
        'vy-2yellow',
        '2 жёлтых',
        'Разрешается отправиться со станции с уменьшенной скоростью; поезд следует с отклонением по стрелочному переводу; следующий светофор закрыт.',
        `${REGULATION}, п. 12, 4)`,
        [lit('yellow'), lit('yellow'), off('red')]
      ),
      aspect(
        'vy-red',
        '1 красный',
        'Стой! Запрещается проезжать сигнал.',
        `${REGULATION}, п. 12, 5)`,
        [off('green'), off('yellow'), lit('red')]
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
        'Разрешается движение с установленной скоростью; следующий светофор (маршрутный или выходной) открыт.',
        `${REGULATION}, п. 18, 1)`,
        [lit('green'), off('yellow'), off('red')]
      ),
      aspect(
        'mr-yellow',
        '1 жёлтый',
        'Разрешается движение с готовностью остановиться; следующий светофор закрыт.',
        `${REGULATION}, п. 18, 2)`,
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
        'mr-red',
        '1 красный',
        'Стой! Запрещается проезжать сигнал.',
        `${REGULATION}, п. 18, 6)`,
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
        'Разрешается движение с установленной скоростью; впереди свободны два или более блок-участка.',
        `${REGULATION}, п. 19, 1); п. 20, 1)`,
        [lit('green'), off('yellow'), off('red')]
      ),
      aspect(
        'pr-green-yellow',
        '1 зелёный + 1 жёлтый',
        'Разрешается движение с уменьшенной скоростью; впереди свободен один блок-участок.',
        `${REGULATION}, п. 20, 2)`,
        [lit('green'), lit('yellow'), off('red')]
      ),
      aspect(
        'pr-yellow',
        '1 жёлтый',
        'Разрешается движение с готовностью остановиться; следующий светофор закрыт.',
        `${REGULATION}, п. 19, 2); п. 20, 3)`,
        [off('green'), lit('yellow'), off('red')]
      ),
      aspect(
        'pr-red',
        '1 красный',
        'Стой! Запрещается проезжать сигнал.',
        `${REGULATION}, п. 19, 3)`,
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
        '1 зелёный (перед въездным)',
        'Разрешается движение с установленной скоростью; въездной светофор открыт.',
        `${REGULATION}, п. 27, 1)`,
        [lit('green'), off('yellow'), off('red')]
      ),
      aspect(
        'pu-yellow-flash',
        '1 жёлтый мигающий (перед въездным)',
        'Разрешается движение с установленной скоростью; въездной светофор закрыт, требуется проследование с уменьшенной скоростью.',
        `${REGULATION}, п. 27, 2)`,
        [off('green'), lit('yellow', true), off('red')]
      ),
      aspect(
        'pu-yellow',
        '1 жёлтый',
        'Разрешается движение с готовностью остановиться; основной заградительный или въездной светофор закрыт.',
        `${REGULATION}, п. 27, 3)`,
        [off('green'), lit('yellow'), off('red')]
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
        'Разрешается движение с уменьшенной скоростью; путь свободен в пределах видимости.',
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

export function getInteractiveSignal(groupId: string): InteractiveSignalDefinition | undefined {
  return interactiveSignals[groupId];
}

export function hasInteractiveSignal(groupId: string): boolean {
  return groupId in interactiveSignals;
}
