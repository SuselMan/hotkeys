# 26 — Icon integration (mobile + desktop + landing)

**Goal:** replace every placeholder icon across the project with the real brand artwork — mobile launcher, Play Store assets, Windows exe + tray, landing favicon set + social card — so the v1.0 binaries and pages all carry consistent branding.

## What was delivered

### Mobile (Expo) — `apps/mobile/assets/`

- `icon.png`, `adaptive-icon.png`, `splash-icon.png` replaced from the 1024×1024 brand master that lives at `apps/mobile/assets/icons/1024x1024.png`. The master has the logo in the central ~60% of the canvas with a black surround, which doubles as the adaptive-icon foreground safe zone — no part of the K or the column of squares gets clipped by Android's circular / squircle / teardrop launcher masks.
- `app.json`:
  - `expo.android.adaptiveIcon.backgroundColor: "#000000"` — matches the master's surround so the mask seam is invisible.
  - `expo.splash.backgroundColor: "#000000"` — same reason; the splash icon's black square now blends into the screen colour around it.
- `apps/mobile/assets/favicon.png` (Expo **web** build only) intentionally left as the original placeholder. Web is not a v1.0 target.

### Play Store assets — `apps/mobile/assets/icons/`

User-delivered, no code wiring needed beyond the upload step in #33:
- `playstore.png` — 512×512 hi-res app icon. Required field on the Play Console listing.
- `1024x500.png` — feature graphic. Composition: brand mark + tagline ("HOTKEYS. GESTURES. POWER.") on the left, real template-picker phone screenshot on the right showing supported apps (Animate, After Effects, Blender, Resolve, Figma, OBS, Photoshop, Premiere), feature row at the bottom (Custom Hotkeys / Multi-Touch Gestures / Advanced Control / Profiles per App / Powerful Automation). Compliant with Play guidelines — no CTAs, no ratings, no price overlays.
- Android density mipmaps (`mipmap-{m,h,xh,xxh,xxxh}dpi/ic_launcher.png`) shipped as legacy launcher fallbacks for pre-adaptive Android builds.

### Landing — `apps/landing/public/` + `app/layout.tsx`

User-delivered comprehensive favicon bundle (realfavicongenerator output): `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`, `site.webmanifest`, plus `1200x630.png` for social cards.

Wiring:
- `apps/landing/app/layout.tsx` — `metadata.icons` declares all five `<link rel="icon">` variants, the `<link rel="apple-touch-icon">`, and `metadata.manifest: "/site.webmanifest"`. Confirmed in the rendered `<head>` of the static export.
- `metadata.openGraph.images` and `metadata.twitter.images` reference `/1200x630.png` with the correct `width: 1200, height: 630` so social previews on Twitter / Discord / Slack / Telegram pull the brand card.
- `apps/landing/public/site.webmanifest` rewritten from the empty-string realfavicongenerator default to real brand metadata: `name: "kekkeys"`, `theme_color: "#000000"`, `background_color: "#000000"`, etc. Without this PWA-installs-from-browser would show empty strings on the home screen.

### Desktop (Electron) — `apps/desktop/`

User-delivered icon bundle at `apps/desktop/icons/` (favicon.ico multi-layer, favicon-96x96.png, plus a few others from the realfavicongenerator output that aren't load-bearing).

Wiring:
- `apps/desktop/package.json`:
  - `build.win.icon: "icons/favicon.ico"` — electron-builder uses this for the installer wizard graphic, the .exe shell-properties icon, the Start Menu shortcut, and the desktop shortcut.
  - `build.files` extended with `"icons/**"` so the directory is bundled into the asar (without this, the tray icon would 404 in packaged builds).
- `apps/desktop/src/main/icon.ts`:
  - Procedural `makeTrayIcon` (yellow square with grey border) replaced with `nativeImage.createFromPath(path.join(app.getAppPath(), "icons", "favicon-96x96.png"))`.
  - `app.getAppPath()` resolves to the project root in dev and to the asar root in packaged builds, so the same lookup works in both. 96×96 downsamples cleanly to the 32×32 (100% DPI) and 64×64 (200% DPI) tray slots Windows asks for.
  - The function signature is unchanged (`(): NativeImage`) so `tray.ts:10` keeps calling `new Tray(makeTrayIcon())` without edits.

## Verified

- `tsc -p tsconfig.main.json` on `apps/desktop` clean.
- `next build` on `apps/landing` clean — 12 static pages exported, head spot-check confirms all icon `<link>` tags and the manifest reference.
- `git status` clean before commit. Build artifacts (`out/`, `.next/`, `dist/`) gitignored.

## Out of scope / deferred

- **Expo web favicon** (`apps/mobile/assets/favicon.png`) — left as the Expo placeholder. Web build is not part of v1.0.
- **iOS app icons** (`apps/mobile/assets/icons/Assets.xcassets/AppIcon.appiconset/`) — user-delivered but unused; iOS isn't shipping in v1.0.
- **macOS / Linux desktop icons** — Windows-only build for v1.0. `.icns` and `icons/` Linux PNG sets can land in v1.1 if other OS targets are added.
