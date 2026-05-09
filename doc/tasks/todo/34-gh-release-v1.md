# 34 — GitHub Release v1.0.0 (Windows installer + Android APK)

**What:** the landing page links to `releases/latest/download/...` URLs (#28) but no release exists yet. This task tags `v1.0.0`, builds both binaries, and uploads them as release assets so the landing CTAs work the moment we deploy.

## Scope

1. **Tag.** `git tag -a v1.0.0 -m "kekkeys v1.0.0"` on master, push tag.

2. **Windows installer:**
   - Build via `electron-builder` from `apps/desktop`.
   - Artifact: NSIS installer (already the default for Windows electron-builder). Lock the output filename via `productName` + `artifactName` in builder config — landing CTA is hardcoded to that name. Suggest `kekkeys-setup-${version}-x64.exe`.
   - **Unsigned for v1.0.** Landing copy already explains the SmartScreen "More info → Run anyway" path. Code-signing parked for a post-launch task once download volume justifies an EV/OV cert.
   - SHA256 checksum published next to the binary so users can verify.

3. **Android APK:**
   - From `apps/mobile`: `eas build --platform android --profile preview` (APK output) — this is the public-direct-download artifact, separate from the AAB submitted to Play (#33).
   - Signed with the same upload key used for the Play AAB so future updates installed from APK still receive Play updates if the user later switches.
   - Filename `kekkeys-${version}.apk`.

4. **GH Release page.**
   - Title: `v1.0.0 — Initial release`.
   - Body: short changelog (this is v1.0 so it's a feature inventory, not a delta), supported OS list, install instructions one-liner, link back to the landing.
   - Mark as latest. Pre-release flag off.

5. **`releases/latest/download/<filename>` URLs verified to work** before the landing announcement. GitHub serves these as 302 redirects to the latest tagged release's matching asset.

## Out of scope

- Auto-updater for the desktop app — v1.0 ships without; users redownload to upgrade. Add electron-updater + GitHub provider in v1.1.
- macOS / Linux desktop builds.
- Continuous release pipeline — for v1.0 a manual build is fine; wire CI release-on-tag in v1.1.

## Critical-path note

Build artifacts must exist **before** announcing the landing publicly, otherwise CTAs return 404. Order: build → upload → verify URLs → flip landing live.
