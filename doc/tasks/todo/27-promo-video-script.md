# 27 — Promo video voiceover script

**What:** the landing hero needs a short demo video. The user will record screen capture (desktop) + phone-on-tripod themselves; this task delivers only the **voiceover script** so the recording session has clear beats, and so we can localise the audio.

## Scope

1. **Length:** 60–90 seconds. Reading aloud at natural cadence ≈ 150 words/minute → target **130–200 words per language**.

2. **Story beats** (each with one short voiceover line):
   - **Hook (5s):** problem framing — "Touch Portal-style hotkey deck without the hardware".
   - **Pair (10s):** scan QR → paired.
   - **Build (20s):** drag a button onto the grid, pick an icon, set a combo, toggle Sticky.
   - **Run (25s):** open Run mode, hold a key, multi-touch two keys, sticky-tap a modifier + tap another button → real keystrokes land in Photoshop / Animate / Blender.
   - **CTA (10s):** "Free for one board, PRO for unlimited. Windows + Android. kekkeys.online."

3. **Single language for v1.0: English only.** AI voice clone over the en script (user records the screen capture; voice generated, not human-recorded). Translations into ru / es / de / ja roll out in v1.1 as separate audio tracks dropped over the same video, once mobile localisations land (#31).

4. **Format:** plain-text in `doc/marketing/promo-script.en.md` with timecodes per beat, so the recorder + the voice-clone tool both see `[00:00–00:05] line` cues. AI voice tools (ElevenLabs / Play.ht) ingest plain text fine — keep punctuation natural for prosody.

5. **Tone:** confident, dry, technical. Avoid "revolutionize", "simply", "delight". This is an indie tool for makers, not enterprise SaaS.

## Out of scope

- Storyboard / shot list (user owns the camera).
- Editing, background music, sound design.
- Localised audio for v1.0 — English only at launch. Localised tracks for ru / es / de / ja deferred to v1.1.
