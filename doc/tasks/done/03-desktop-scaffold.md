# 03 — Desktop scaffold (Electron + tray)

**Goal:** runnable Electron app with tray icon, hidden-by-default window, dark UI placeholder.

## What was delivered

`apps/desktop`:
- Electron 33 + ESM. Main process compiled with `tsc -p tsconfig.main.json`. Renderer is plain HTML/CSS/JS copied via `scripts/copy-renderer.mjs`.
- `src/main/index.ts` — single-instance lock, `dock.hide` on macOS, tray + window on `whenReady`.
- `src/main/tray.ts` — tray menu: Open / Auto-start with Windows (checkbox) / Quit. Click on tray opens window.
- `src/main/window.ts` — 480×640 dark window, hides on close instead of quitting (true tray-only behavior). `isQuittingFlag` guards real exit on Quit menu.
- `src/main/icon.ts` — 32×32 tray icon generated as BGRA bitmap at runtime (no PNG needed in repo).
- `src/renderer/index.html` + `styles.css` — placeholders for status, QR, paired list, troubleshooting block.

## Run

```
npm run dev:desktop
```
