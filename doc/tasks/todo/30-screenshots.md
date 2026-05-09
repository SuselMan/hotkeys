# 30 — Screenshots for Play Store + landing

**What:** Play Store requires 2–8 phone screenshots and rejects listings without them. The landing also benefits from a hero composite showing the phone + desktop together. This task captures, frames, and exports the assets.

## Scope

1. **Phone screenshots (1080×2340 portrait, 9:19.5):**
   - Connect screen with a paired PC online.
   - Boards list with a couple of boards.
   - Board editor showing the grid + drag affordance.
   - Button editor: combo set to `Shift + F5`, **Sticky toggle ON** so the new feature is showcased.
   - Run mode mid-press (yellow highlight on a held button).
   - Icon picker showing both Material Symbols and a couple of user-uploaded icons (PRO).
   - Upgrade screen (the funnel target).

2. **Localised text.** Capture screenshots from a build with the en locale. If time permits, capture a parallel ru set — Play Store lets you upload localised screenshots per locale, which boosts conversion in non-English markets.

3. **Feature graphic 1024×500.** Required by Play. Composite: phone on the left running a board, desktop screen on the right with the active app receiving keystrokes (Photoshop / Animate is fine), product wordmark anchored in one corner.

4. **Landing hero composite.** Ideally an animated GIF/MP4 looping a press → desktop response, but a static composite of phone + desktop side-by-side is acceptable for v1.

5. **Naming + storage.** Dump originals in `doc/marketing/screenshots/`. Don't commit binaries past ~200 KB each unless necessary; keep masters in cloud storage and only the production-sized variants in repo.

## Out of scope

- Tablet (10" / 7") screenshots — Play allows but doesn't require; we can add post-launch.
- Localised feature graphic in multiple languages — one en version is enough for v1.
- Wallpaper / banner art for social media announcements — separate marketing track.
