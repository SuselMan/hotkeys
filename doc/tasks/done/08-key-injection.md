# 08 — Desktop key injection + reference counting

**Goal:** WS `press` events fire keys on Windows; `release` releases; disconnect flushes everything.

## What was delivered

### `apps/desktop/src/main/win32-input.ts`
- Backend: direct Win32 `SendInput` via `koffi` (FFI, no native build step).
- **Why not nut.js**: libnut on Windows sends scan codes which the OS translates through the active keyboard layout — Ctrl+S becomes Ctrl+ы on a Russian layout and the target app never sees the shortcut. Real keyboards work because their `WM_KEYDOWN` carries a layout-independent VK code; this module replicates that by setting `KEYBDINPUT.wVk` directly with `wScan = 0` and no `KEYEVENTF_SCANCODE` flag.
- Defines `INPUT` / `KEYBDINPUT` / `MOUSEINPUT` / `HARDWAREINPUT` structs in koffi, loads `user32.dll`, exposes `sendVkBatch(vks, isUp)` that builds an array of INPUT events and ships them in one syscall.
- Tracks an `EXTENDED_VK` set (right-hand modifiers, navigation cluster, arrows, win keys, print screen, num-lock) so they get the `KEYEVENTF_EXTENDEDKEY` flag.

### `apps/desktop/src/main/injector.ts`
- `initInjector()` runs once at startup; `injectorReady()` reports status; the user sees a clear warning in the console if FFI fails to load.
- `injectorPress(keys)` and `injectorRelease(keys)` — reference-counted per W3C `code`. A keydown/keyup hits the OS only on 0↔1 transitions, so two phone buttons that share `Ctrl` keep `Ctrl` down until both release.
- `flushAll()` — releases everything in the ref-count map; called on `before-quit`.
- `mapToVk(code)` — switch over W3C UI Events `code` strings → Win32 VK code (`0xA2` for `ControlLeft`, `0x53` for `KeyS`, etc.):
  - All 8 modifiers (Ctrl/Shift/Alt/Meta L/R, with `LeftSuper`/`LeftWin` fallback for Meta).
  - All 26 letters, all 10 digits, F1–F24.
  - Whitespace + editing: Space, Enter, Tab, Escape, Backspace, Delete, CapsLock.
  - Navigation: 4 arrows, Home, End, PageUp, PageDown, Insert.
  - Punctuation: Backquote, Minus, Equal, Brackets, Backslash, Semicolon, Quote, Comma, Period, Slash.
  - Numpad 0–9, NumLock, math operators, NumpadEnter, NumpadEqual, NumpadDecimal.
  - Misc: PrintScreen, ScrollLock, Pause, ContextMenu.
  - Media: AudioVolumeMute/Down/Up, MediaPlayPause/Stop/Prev/Next.
- Unmapped codes get `console.warn` once and are skipped — adding more is one-line.

### `apps/desktop/src/main/server.ts`
- `AuthedClient.heldButtons` is now `Map<buttonId, KeyCode[]>` instead of `Set<buttonId>`.
- `ServerEvents.onPress` / `onRelease` now carry `(keys, buttonId, clientId)` — release reads from the held map, so callers don't need their own bookkeeping.
- On WS close: synthesises a `release` for each still-held button before firing `onClientDisconnected`. The injector pops its ref counts cleanly, no stuck modifiers.

### `apps/desktop/src/main/index.ts`
- Calls `initInjector()` after the tray comes up.
- Wires `injectorPress` / `injectorRelease` into the server callbacks.
- `before-quit` is now async — preventDefault, stop mDNS+WS, `await flushAll()`, then `app.exit(0)`. This guarantees a clean keyboard state on quit.

## Acceptance test (manual, on Windows)

Once mobile run mode (task #10) is in place:
- Tap a button mapped to `Ctrl+Shift+S` → in Photoshop the "Save As" dialog opens.
- Hold `Space` → Photoshop pan tool stays active until release.
- Hold two buttons that both contain `Ctrl` → release one, the other still holds Ctrl + its main key.
- Force-kill the phone app while a button is held → desktop terminal logs `flushing N held buttons`, no stuck Ctrl/Shift in OS.

## Notes / follow-ups

- Win key shortcuts intercepted by the OS (Win+D, Win+L) still go to the OS — we send the key, but the shell handles it before any app sees it. Document in user-facing FAQ.
- Punctuation OEM keys (`Comma`, `Period`, `Semicolon`…) carry the same VK across most layouts but their _printed_ glyph differs. For shortcut purposes that's fine; for typing-style actions (when we add a "type text" action later) we'd need layout-aware paths.
- `injectorReady()` could be surfaced in the renderer as a banner ("key injection unavailable — re-install kekkeys"). Not blocking for MVP.
- nut.js was tried first and dropped after the Russian-layout bug — the swap to direct `SendInput` is documented in `win32-input.ts`.
