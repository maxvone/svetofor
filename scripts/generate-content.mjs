import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, '..', 'content');

const ITEM_PLACEHOLDER =
  'Полное описание и значения показаний будут добавлены после сверки с Инструкцией по сигнализации (Прил. №1 к ПТЭ).';

function defaultSummary(titleRu, scopeNote = '') {
  const scope = scopeNote ? ` ${scopeNote}` : '';
  return `Раздел «${titleRu}».${scope} Значения и правила применения — по Инструкции по сигнализации (требует сверки).`;
}

function item(groupId, index, title) {
  return {
    id: `${groupId}-${index}`,
    title_ru: title ?? `Вариант ${index}`,
    shortDescription_ru: ITEM_PLACEHOLDER,
    fullDescription_ru: '',
    regulationRef: '',
  };
}

function group(category, id, title_ru, title_en, icon, itemCount, itemTitles, summary_ru) {
  const items = itemTitles
    ? itemTitles.map((t, i) => item(id, i + 1, t))
    : itemCount
      ? Array.from({ length: Math.min(itemCount, 2) }, (_, i) =>
          item(id, i + 1, `${title_ru} — вариант ${i + 1}`)
        )
      : [item(id, 1, title_ru)];

  return {
    id,
    category,
    title_ru,
    title_en,
    icon,
    itemCount,
    summary_ru: summary_ru ?? defaultSummary(title_ru),
    items,
  };
}

