# 27 — Promo video voiceover script

**Goal:** ship the en voiceover text the v1.0 promo video will be cut against. The user is recording screen capture themselves and using AI voice clone, not human voice — so the deliverable is *only* the script with timecodes.

## What was delivered

### `doc/marketing/promo-script.en.md`

- Five beats with explicit timecodes that the screen capture and the TTS pipeline both consume:
  - **00:00–00:05 Hook** — "Stream Deck without the deck. Touch Portal without the subscription. Just your phone."
  - **00:05–00:15 Pair** — QR scan, local WiFi, no account.
  - **00:15–00:35 Build** — drag buttons, icons, combos, Sticky toggle, multi-board.
  - **00:35–01:00 Run** — tap-or-hold, two-finger chords, real keystrokes.
  - **01:00–01:10 CTA** — Free for one board, $9.99 lifetime PRO, kekkeys.online.
- Total ~165 words → ~70s at 150 wpm. Comfortably inside the 60–90s target.
- **Voicing notes** for the TTS pipeline:
  - "nine ninety-nine" instead of "$9.99" — neural voices read "$" inconsistently.
  - "kekkeys dot online" instead of "kekkeys.online" — same reason.
  - phonetic hint for the brand name (kek-keez) so single-pass TTS doesn't split it.
- **Beat-to-screen mapping table** so the recorder knows what UI to be on at each timecode.
- **Localisation roadmap**: ru / es / de / ja audio tracks deferred to v1.1, dropped over the same v1.0 visuals.

### Pricing alignment

The CTA line carries `$9.99 lifetime`, matching the IAP decision (#32 / `pro_lifetime`). The earlier `$4.99/month` line in the en + ru i18n bundles was rewritten in the same release-prep commit so dogfood builds show the right copy until Play Billing returns the live regional price at runtime.

## Out of scope (post-v1.0)

- Localised audio tracks (ru / es / de / ja). Will reuse the same v1.0 video frames and just swap the audio layer.
- Subtitle SRT files for accessibility.
- Storyboarding, editing, sound design — owned by the user's recording pass.
