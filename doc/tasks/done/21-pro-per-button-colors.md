# 21 — Per-button colors (PRO)

**What:** let users override the default button look — background color, icon color, label/text color — per button. Fields already exist on `BoardButton` (see `apps/mobile/src/types.ts:10`):

```ts
/** PRO fields — ignored on free tier for now. */
bgColor?: string;
iconColor?: string;
textColor?: string;
```

…they're just not surfaced anywhere yet. The schema commitment was made early so this can land without an export-format migration.

## Scope

1. **Color pickers in `ButtonEditorScreen`.** Three new fields under the existing icon section: Background, Icon, Label/Text. Default is "inherit" (= use whatever the run/edit screen renders today, the `#fadc50` / `#1a1a1a` / `#e8e8e8` palette). Tapping a swatch opens a small picker. Recommended: a fixed palette of ~12 colors plus a "default" reset chip — avoids shipping a full HSL picker for v1.
2. **Apply colors in `RunScreen` and the `BoardEditor` preview.** Currently both render buttons with hardcoded colors; route through `button.bgColor ?? defaultBg` etc. Make sure the active-press highlight still reads against custom backgrounds (probably: lighten/darken by a fixed delta rather than swapping to a fixed yellow).
3. **Pro gating.** `useIsPro()` check: free users see the color section as a locked row (e.g. "Custom colors — PRO" with a soft lock badge). Tapping it shows the same `proLockTitle/Body` style alert as the boards limit. Don't *erase* color values that already exist on a button when tier flips back to free — just stop honoring them at render time, so dropping back to free doesn't destroy data. Alternative: still honor saved colors, only block editing — pick whichever feels less punitive in playtest.
4. **Templates stay neutral.** Bundled templates in `apps/mobile/src/templates/` should not carry custom colors — they're free-tier content.
5. **i18n strings:** `buttonEditor.colorsLabel`, `buttonEditor.bgColor`, `buttonEditor.iconColor`, `buttonEditor.textColor`, `buttonEditor.colorReset`, `buttonEditor.colorsProLock` (EN + RU).

## Implementation sketch

- Tiny `ColorSwatchPicker` component: row of pressables, active one ringed.
- Palette as a const in a new `apps/mobile/src/colors-palette.ts` so it's shared between editor and any future "theme" feature.
- Run-screen rendering: extract a `buttonStyle(button, pressed)` helper so the color logic isn't duplicated between Run and Editor preview.

## Acceptance test

1. Free → open button editor: colors section is visible but locked, tap shows pro hint.
2. Flip Pro in Settings → editor unlocks. Pick a non-default for each of the three slots, save.
3. Run mode renders the button with the chosen colors, including pressed state.
4. Editor preview (BoardEditorScreen layout grid) matches the Run rendering — no color drift between the two.
5. Export → import a board with custom colors → colors round-trip through JSON.
6. Flip back to Free → existing custom colors either keep rendering (if we go with "honor saved data") or revert to default (if we go with "erase at render"). Decision recorded here once we pick.

## Out of scope

- Gradients, per-state colors (hover/pressed/disabled), board-level themes — defer.
- Color picker with HSL/hex input — fixed palette only for v1.
- Migration: the fields already exist on every `BoardButton`, no schema bump needed.