const files = {
  railway_signals: {
    category: 'railway_signals',
    title_ru: 'Светофоры',
    title_en: 'Railway signals',
    icon: 'TrafficCone',
    groups: [
      group('railway_signals', 'vhodnoy', 'Входной', 'Home signal', 'Circle', 19),
      group('railway_signals', 'vyhodnoy', 'Выходной', 'Starting signal', 'CircleDot', 31),
      group('railway_signals', 'marshrutnyy', 'Маршрутный', 'Route signal', 'Route', 16),
      group('railway_signals', 'priglasitelnyy', 'Пригласительный', 'Call-on signal', 'Bell', 2),
      group('railway_signals', 'prohodnoy', 'Проходной', 'Intermediate signal', 'Minus', 13),
      group('railway_signals', 'svetofor_prikrytiya', 'Светофор прикрытия', 'Protecting signal', 'Shield', 2),
      group('railway_signals', 'zagraditelnyy', 'Заградительный', 'Blocking signal', 'Octagon', 2),
      group('railway_signals', 'predupreditelnyy', 'Предупредительный', 'Distant signal', 'Triangle', 5),
      group('railway_signals', 'povtoritelnyy', 'Повторительный', 'Repeater signal', 'Copy', 3),
      group('railway_signals', 'lokomotivnyy', 'Локомотивный', 'Cab signal', 'Train', undefined, undefined,
        'Локомотивная сигнализация в кабине. Не является путевым светофором. Требует сверки с Инструкцией по сигнализации.'),
      group('railway_signals', 'vyezdnoy', 'Въездной (выездной)', 'Entry (exit) signal', 'LogIn', 2),
      group('railway_signals', 'tekhnologicheskiy', 'Технологический', 'Industrial signal', 'Factory', 4),
      group('railway_signals', 'manevrovyy', 'Маневровый', 'Shunting signal', 'Shuffle', 3),
      group('railway_signals', 'gorochnyy', 'Горочный', 'Hump signal', 'TrendingUp', 7, undefined,
        'Светофоры горочной автоматической централизации на сортировочных станциях. Значения показаний — по Инструкции (требует сверки).'),
      group(
        'railway_signals',
        'nedeystvuyushchiy',
        'Недействующий',
        'Signal not in use',
        'CircleOff',
        undefined,
        ['Недействующий светофор'],
        'Светофоры, не используемые для текущей организации движения (временно или постоянно). Порядок оформления — по Инструкции (требует сверки).'
      ),
      group('railway_signals', 'semafor', 'Семафор', 'Semaphore signal', 'Flag', undefined, [
        'Действующий семафор',
        'Недействующий семафор',
      ]),
      group('railway_signals', 'pereezdnoy', 'Переездной', 'Level crossing signal', 'AlertTriangle', undefined, [
        'Справочник сигналов переезда',
      ], 'Справочник цветов и значений сигналов переездного светофора. Требует сверки с Инструкцией по сигнализации.'),
    ],
  },
  metro_signals: {
    category: 'metro_signals',
    title_ru: 'Светофоры метрополитена',
    title_en: 'Metro signals',
    icon: 'TrainFront',
    groups: [
      'vhodnoy',
      'vyhodnoy',
      'prohodnoy',
      'manevrovyy',
      'povtoritelnyy',
      'rezervnyy',
      'predupreditelnyy',
      'prikrytiya',
      'ats_als',
    ].map((id, i) => {
      const titles = [
        ['Входной', 'Home'],
        ['Выходной', 'Starting'],
        ['Проходной', 'Intermediate'],
        ['Маневровый', 'Shunting'],
        ['Повторительный', 'Repeater'],
        ['Резервный', 'Spare'],
        ['Предупредительный', 'Distant'],
        ['Прикрытия', 'Protection'],
        ['АТС-АЛС', 'ATS-ASC'],
      ][i];
      return group(
        'metro_signals',
        id,
        titles[0],
        titles[1],
        'Circle',
        1,
        undefined,
        defaultSummary(titles[0], 'Категория светофоров метрополитена.')
      );
    }),
  },
  signs_and_indications: {
    category: 'signs_and_indications',
    title_ru: 'Знаки и указатели',
    title_en: 'Signs and indications',
    icon: 'Signpost',
    groups: [
      group('signs_and_indications', 'portable', 'Переносные сигнальные знаки', 'Portable signal signs', 'Hand', 8),
      group('signs_and_indications', 'permanent', 'Постоянные сигнальные знаки', 'Permanent signal signs', 'MapPin', 18),
      group('signs_and_indications', 'temporary', 'Временные сигнальные знаки', 'Temporary signal signs', 'Clock', 6),
      group('signs_and_indications', 'indicators', 'Сигнальные указатели', 'Signal boards/indicators', 'PanelTop', 8),
      group(
        'signs_and_indications',
        'warning',
        'Постоянные предупредительные знаки',
        'Permanent warning signs',
        'AlertCircle',
        9
      ),
    ],
  },
  foul_protection: {
    category: 'foul_protection',
    title_ru: 'Ограждение опасных мест',
    title_en: 'Foul protection',
    icon: 'ShieldAlert',
    groups: [
      group('foul_protection', 'stop_whistle_c', 'Ограждение сигнальными знаками «С»', 'Stop-whistle sign "C"', 'Octagon'),
      group(
        'foul_protection',
        'speed_reduction',
        'Ограждение сигналами уменьшения скорости',
        'Speed-reduction protection',
        'Gauge'
      ),
      group('foul_protection', 'stop_signal', 'Ограждение сигналами остановки', 'Stop-signal protection', 'Square'),
      group(
        'foul_protection',
        'sudden_obstruction',
        'Ограждение мест внезапно возникшего препятствия',
        'Sudden-obstruction protection',
        'AlertTriangle'
      ),
      group(
        'foul_protection',
        'rolling_open_line',
        'Ограждение подвижного состава на перегоне',
        'Rolling-stock protection (open line)',
        'Train'
      ),
      group(
        'foul_protection',
        'rolling_station',
        'Ограждение подвижного состава на станции',
        'Rolling-stock protection (station)',
        'Building2'
      ),
      group(
        'foul_protection',
        'conductor_required',
        'Места, проходимые только с проводником',
        'Conductor-required sections',
        'UserCheck'
      ),
      group(
        'foul_protection',
        'artificial_structures',
        'Особенности ограждения на искусственных сооружениях',
        'Protection on bridges/tunnels',
        'Building2'
      ),
      group(
        'foul_protection',
        'people_equipment',
        'Лица и средства ограждения',
        'People and equipment',
        'Users',
        undefined,
        ['Сигналист (день)', 'Сигналист (ночь)', 'Петарды', 'Ручной фонарь']
      ),
    ],
  },
  train_designation: {
    category: 'train_designation',
    title_ru: 'Сигналы обозначения поездов',
    title_en: 'Train designation signals',
    icon: 'Tags',
    groups: [
      group('train_designation', 'head', 'Сигналы головы поезда', 'Head-of-train signals', 'ChevronsUp'),
      group('train_designation', 'end', 'Сигналы хвоста поезда', 'End-of-train signals', 'ChevronsDown'),
      group('train_designation', 'special', 'Специальные сигналы', 'Special-purpose signals', 'Star'),
    ],
  },
  hand_signals: {
    category: 'hand_signals',
    title_ru: 'Ручные сигналы',
    title_en: 'Hand signals',
    icon: 'Hand',
    groups: [
      group('hand_signals', 'stop', 'Остановка', 'Stop', 'HandMetal'),
      group('hand_signals', 'proceed', 'Следование', 'Proceed', 'ArrowRight'),
      group('hand_signals', 'speed', 'Контроль скорости', 'Speed control', 'Gauge'),
      group('hand_signals', 'shunting', 'Маневровые', 'Shunting', 'Shuffle'),
      group('hand_signals', 'auxiliary', 'Вспомогательные', 'Auxiliary signals', 'Plus'),
    ],
  },
  audible_signals: {
    category: 'audible_signals',
    title_ru: 'Звуковые сигналы',
    title_en: 'Audible signals',
    icon: 'Volume2',
    groups: [
      group('audible_signals', 'alarm', 'Сигналы тревоги', 'Alarm signals', 'Siren', 4),
      group('audible_signals', 'general', 'Общие сигналы', 'General signals', 'Megaphone', 9),
      group('audible_signals', 'double_heading', 'Следование двойной тягой', 'Double heading', 'Users', 3),
      group('audible_signals', 'pusher', 'Следование с подталкивающим локомотивом', 'Pusher operation', 'TrainFront', 3),
    ],
  },
};

mkdirSync(contentDir, { recursive: true });

for (const [name, data] of Object.entries(files)) {
  writeFileSync(join(contentDir, `${name}.json`), JSON.stringify(data, null, 2), 'utf8');
}

writeFileSync(
  join(contentDir, 'TODO.md'),
  `# Content TODO

Placeholder descriptions must be replaced with text verified against the official *Инструкция по сигнализации* (Прил. №1 к ПТЭ, утв. Приказом Минтранса №250 от 23.06.2022).

## Workflow

1. \`npm run content:generate\` — regenerate JSON from taxonomy script
2. \`npm run content:validate\` — write \`content/QA-report.md\` and list gaps
3. Replace item placeholders after verifying against the official instruction text

## Known issues from source brochures

- **Горочный / Недействующий**: brochure duplicate text — verify independently before shipping.
- **Metro signals**: no metro-specific PDF in source set — needs separate authoritative review.
- **Audible signals**: v1 uses text/diagram representation only (no audio playback).

## Count sanity checks (from brochures)

| Category | Expected |
|---|---|
| Railway signal types | 17 |
| Signs subcategories | 5 (49 items total) |
| Audible subcategories | 4 (37 signals total) |
| Foul protection topics | 8 + people/equipment |
`,
  'utf8'
);

console.log('Generated content JSON files.');
