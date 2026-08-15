import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, '..', 'content');

const PLACEHOLDER_MARKERS = [
  'TODO:',
  'будут добавлены после сверки',
  'требует сверки',
];

const EXPECTED = {
  railway_signals: { groups: 17 },
  metro_signals: { groups: 9 },
  signs_and_indications: { groups: 5, brochureItems: 49 },
  foul_protection: { groups: 9 },
  train_designation: { groups: 3 },
  hand_signals: { groups: 5 },
  audible_signals: { groups: 4, brochureItems: 37 },
};

function isPlaceholder(text = '') {
  return PLACEHOLDER_MARKERS.some((marker) => text.includes(marker));
}

function loadCategoryFiles() {
  return readdirSync(contentDir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => {
      const filePath = join(contentDir, name);
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      return { name, data };
    });
}

function validate() {
  const categories = loadCategoryFiles();
  const issues = [];
  const stats = [];

  for (const { name, data } of categories) {
    const category = data.category;
    const expected = EXPECTED[category];
    const groupCount = data.groups?.length ?? 0;
    const totalItems = data.groups?.reduce((sum, group) => sum + (group.items?.length ?? 0), 0) ?? 0;
    const placeholderItems = data.groups?.flatMap((group) =>
      (group.items ?? []).filter((item) => isPlaceholder(item.shortDescription_ru))
    ).length ?? 0;

    stats.push({ category, groupCount, totalItems, placeholderItems });

    if (expected?.groups && groupCount !== expected.groups) {
      issues.push(`[${category}] groups: expected ${expected.groups}, got ${groupCount} (${name})`);
    }

    if (expected?.brochureItems && totalItems < expected.brochureItems) {
      issues.push(
        `[${category}] seeded ${totalItems} items; brochure lists ${expected.brochureItems} total (expand before shipping)`
      );
    }

    for (const group of data.groups ?? []) {
      if (!group.summary_ru) {
        issues.push(`[${category}/${group.id}] missing summary_ru`);
      }

      if (group.itemCount && (group.items?.length ?? 0) < group.itemCount) {
        issues.push(
          `[${category}/${group.id}] seeded ${group.items?.length ?? 0}/${group.itemCount} variants (expected until content import)`
        );
      }

      const descriptions = new Set((group.items ?? []).map((item) => item.shortDescription_ru));
      if (descriptions.size === 1 && (group.items?.length ?? 0) > 1 && isPlaceholder([...descriptions][0])) {
        issues.push(`[${category}/${group.id}] all variants share placeholder description`);
      }
    }
  }

  const summaries = categories.flatMap(({ data }) =>
    (data.groups ?? []).map((group) => ({
      id: group.id,
      summary: group.summary_ru ?? '',
    }))
  );
  const summaryTexts = summaries.map((entry) => entry.summary);
  const duplicateSummaries = summaries.filter(
    (entry, _, all) =>
      entry.summary &&
      summaryTexts.filter((text) => text === entry.summary).length > 1 &&
      !entry.summary.includes('требует сверки')
  );
  for (const entry of duplicateSummaries) {
    issues.push(`[${entry.id}] duplicate summary_ru text detected — verify wording`);
  }

  const report = `# Content QA report

Generated: ${new Date().toISOString()}

## Category stats

| Category | Groups | Seeded items | Placeholder items |
|---|---:|---:|---:|
${stats.map((row) => `| ${row.category} | ${row.groupCount} | ${row.totalItems} | ${row.placeholderItems} |`).join('\n')}

## Findings (${issues.length})

${issues.length ? issues.map((issue) => `- ${issue}`).join('\n') : '- No blocking issues'}

## Next steps

1. Import verified text from *Инструкция по сигнализации* (Прил. №1 к ПТЭ, Приказ Минтранса №250).
2. Expand seeded variants to brochure item counts where applicable.
3. Review metro and audible categories against authoritative sources.
4. Replace placeholder item descriptions and fill \`regulationRef\` / \`fullDescription_ru\`.
`;

  writeFileSync(join(contentDir, 'QA-report.md'), report, 'utf8');

  console.log(report);
  if (issues.some((issue) => issue.includes('missing summary') || issue.includes('duplicate summary'))) {
    process.exitCode = 1;
  }
}

validate();
