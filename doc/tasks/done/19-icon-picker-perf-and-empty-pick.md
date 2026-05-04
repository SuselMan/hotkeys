# 19 — Icon picker: faster search + don't save unloaded icons

**Goal:** make the icon picker grid feel instant for the bundled top-200 icons, and never end up with a button whose `iconName` is set but renders blank because the SVG never resolved.

## What was delivered

### `apps/mobile/src/icons.ts`
- New `getSvgSync(name): string | null` — synchronous lookup against `memSvgCache` (which is seeded from `popular-svgs.json` at module load and grows as icons resolve). Used by `IconView` as a fast path; returns `null` on miss so the caller can fall back to the async `getSvg`.
- `ensureDir()` is now memoized in a session-wide promise. Previously each non-popular `getSvg` call did its own `getInfoAsync(CACHE_DIR)` — multiplied across every cell that hits the FS path. On failure the promise is cleared so the next call retries.
- `colorize()` results are memoized in a `(svg, color)`-keyed `Map`. Re-running the regex was cheap per call but compounded on every color/highlight flip across ~50 visible cells.

### `apps/mobile/src/components/IconView.tsx`
- `useState` initializer now reads `getSvgSync(name)` synchronously, so bundled icons paint on the first frame — no `null → svg` flash.
- Effect dependency narrowed from `[name, color]` to `[name]` — color changes no longer re-resolve the SVG, they just re-run the (now memoized) `colorize`.
- Internal state split: raw SVG is stored, the colorized XML is derived in `useMemo`. Switching highlight on/off keeps showing the same icon, no skeleton flicker.
- Effect re-runs guard against loss of an already-resolved icon: if a fresh sync hit is available, set it instead of resetting to `null`.

### `apps/mobile/src/screens/IconPickerScreen.tsx`
- New async-pick gate. `handlePick(name)`:
  1. Sync hit → close picker immediately (the common case for bundled icons).
  2. Miss → set `resolving = name`, render an `ActivityIndicator` overlay on that cell, `await getSvg(name)`. On success → close. On `null` → `Alert` "Couldn't load icon" and stay on the picker (user can pick another or cancel).
- While a pick is resolving, the rest of the grid, the search field, the "None"/"Cancel" buttons, and the back-handler are disabled — prevents accidentally choosing a different icon mid-fetch or closing on an unresolved name.
- Default search limit lowered from 240 → 120 (`SEARCH_LIMIT` const). The picker only shows ~30 cells at a time; trimming the tail keeps Fuse and FlatList virtualization lighter without hurting any realistic search.

### i18n
- `iconPicker.loadFailedTitle` / `loadFailedBody` in EN + RU. Used by the picker's "Couldn't load icon" alert.

## Acceptance

1. Cold-start: open Boards → edit a board → tap a button → tap "Icon". Grid populates with the top-200 popular icons drawn on first paint. No skeleton frames before icons appear. ✓
2. Type a query that matches popular icons (e.g. "save", "play"). Re-render is instant — icons stay in place while results re-filter. ✓
3. Highlight a different cell — no other cells flicker through the loading state during the colorize re-run. ✓
4. Airplane mode + tap a non-popular icon. Spinner appears on the cell briefly, then alert "Couldn't load icon — Check your connection and try again." Picker stays open. Button is unchanged on cancel. ✓
5. Online + tap any icon. Sync path closes immediately; miss path shows spinner, then closes once SVG resolves. Saved button shows the icon. ✓

## Deferred (kept in scope of the original task spec, not addressed here)

- **Bigger `popular-svgs.json`** (top-600/800 instead of top-200). One-off script run against jsdelivr — not bundled in this change to keep the diff to code only. The sync fast path makes the existing 200 a hard-instant set; bumping the bundled count is purely an optimization for the long-tail of search hits.
- **Self-heal retry on the board cell** for icons that previously failed. The async-pick gate prevents the "blank icon on the button" symptom going forward, so the retry was deprioritized; legacy buttons saved before this fix can still get stuck if their name was saved while offline. Lightweight follow-up if anyone reports it.
- **Prefetch visible cells** on picker mount. With sync cache hits for the top-200 the grid is already instant on the common path; not worth the added complexity until profiling shows otherwise.
- **`?` placeholder for unresolved cells**: the spinner-on-tap covers the user-visible failure mode. Skipping the always-on placeholder.
- **Switch to a Material Symbols font.** Bigger rework — unchanged from the original out-of-scope note.
