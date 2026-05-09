# 35 — Version bump to 1.0.0

**What:** every package.json, the Expo `app.json`, and the electron-builder config still claim `0.0.1`. The Settings → About row reads its number from `Constants.expoConfig?.version`. Before tagging the release we need a single coordinated bump so the binaries report 1.0.0 everywhere.

## Scope

1. **Files to update:**
   - Root `package.json` → `"version": "1.0.0"`.
   - `apps/mobile/package.json` → `"version": "1.0.0"`.
   - `apps/mobile/app.json` (or `app.config.js`) → `expo.version: "1.0.0"`, `expo.android.versionCode: <next>` (Play requires monotonically increasing integer; if previous AAB uploaded was versionCode 1, set to 2; if nothing uploaded yet, set to 1).
   - `apps/desktop/package.json` → `"version": "1.0.0"`.
   - `apps/landing/package.json` → `"version": "1.0.0"` (cosmetic but consistent).
   - `packages/protocol/package.json` if its version is referenced anywhere (it's an internal workspace dep — bumping is optional).

2. **Verify display.** `SettingsScreen` (`settings.aboutVersion` i18n key) reads `Constants.expoConfig?.version`. Confirm 1.0.0 shows after the bump.

3. **`PROTOCOL_VERSION`** in `packages/protocol` — *do not bump* if no wire-protocol breaking change. App version and protocol version are independent. Last protocol bump was its own task; v1.0 reuses whatever's there.

4. **Single commit.** `chore: bump to 1.0.0` so the diff is reviewable in one place. Tag (#34) goes on the commit after this one (so the tag commit is the version bump itself, not a separate one).

## Out of scope

- Changelog / release notes generation tool — manual changelog for v1.0 lives in the GH Release body (#34).
- Semantic-release / automated version bumping — premature at v1.
