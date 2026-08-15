import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAudibleGroups } from './data/audible-signals-official.mjs';
import { buildFoulProtectionGroups } from './data/foul-protection-official.mjs';
import { buildHandSignalsGroups } from './data/hand-signals-official.mjs';
import { buildMetroSignalsGroups } from './data/metro-signals-official.mjs';
import { buildRailwayGroups } from './data/railway-signals-official.mjs';
import { buildSignsGroups } from './data/signs-and-indications-official.mjs';
import { buildTrainDesignationGroups } from './data/train-designation-official.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, '..', 'content');

const files = {
  railway_signals: {
    category: 'railway_signals',
    title_ru: 'Светофоры',
    title_en: 'Railway signals',
    icon: 'TrafficCone',
    groups: buildRailwayGroups(),
  },
  metro_signals: {
    category: 'metro_signals',
    title_ru: 'Светофоры метрополитена',
    title_en: 'Metro signals',
    icon: 'TrainFront',
    groups: buildMetroSignalsGroups(),
  },
  signs_and_indications: {
    category: 'signs_and_indications',
    title_ru: 'Знаки и указатели',
    title_en: 'Signs and indications',
    icon: 'Signpost',
    groups: buildSignsGroups(),
  },
  foul_protection: {
    category: 'foul_protection',
    title_ru: 'Ограждение опасных мест',
    title_en: 'Foul protection',
    icon: 'ShieldAlert',
    groups: buildFoulProtectionGroups(),
  },
  train_designation: {
    category: 'train_designation',
    title_ru: 'Сигналы обозначения поездов',
    title_en: 'Train designation signals',
    icon: 'Tags',
    groups: buildTrainDesignationGroups(),
  },
  hand_signals: {
    category: 'hand_signals',
    title_ru: 'Ручные сигналы',
    title_en: 'Hand signals',
    icon: 'Hand',
    groups: buildHandSignalsGroups(),
  },
  audible_signals: {
    category: 'audible_signals',
    title_ru: 'Звуковые сигналы',
    title_en: 'Audible signals',
    icon: 'Volume2',
    groups: buildAudibleGroups(),
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

## Railway signals — DONE (2026-08-15)

Official text imported from Инструкция по сигнализации (Прил. №1 к ПТЭ, Приказ №250) via \`scripts/data/railway-signals-official.mjs\`. 85 items, 0 placeholders.

## Signs & indicators — DONE (2026-08-15)

Official text from гл. VI (п. 58–78) via \`scripts/data/signs-and-indications-official.mjs\`. 49 items, 0 placeholders.

## Audible signals — DONE (2026-08-15)

Official text from гл. IX–X (п. 96–106) via \`scripts/data/audible-signals-official.mjs\`. 37 items, 0 placeholders.

## Foul protection — DONE (2026-08-15)

Official text from гл. IV (п. 40–58) via \`scripts/data/foul-protection-official.mjs\`. 34 items, 0 placeholders.

## Hand signals — DONE (2026-08-15)

Official text from гл. V (п. 59–66) и маневровые п. 91 via \`scripts/data/hand-signals-official.mjs\`. 19 items, 0 placeholders.

## Train designation — DONE (2026-08-15)

Official text from гл. VIII (п. 93–103) via \`scripts/data/train-designation-official.mjs\`. 16 items, 0 placeholders.

## Metro signals — DONE (2026-08-15)

Official text from Инструкции по сигнализации на метрополитенах РФ via \`scripts/data/metro-signals-official.mjs\`. 42 items, 0 placeholders. Separate source from main ПТЭ instruction.

## Known issues from source brochures

- **Горочный / Недействующий**: brochure duplicate text — verify independently before shipping.
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
