import { aspect, GYR_LENSES, lit, off, REGULATION } from './helpers';
import type { InteractiveSignalDefinition } from './types';

/** Remaining railway signal types (§25–32, §113) — merged into interactiveSignals. */
export const railwayRemainingSignals: Record<string, InteractiveSignalDefinition> = {
  povtoritelnyy: {
    groupId: 'povtoritelnyy',
    title_ru: 'Повторительный светофор',
    sourceNote: `Источник: Инструкция по сигнализации (${REGULATION}).`,
    lenses: [
      { id: 'green', defaultColor: 'green', label_ru: 'Зелёный' },
      { id: 'white', defaultColor: 'white', label_ru: 'Лунно-белый' },
      { id: 'yellow', defaultColor: 'yellow', label_ru: 'Жёлтый' },
    ],
    aspects: [
      aspect(
        'pv-green',
        '1 зелёный',
        'Указывает, что выходной или маршрутный светофор открыт.',
        `${REGULATION}, п. 28`,
        [lit('green'), off('white'), off('yellow')]
      ),
      aspect(
        'pv-white',
        '1 лунно-белый',
        'На путях необщего пользования: маневровый светофор открыт.',
        `${REGULATION}, п. 28, 1)`,
        [off('green'), lit('white'), off('yellow')]
      ),
      aspect(
        'pv-yellow',
        '1 жёлтый',
        'На путях необщего пользования: въездной (выездной) или технологический светофор открыт.',
        `${REGULATION}, п. 28, 2)`,
        [off('green'), off('white'), lit('yellow')]
      ),
      aspect(
        'pv-off',
        'Огни погашены',
        'Нормально огни не горят — сигнального значения нет.',
        `${REGULATION}, п. 28`,
        [off('green'), off('white'), off('yellow')]
      ),
    ],
  },

  lokomotivnyy: {
    groupId: 'lokomotivnyy',
    title_ru: 'Локомотивный светофор (кабина)',
    sourceNote: `Источник: Инструкция по сигнализации (${REGULATION}).`,
    lenses: [
      { id: 'green', defaultColor: 'green', label_ru: 'Зелёный' },
      { id: 'yellow', defaultColor: 'yellow', label_ru: 'Жёлтый' },
      { id: 'red', defaultColor: 'red', label_ru: 'Красный' },
      { id: 'white', defaultColor: 'white', label_ru: 'Белый' },
    ],
    aspects: [
      aspect(
        'lk-green',
        'Зелёный',
        'Разрешается движение; на путевом светофоре горит зелёный огонь (АЛС+АБ).',
        `${REGULATION}, п. 29, 1)`,
        [lit('green'), off('yellow'), off('red'), off('white')]
      ),
      aspect(
        'lk-yellow',
        'Жёлтый',
        'Разрешается движение; на путевом светофоре один или два жёлтых огня.',
        `${REGULATION}, п. 29, 2)`,
        [off('green'), lit('yellow'), off('red'), off('white')]
      ),
      aspect(
        'lk-yellow-red',
        'Жёлтый + красный',
        'Разрешается движение с готовностью остановиться; на путевом светофоре красный огонь.',
        `${REGULATION}, п. 29, 3)`,
        [off('green'), lit('yellow'), lit('red'), off('white')]
      ),
      aspect(
        'lk-red',
        'Красный',
        'Загорается при проезде путевого светофора с красным огнём или вступлении на занятый блок-участок.',
        `${REGULATION}, п. 29, 4); п. 30`,
        [off('green'), off('yellow'), lit('red'), off('white')]
      ),
      aspect(
        'lk-white',
        'Белый',
        'Устройства включены, показания путевых светофоров не передаются — руководствоваться только путевыми светофорами.',
        `${REGULATION}, п. 29; п. 30`,
        [off('green'), off('yellow'), off('red'), lit('white')]
      ),
    ],
  },

  vyezdnoy: {
    groupId: 'vyezdnoy',
    title_ru: 'Въездной (выездной) светофор',
    sourceNote: `Источник: Инструкция по сигнализации (${REGULATION}). Пути необщего пользования.`,
    lenses: [
      { id: 'yellow', defaultColor: 'yellow', label_ru: 'Жёлтый' },
      { id: 'red', defaultColor: 'red', label_ru: 'Красный' },
    ],
    aspects: [
      aspect(
        'vy-e-yellow',
        '1 жёлтый',
        'Разрешается въезд в производственное помещение (или выезд из него).',
        `${REGULATION}, п. 31, 1)`,
        [lit('yellow'), off('red')]
      ),
      aspect(
        'vy-e-red',
        '1 красный',
        'Стой! Въезд в производственное помещение (или выезд из него) запрещён.',
        `${REGULATION}, п. 31, 2)`,
        [off('yellow'), lit('red')]
      ),
    ],
  },

  tekhnologicheskiy: {
    groupId: 'tekhnologicheskiy',
    title_ru: 'Технологический светофор',
    sourceNote: `Источник: Инструкция по сигнализации (${REGULATION}). Пути необщего пользования.`,
    lenses: [
      { id: 'yellow', defaultColor: 'yellow', label_ru: 'Жёлтый' },
      { id: 'red', defaultColor: 'red', label_ru: 'Красный' },
      { id: 'white', defaultColor: 'white', label_ru: 'Лунно-белый (обратная)' },
    ],
    aspects: [
      aspect(
        'tk-yellow',
        '1 жёлтый',
        'Разрешается подача вагонов к объекту на путях необщего пользования с готовностью остановиться.',
        `${REGULATION}, п. 31, 1)`,
        [lit('yellow'), off('red'), off('white')]
      ),
      aspect(
        'tk-red',
        '1 красный',
        'Стой!',
        `${REGULATION}, п. 31, 2)`,
        [off('yellow'), lit('red'), off('white')]
      ),
      aspect(
        'tk-white-rear',
        'Лунно-белый (обратная сторона)',
        'Убрать вагоны с объекта, расположенного на пути необщего пользования.',
        `${REGULATION}, п. 31, 3)`,
        [off('yellow'), off('red'), lit('white')]
      ),
    ],
  },

  nedeystvuyushchiy: {
    groupId: 'nedeystvuyushchiy',
    title_ru: 'Недействующий светофор',
    sourceNote: `Источник: Инструкция по сигнализации (${REGULATION}).`,
    lenses: GYR_LENSES,
    aspects: [
      aspect(
        'nd-off',
        'Огни погашены',
        'Светофор закрещён двумя планками, сигнальные огни погашены — сигнального значения нет.',
        `${REGULATION}, п. 32`,
        [off('green'), off('yellow'), off('red')]
      ),
    ],
  },

  pereezdnoy: {
    groupId: 'pereezdnoy',
    title_ru: 'Переездной светофор — справочник цветов',
    sourceNote: `Базовые значения огней светофоров по ${REGULATION}, п. 8 (применение на переездах — по местным правилам).`,
    lenses: [
      { id: 'green', defaultColor: 'green', label_ru: 'Зелёный' },
      { id: 'yellow', defaultColor: 'yellow', label_ru: 'Жёлтый' },
      { id: 'red', defaultColor: 'red', label_ru: 'Красный' },
      { id: 'white', defaultColor: 'white', label_ru: 'Лунно-белый' },
      { id: 'blue', defaultColor: 'blue', label_ru: 'Синий' },
    ],
    aspects: [
      aspect(
        'pz-off',
        'Погашен',
        'Огни не горят — сигнального значения нет (норма для заградительных/предупредительных в безопасном положении).',
        `${REGULATION}, п. 26–27`,
        [off('green'), off('yellow'), off('red'), off('white'), off('blue')]
      ),
      aspect(
        'pz-green',
        '1 зелёный',
        'Разрешается движение с установленной скоростью; следующий светофор открыт.',
        `${REGULATION}, п. 8, 1)`,
        [lit('green'), off('yellow'), off('red'), off('white'), off('blue')]
      ),
      aspect(
        'pz-yellow',
        '1 жёлтый',
        'Разрешается движение с готовностью остановиться; следующий светофор закрыт.',
        `${REGULATION}, п. 8, 3)`,
        [off('green'), lit('yellow'), off('red'), off('white'), off('blue')]
      ),
      aspect(
        'pz-red',
        '1 красный',
        'Стой! Запрещается проезжать сигнал.',
        `${REGULATION}, п. 8, 6)`,
        [off('green'), off('yellow'), lit('red'), off('white'), off('blue')]
      ),
      aspect(
        'pz-white',
        '1 лунно-белый',
        'Разрешается маневровому составу проследовать маневровый светофор.',
        `${REGULATION}, п. 8, 7)`,
        [off('green'), off('yellow'), off('red'), lit('white'), off('blue')]
      ),
      aspect(
        'pz-blue',
        '1 синий',
        'Запрещается маневровому составу проследовать маневровый светофор.',
        `${REGULATION}, п. 8, 8)`,
        [off('green'), off('yellow'), off('red'), off('white'), lit('blue')]
      ),
    ],
  },

  semafor: {
    groupId: 'semafor',
    title_ru: 'Семафор',
    displayKind: 'semaphore',
    sourceNote: `Источник: Инструкция по сигнализации (${REGULATION}, гл. XI).`,
    lenses: [],
    aspects: [],
    semaphoreAspects: [
      {
        id: 'sm-proceed',
        label_ru: 'Крыло поднято / зелёный огонь',
        wing: 'raised',
        nightColor: 'green',
        meaning_ru:
          'Путь свободен. Так сигнализируют входные семафоры при приёме на главный путь с готовностью остановиться, а также выходные, проходные и семафоры прикрытия.',
        regulationRef: `${REGULATION}, п. 113, 1)`,
      },
      {
        id: 'sm-stop',
        label_ru: 'Крыло горизонтально / красный огонь',
        wing: 'horizontal',
        nightColor: 'red',
        meaning_ru: 'Стой! Запрещается проезжать сигнал.',
        regulationRef: `${REGULATION}, п. 113, 2)`,
      },
      {
        id: 'sm-double',
        label_ru: 'Два крыла подняты / зелёный + жёлтый',
        wing: 'double',
        nightColor: 'green-yellow',
        meaning_ru:
          'Входной: разрешается следование на боковой путь с готовностью остановиться. Выходной: разрешается отправление на ответвление.',
        regulationRef: `${REGULATION}, п. 114`,
      },
    ],
  },
};
