# 26 — Icon integration (mobile + desktop + landing)

**What:** every icon in the project today is a placeholder. Mobile uses the default Expo grid-circles (`apps/mobile/assets/icon.png`); desktop tray is procedurally generated yellow-on-grey (`apps/desktop/src/main/icon.ts` — its own comment says "Replace with a designed icon later"); landing has no favicon or OG image. The user is preparing the brand artwork separately. This task wires the delivered files into all three surfaces so the v1.0 build ships with consistent branding.

## Scope

1. **Mobile (Expo):**
   - Replace `apps/mobile/assets/icon.png` (1024×1024 master).
   - Replace `apps/mobile/assets/adaptive-icon.png` (1024×1024 foreground; background colour goes in `app.json`).
   - Replace `apps/mobile/assets/splash-icon.png` (transparent PNG, ~1024×1024).
   - Replace `apps/mobile/assets/favicon.png` (web build).
   - Verify `app.json` references and adaptive background colour match the brand.

2. **Google Play hi-res icon:** 512×512 PNG kept separately (Play Console uploads it directly — no need to bundle in the app).

3. **Desktop (Electron):**
   - Drop the procedural `makeTrayIcon` in `apps/desktop/src/main/icon.ts`. Use a real PNG/ICO loaded via `nativeImage.createFromPath` (or `nativeImage.createFromBuffer` from a `require` of the bundled file).
   - Multi-resolution Windows `.ico` for the exe (16/32/48/256). Wire it into `electron-builder` config (`build.win.icon` → path to .ico).
   - Tray icon: a separate 32×32 PNG works better than the .ico for tray rendering on Windows; load that one for the tray and keep the .ico just for the exe shell.

4. **Landing:**
   - `apps/landing/public/favicon.ico` (32-multilayer) + `apple-touch-icon.png` (180×180) + `icon.png` (512×512 for `<link rel="icon" sizes="512x512">`).
   - `apps/landing/public/og.png` — 1200×630 social card (brand mark + product tagline). Reference it from `apps/landing/app/layout.tsx` `metadata.openGraph.images` and `metadata.twitter.images`.

## Out of scope

- Designing the icons (user is producing them).
- macOS / iOS icon variants — v1.0 is Windows + Android only.
- Animated splash / Lottie launch screen.
