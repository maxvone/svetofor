# Content TODO

Placeholder descriptions must be replaced with text verified against the official *Инструкция по сигнализации* (Прил. №1 к ПТЭ, утв. Приказом Минтранса №250 от 23.06.2022).

## Workflow

1. `npm run content:generate` — regenerate JSON from taxonomy script
2. `npm run content:validate` — write `content/QA-report.md` and list gaps
3. Replace item placeholders after verifying against the official instruction text

## Railway signals — DONE (2026-08-15)

Official text imported from Инструкция по сигнализации (Прил. №1 к ПТЭ, Приказ №250) via `scripts/data/railway-signals-official.mjs`. 85 items, 0 placeholders.

## Signs & indicators — DONE (2026-08-15)

Official text from гл. VI (п. 58–78) via `scripts/data/signs-and-indications-official.mjs`. 49 items, 0 placeholders.

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
