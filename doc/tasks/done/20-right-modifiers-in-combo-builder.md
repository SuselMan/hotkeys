# 20 — Expose Right Ctrl / Right Shift in the combo builder

**Gap:** the combo builder only offers four modifier toggles — `Ctrl / Shift / Alt / Win` — all wired to the left-side codes (`ControlLeft`, `ShiftLeft`, `AltLeft`, `MetaLeft`). There is no way to bind Right Ctrl or Right Shift, even though many apps treat them as distinct (vim-style remaps, gaming layouts, AutoHotkey scripts that listen for `RCtrl`/`RShift`).

`apps/mobile/src/screens/ComboBuilderScreen.tsx:21` — current modifier list:

```ts
const MODIFIER_TOGGLES: Array<{ label: string; code: KeyCode }> = [
  { label: "Ctrl",  code: "ControlLeft" },
  { label: "Shift", code: "ShiftLeft" },
  { label: "Alt",   code: "AltLeft" },
  { label: "Win",   code: "MetaLeft" },
];
```

And `splitInitial` on line 206 actively *erases* the distinction when loading an existing combo:

```ts
mods.add(k.replace("Right", "Left") as KeyCode);
```

So if a user imports a board (or we add presets) that bind `ControlRight`, the UI silently rewrites it to `ControlLeft` on first edit — data loss.

## Scope

Add at least Right Ctrl and Right Shift. Right Alt (AltGr) and Right Win are nice-to-have but lower priority — Right Alt in particular is risky on EU keyboards because the OS treats AltGr as a layout-switching modifier.

## Implementation sketch

1. Add toggles for `ControlRight` and `ShiftRight` to `MODIFIER_TOGGLES`. Likely UI shape: keep Ctrl/Shift/Alt/Win as the primary row, then a secondary row "Right modifiers" with R-Ctrl / R-Shift (and maybe R-Alt, R-Win behind a disclosure). Avoid making the primary modifier row 8 buttons wide on small phones.
2. Drop the `replace("Right", "Left")` normalization in `splitInitial` (line 206) — preserve the side.
3. Add i18n keys for the new labels: `combo.rCtrl`, `combo.rShift` (en + ru). The existing `combo.modifiers` section title can stay; if we add a second row, give it `combo.modifiersRight` ("Right modifiers" / "Правые модификаторы").
4. Verify `keys-display.ts` `prettyKey` already handles `ControlRight` / `ShiftRight` — if not, add short labels (e.g. "RCtrl", "RShift") so the preview/cell labels read correctly.
5. Verify desktop key-injection layer maps `ControlRight` / `ShiftRight` to the correct virtual keys (VK_RCONTROL / VK_RSHIFT on Windows). If it currently collapses to the left-side keys, fix that too — otherwise the toggle will look like it works but produce L-side keystrokes.

## Acceptance test (manual)

1. Open the combo builder, toggle R-Ctrl + a letter → preview shows "RCtrl + X" (or equivalent).
2. Save the button, reopen — selection round-trips: R-Ctrl stays toggled, L-Ctrl is *not* toggled.
3. On the desktop, open a tool that distinguishes the two (AutoHotkey's `KeyHistory`, or `Get-WinEvent` with a key logger) and confirm `VK_RCONTROL` is pressed, not `VK_LCONTROL`.
4. Existing boards that bind L-Ctrl keep working unchanged.
5. Import a JSON board containing `ControlRight` — the binding survives an edit-cycle (regression test for the `splitInitial` fix).

## Out of scope

- Right Alt (AltGr) and Right Win — defer until someone asks.
- Distinguishing left/right for the *main* key (the lower-half grid). The main-key picker stays single-side; only modifiers gain the distinction.
