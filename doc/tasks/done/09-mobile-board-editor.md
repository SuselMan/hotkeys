# 09 — Mobile board editor

**Goal:** create/edit boards, place buttons on a configurable grid, set label and key combo per button.

## What was delivered

### Persistence (`apps/mobile/src/boards.ts`)
- Swapped the in-memory store for `@react-native-async-storage/async-storage`.
- Lazy hydrate via `loadBoards()`; mutations go through `createBoard` / `updateBoard` / `deleteBoard` / `upsertButton` / `removeButton` and emit to subscribers.
- `useBoards()` and `useBoard(id)` React hooks for live updates.
- Seed: on first run, AsyncStorage is empty → store the Adobe Animate sample so the user has something to play with. After that, AsyncStorage is the source of truth.

### Boards list (`BoardsScreen.tsx`)
- Lists all boards with name + dimensions + button count.
- "Run" button per row → enters run mode.
- "×" per row → confirm-dialog → `deleteBoard`.
- "+ New board" with inline name input.
- Free-tier cap: hidden when `boards.length >= 1`. The hint card mentions PRO.

### Board editor (`BoardEditorScreen.tsx`)
- Header with Done.
- Name field — edits live via `updateBoard`.
- Grid counters: cols (2..10) and rows (2..14) with `-`/`+` buttons.
- Visual grid: aspect-ratio 1, every cell is a `Pressable`.
  - Empty cell: dashed border + `+` glyph → opens ButtonEditor in "new" mode for that x/y.
  - Filled cell: solid bg, label + formatted combo → opens ButtonEditor in edit mode.
- Off-grid section: if grid is shrunk below existing buttons' coords, they appear in a separate list with a warning so they're not silently lost.

### Button editor (`ButtonEditorScreen.tsx`)
- Label `TextInput`.
- Combo field: tap to open the combo builder (full-screen).
- Position readout (move-by-edit not yet, drag-to-move is a follow-up).
- Icon placeholder pointing at #11.
- Delete button (only when editing existing).

### Combo builder (`ComboBuilderScreen.tsx`)
- Top: Cancel / Done. Done disabled until at least one main key is selected.
- Preview: live `Ctrl + Shift + S` formatting via `keys-display.ts:formatCombo`. Sorted in conventional modifier order regardless of input.
- Modifier toggles: 4 sticky pills (Ctrl / Shift / Alt / Win) — defaulting to L-side. R-side codes are normalized to L on input for the simplified MVP UI.
- Main-key sections (single-select): Letters (A-Z), Digits (0-9), F1-F12, Editing & navigation (Esc, Tab, Caps, Backspace, Enter, Space, Del, Home, End, PgUp, PgDn, Ins), Arrows, Punctuation. Tapping a key sets it as the main key; tap again clears.
- Clear button on the preview pill resets modifiers + main key.

### `keys-display.ts`
- `prettyKey(code)` — human label for a W3C `code` (Ctrl, Shift, Win, Esc, Space, ←/→/↑/↓, etc.). Defaults to stripping the `Key`/`Digit` prefix.
- `formatCombo(keys)` — returns `Ctrl + Shift + S` style strings with deterministic ordering.

### Routing (`App.tsx`)
- Added `editingBoardId: string | null` modal-state. While set, the board editor takes over the screen, hiding the tabbar. ButtonEditor and ComboBuilder are nested modals managed by BoardEditor / ButtonEditor themselves.

## Acceptance test (manual)

1. Open Boards tab. The seeded "Adobe Animate" board is visible.
2. Tap the board — editor opens. Rename to "Animate". Buttons remain.
3. Set columns to 5, rows to 4. Existing buttons stay where they were; one new column / row of empty cells appears.
4. Tap an empty cell → ButtonEditor → "Brush" + tap "Tap to set" → ComboBuilder → press Ctrl + Shift, tap `B` → Done → Add. Cell renders the new button.
5. Tap an existing button → change its combo, save. Visible immediately on the grid.
6. Shrink grid to 3×3. Off-grid buttons surface in the warning section. Open one → delete or wait until expanding back.
7. Done → return to boards list. Tap Run → all edits are live in run mode.
8. Force-close Expo Go and reopen — boards persist.

## Open follow-ups

- Drag-to-move buttons across cells.
- Long-press to multi-select (delete several at once).
- L/R-modifier distinction in the combo builder (advanced toggle).
- Icon picker — lands with #11 (Material Symbols).
- PRO unlock for >1 board, custom colors, custom icons — handled later in monetization scope.
