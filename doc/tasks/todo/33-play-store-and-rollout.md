# 33 — Google Play store listing + production rollout

**What:** publish the kekkeys mobile app on Google Play. The user already has a verified developer account, so the 14-day closed-testing rule (which only applies to accounts created after Nov 2023) does **not** apply — internal testing is still recommended for a smoke test, but production can be reached in one promotion.

## Scope

1. **Create app in Play Console.**
   - App name: `kekkeys`.
   - Default language: English (US); add localised listings for ru, es, de, ja matching the mobile i18n bundles (#31).
   - Category: Productivity (alt: Tools).
   - Tags: keyboard, productivity, remote control.

2. **Listing copy** (per locale):
   - Short description: 80 chars. Hook + USP — "Phone-controlled hotkey deck for your PC. Touch Portal alternative."
   - Full description: 4000 chars. Feature list, supported apps (Photoshop, Animate, Blender, Resolve, OBS, …), no-cloud privacy line, pricing.
   - What's new: stays empty for v1.0.0.

3. **Visuals** (delivered by #26 + #30):
   - Hi-res icon 512×512.
   - Feature graphic 1024×500.
   - 2–8 phone screenshots, 1080×2340 portrait.
   - Promo video URL pointing to YouTube unlisted upload of the #27 promo.

4. **Privacy + data safety.**
   - Privacy policy URL → `https://kekkeys.online/en/privacy/`.
   - Data safety form: we collect nothing. Tick "No data collected", "No data shared", confirm encryption-in-transit (LAN only — explain in optional notes).

5. **Content rating questionnaire.** Productivity app, no ads, no UGC, no sensitive content → "Everyone" / PEGI 3.

6. **Subscription / managed product** wired up in #32 — make sure the SKU shows "Active" before we go live.

7. **Build + upload.**
   - `apps/mobile` → `eas build --platform android --profile production` (or `expo build` equivalent) → AAB.
   - Sign with the upload key. Confirm `versionCode` increments cleanly (we're at 1, going to 2 if a previous APK was uploaded; otherwise 1).
   - Upload AAB to **Internal testing** track first.

8. **Internal smoke test.**
   - 1–3 invited testers (or just the user's own account).
   - Verify pairing, run mode, multi-touch, sticky, IAP sandbox purchase + restore, deep-link from landing if added.
   - Estimated time: half a day if nothing breaks, 1–2 days if IAP needs debugging.

9. **Promote to Production.**
   - Promote the same AAB from internal → production.
   - Roll out to 100% of users (no staged rollout for v1.0; small audience anyway).
   - First publish triggers app review. Old verified accounts usually clear in <24h, occasional 2–3 day waits.

## Out of scope

- App Store / iOS — v1.0 Android only.
- RuStore secondary listing — punted to v1.1.
- Pre-registration campaign — go live, then announce.
- Localised feature graphic per locale — one en version covers all locales for v1.

## Critical-path risk

App review on first publish is the single longest unpredictable item. Submit to internal as soon as the build is signed; promote to production the same day if smoke test passes.
