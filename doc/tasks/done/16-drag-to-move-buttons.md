# 16 — Drag-to-move buttons in the board editor

**Goal:** in `BoardEditorScreen`, long-press a filled cell and drag it to another cell to move/swap. Drop on an empty cell → move; drop on another filled cell → swap; drop outside the grid (or back on origin) → snap-back, no change.

## What was delivered

### Storage (`apps/mobile/src/boards.ts`)
- New `moveButton(boardId, buttonId, toX, toY)` helper. One `persist()` call handles both cases:
  - Target empty → just rewrite the moving button's `(x, y)`.
  - Target occupied → swap: occupant inherits the moving button's old `(x, y)`.
- Same-cell drop is a no-op (early return). Missing button is a no-op.

### Drag interaction (`apps/mobile/src/screens/BoardEditorScreen.tsx`)
- New `DraggableCell` component renders every filled cell. Built on RN's built-in `PanResponder` + `Animated.ValueXY` — no new dependencies (the project doesn't have `react-native-gesture-handler` / `reanimated` and the touch flow is simple enough not to need them).
- Touch lifecycle:
  1. Cell claims the responder on touch start; a 250 ms timer begins.
  2. If the user moves >8 px before 250 ms → cancel the timer; the gesture is a scroll. `onPanResponderTerminationRequest` returns `true` while not yet dragging, so the parent `ScrollView` can take the touch and scroll the page.
  3. If the timer fires (no/small movement) → enter drag mode. Light haptic, parent re-renders with lift + dim states.
  4. Release without entering drag mode and without movement counts as a tap → opens `ButtonEditor` (preserves the previous tap behavior).
- During drag: a `pan` `Animated.ValueXY` is updated on every move event so the cell follows the finger. The parent computes the cell under the dragged-cell's center and highlights it.
- On release:
  - Drop center inside grid AND not the origin cell → `moveButton(...)`, light haptic, transform reset to `(0, 0)` (the new layout already places the cell correctly).
  - Drop outside grid OR on origin → `Animated.spring` snap-back to `(0, 0)`, no state change.
  - Termination (e.g. forced cancel) → snap to 0, parent's drag state cleared.

### Visual states
- Filled cell being dragged: `scale 1.05`, `zIndex 10`, drop shadow (iOS) / `elevation 8` (Android).
- Other filled cells while a drag is in progress: `opacity 0.6`.
- Empty cells while a drag is in progress: dashed border brightens (`#5a5a5a`) to read as drop targets, and `onPress` is disabled so a stray tap on a cell mid-drag can't open the new-button editor.
- Cell currently under the dragged finger (filled or empty): yellow border `#fadc50, width: 2`.

### ScrollView lock
- `ScrollView scrollEnabled={!draggingId}` — once the long-press has fired and we're in drag mode, the page can no longer scroll. Before drag mode (the < 250 ms window), ScrollView still owns vertical swipes via the termination-request yield, so swiping over a button to scroll feels normal.

### Copy
- `boardEditor.layoutHint` now mentions long-press → drag.
- `buttonEditor.positionHint` no longer says "drag-to-move comes next" — it directs the user to long-press the button on the layout. EN + RU.

## Manual acceptance (per the task spec)

1. Boards → Adobe Animate → edit. Long-press "Brush" → light haptic, lift + dim.
2. Drag to an empty cell → release. Brush moves; old cell becomes dashed empty.
3. Long-press Brush → drag onto another filled button → release. Two buttons swap `(x, y)`.
4. Long-press, drag below grid, release outside → snap-back, no change.
5. Tap (no long-press) → ButtonEditor opens; drag mode does not trigger.
6. Vertical swipe over a button → page scrolls (responder yields before 250 ms). While dragging, page is locked.
7. Reload app → moved/swapped positions persist (same AsyncStorage write-through path as `upsertButton`).

## Notes on choices

- **No `react-native-gesture-handler` / `reanimated`.** The deps list is intentionally small; `PanResponder` + `Animated` cover this UX cleanly. Re-evaluate if/when the editor grows more gesture-heavy features (multi-select, drag-resize, etc.).
- **`useNativeDriver: false`.** We need JS-side `dx`/`dy` per move event to compute the hovered drop-target cell, so the Animated values are JS-driven. Single dragged element, no perceived jank.
- **No "drag handle" affordance.** Long-press is the standard mobile pattern for this; the layout hint mentions it, and the position hint inside `ButtonEditor` does too.
- **Drop target = origin-cell center + translation.** Computed from the dragged cell's center, not the raw finger position — so what the user sees lifted is what gets dropped.

## Out of scope (unchanged from spec)

- Multi-select drag.
- Drag-from-orphan-list onto the grid (orphans still surface in the off-grid section; user can open & delete or expand the grid).
- Reordering boards in `BoardsScreen`.
- Drag-to-resize (cell-span).
