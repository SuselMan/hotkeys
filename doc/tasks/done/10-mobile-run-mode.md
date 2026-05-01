# 10 — Mobile run mode

**Goal:** full-screen grid of buttons; touchstart → press WS event, touchend → release WS event; haptics + visual highlight.

## What was delivered

### Data model (`apps/mobile/src/types.ts`)
- `BoardButton` (`id`, `x`, `y`, `label?`, `iconName?`, PRO color fields, `keys: KeyCode[]`).
- `Board` (`id`, `name`, `gridCols`, `gridRows`, `buttons[]`).

### Test board (`apps/mobile/src/boards.ts`)
- In-memory store, single hardcoded "Photoshop test" board: 4×2 grid with Save / Save As / Undo / Redo / Copy / Paste / New / Pan-on-hold. Real persistence + editing lands in #09.

### `RunScreen.tsx`
- Full-screen layout. Topbar with close button, board name, connection dot (green/red).
- Grid laid out via absolute positioning — measured viewport is divided into `gridCols × gridRows` cells.
- Each `BoardCell`:
  - `Pressable` with `delayLongPress={0}` and `unstable_pressDelay={0}` so React Native's tap heuristic doesn't insert a 130 ms grace period — `onPressIn` and `onPressOut` map cleanly to OS keydown/keyup.
  - On `onPressIn`: `connection.press(buttonId, keys)` over WS, `Haptics.impactAsync(Light)`, switch background to accent color.
  - On `onPressOut`: `connection.release(buttonId, evtId)`, revert background.
  - Defensive cleanup: if the cell unmounts while held, releases anyway so the desktop ref count doesn't leak.
- Disabled state when WS is not online — buttons dimmed, overlay banner shows reason.

### Wiring
- `BoardsScreen.tsx` lists boards and shows a "Run" button per row.
- `App.tsx` introduces a `running: Board | null` modal-style state that shadows the tabbar; close button restores it.

### Dependencies
- `expo-haptics` installed via `npx expo install expo-haptics`.

## Acceptance test (manual, on phone + Windows)

1. Pair phone with PC (#07), confirm `online` badge on Connect tab.
2. Open Photoshop or Notepad on PC.
3. Phone → Boards tab → "Photoshop test" → **Run**.
4. Tap "Save" → PC fires Ctrl+S in active app; the file save / save dialog appears.
5. Hold "Pan (hold)" — Photoshop pan tool stays active until release.
6. Hold "Copy" + "Paste" simultaneously (multi-touch). Release Paste → Copy still active. Release Copy → all keys up. The desktop logs `flushing N held buttons` if connection drops mid-hold.
7. Toggle WiFi off mid-run → buttons dim, banner reads `Offline · pong timeout`. Restore WiFi → banner disappears, buttons re-enable.

## Open follow-ups

- Multi-touch with React Native `Pressable` works for ~2-3 simultaneous touches; if jank shows up at higher counts, swap to `react-native-gesture-handler` `LongPressGestureHandler` per cell.
- Icon rendering on cells lands in #11 (Material Symbols).
- Persistent boards + editor land in #09.
- The "Pan (hold)" label is just a hint — there's nothing special about that button in code, hold-vs-tap is purely user input.
