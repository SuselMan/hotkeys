# 11 — Material Symbols icons (full set + offline search)

**Goal:** icon picker over the full ~3866 Material Symbols set with offline name+tag search and lazy SVG loading.

## What was delivered

### Generation (`packages/icons-meta`)
- `scripts/fetch-meta.mjs` — pulls `https://fonts.google.com/metadata/icons?incomplete=true`, strips Google's anti-XSSI prefix, filters to icons available in the **Material Symbols Outlined** family, and emits `data/icons-meta.json` with `{name, version, popularity, categories, tags}` per icon. Sorted by popularity for cheap "no query" defaults.
- `scripts/fetch-popular-svgs.mjs` — fetches top 200 SVGs from `https://cdn.jsdelivr.net/npm/@material-symbols/svg-400/outlined/<name>.svg` with concurrency 16 and writes `data/popular-svgs.json` (~96 KB) — name → SVG XML map.
- `npm run build` runs both. Data files are checked in so consumers don't need network at install.
- Total in repo: 1.7 MB metadata + 96 KB SVGs.

### Mobile integration

**`apps/mobile/src/data/`** — copies of the generated files imported as JSON.

**`apps/mobile/src/icons.ts`**
- `searchIcons(query, limit)` — Fuse.js index over `name` (weight 0.6), `tags` (0.3), `categories` (0.1). Threshold 0.35, location-agnostic. Empty query returns top-N by popularity.
- `getSvg(name)` — resolves an SVG XML string in this order: in-memory cache → top-200 bundled → `expo-file-system/legacy` cache directory → fetch from jsdelivr → write to disk + cache. Inflight requests deduplicated via a `Map<name, Promise>` so concurrent renders don't pile up duplicate fetches.
- `colorize(svg, color)` — injects `fill` into `<path>` elements (Material Symbols ship with no fill, so default would be black on black for our dark theme).
- Uses the **legacy** entry of `expo-file-system` (`expo-file-system/legacy`) — SDK 54 rewrote the main API around `Paths`/`File` classes; we'll migrate when it stabilizes.

**`apps/mobile/src/components/IconView.tsx`**
- Async-resolves the SVG for a given name, renders via `react-native-svg`'s `<SvgXml>`. Shows a sized empty `<View>` placeholder until the XML resolves so layout doesn't jump.

**`apps/mobile/src/screens/IconPickerScreen.tsx`**
- Full-screen modal launched from `ButtonEditorScreen`.
- Top: Cancel / "Pick icon" / "None" (clears icon).
- Search input over all 3866 icons with debounce-free Fuse search (instant, the index is small enough).
- 5-column `FlatList` grid; each cell renders a 28 px icon + truncated name. Tapping an icon picks it; the previously-selected icon (if visible) is highlighted yellow.

**Wire-up**
- `ButtonEditorScreen` — new "Icon" field opens the picker; persists `iconName` on save.
- `BoardEditorScreen` — cells now render icon + label + combo, icon size scales to ~35 % of the cell.
- `RunScreen` — cells render icon + label, icon size scales to ~40 % of the cell, icon recolors to dark when pressed.

### Dependencies added
- `react-native-svg` (Expo-managed install, native rasterization on Android)
- `fuse.js`
- `expo-file-system` (already installed; we only use the legacy entry today)

## Acceptance test (manual)

1. Reload the app. Open Boards → Adobe Animate → Edit. Tap any button → Icon → Pick icon.
2. Picker opens. Without typing, the top-popularity icons (search, home, menu, close, settings…) render instantly from the bundle — no network needed.
3. Type "save" — Material's Save floppy + Save As + cloud-save show up in <100 ms via Fuse.
4. Pick "save" → return to button → icon visible above the label.
5. Done → Run → button shows the icon at full size; turns dark when pressed.
6. Switch the phone to airplane mode, pick another bundled icon (e.g. "delete") — works. Pick a non-bundled icon (e.g. "ac_unit"): first time shows the placeholder for ~1 s while the fetch fails offline; turn airplane mode off, retry, the icon caches and renders forever after.

## Open follow-ups

- LRU eviction on the disk cache. Today we never evict — at 200-300 bytes per SVG and a couple thousand icons max, growth is bounded around a few MB. Worth wiring once we ship.
- Per-icon style switching (Outlined / Rounded / Sharp / Filled) — PRO tier in #project.md.
- Skeleton shimmer instead of empty placeholder while SVG resolves.
- Move the bundled JSON to an Expo asset + lazy parse instead of inline JS import; today the 1.7 MB metadata inflates the JS bundle and Hermes startup.
- 10-language search synonyms (the English `tags` only help English speakers right now).
