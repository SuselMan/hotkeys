# 35 — Version bump to 1.0.0

**Goal:** flip every version number in the monorepo to `1.0.0` in a single coordinated change so the v1.0 binaries report the same version string everywhere — package metadata, Expo runtime, Settings → About row.

## What was delivered

### `package.json` files

- Root `package.json` → `1.0.0`.
- `apps/mobile/package.json` → `1.0.0`.
- `apps/desktop/package.json` → `1.0.0`. electron-builder reads this; the produced installer's exe-properties version follows.
- `apps/landing/package.json` → `1.0.0`. Cosmetic but consistent across the workspace.
- `packages/protocol/package.json` left untouched — workspace-internal dep, not user-visible.

### `apps/mobile/app.json`

- `expo.version` → `1.0.0`. Drives the in-app About row via `Constants.expoConfig?.version`.
- `expo.android.versionCode: 1` added. Required by Play; was implicit before so Expo defaulted, but pinning it now means future bumps are explicit (versionCode 2, 3, …) and reviewable in diffs.

### Adjacent wins folded in

While the Expo block was open the icon background and splash background shifted from `#1a1a1a` to `#000000` to match the brand mark's pure black. Adaptive-icon foreground now references the real 1024 master that #4 dropped under `assets/`.

## Notes

- **`PROTOCOL_VERSION`** in `packages/protocol` was deliberately *not* bumped. App version and wire version are independent — v1 reuses the existing protocol; only a breaking change to the JSON message shape should trigger that constant.
- The git tag `v1.0.0` is **not** part of this task — it lives in #34 (GH Releases), so the tag commit is the bump itself rather than a follow-up.
- The Settings About line reads `t("settings.aboutVersion", { version })` where `version` is `Constants.expoConfig?.version` — the bump propagates without further wiring.

## Out of scope

- Auto-bump tooling (semantic-release, changesets) — premature at v1.
- Changelog generation — for v1.0 the GH Release body (#34) is the changelog.
