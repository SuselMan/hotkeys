# 31 — Expand i18n to 5 languages (mobile)

**What:** the mobile app currently localises into en + ru (`apps/mobile/src/i18n/en.ts`, `ru.ts`). Adding three more locales — proposed **es, de, ja** — multiplies Play Store visibility (the algorithm boosts apps localised in the user's locale) and unlocks creative-tool markets where the audience for a Touch Portal alternative is densest. This task adds the language bundles, wires them into the i18n loader, and exposes them in the language picker.

## Scope

1. **New bundles** mirroring the shape of `en.ts`:
   - `apps/mobile/src/i18n/es.ts` (Spanish)
   - `apps/mobile/src/i18n/de.ts` (German)
   - `apps/mobile/src/i18n/ja.ts` (Japanese)
   - Each exported as `Translations` (the type from en.ts) so the type system catches missing keys.

2. **Translation method.** Machine-translate each string from en, then proof for:
   - **Pluralization keys** — `boards.buttonsCount_one/few/many/other` exist for ru. Other locales: ja has none (single form), es has `_one` + `_other`, de has `_one` + `_other`. Drop the unused suffixes per locale to avoid i18next falling back to the wrong form.
   - **App-specific terms** that shouldn't translate: "kekkeys", "QR", "DPAPI", "WiFi", "F-keys" (keep latin in non-Latin locales).
   - **Punctuation conventions** — ja uses 「」 for quotes, full-width punctuation; es uses inverted ¿?¡!; de keeps en quotes fine.

3. **Loader wiring** in `apps/mobile/src/i18n/index.ts` — register the three new bundles, fall back to en on any missing key. `expo-localization` already detects device locale; just add the new locale codes to the supported list.

4. **Language picker** in `SettingsScreen` — add the three new entries (`languageEs`, `languageDe`, `languageJa`) and the corresponding strings in every bundle.

5. **Acceptance:** with device locale set to one of the new languages, every screen renders without falling back to English, no untranslated key warnings in the console, the language picker shows the new option natively spelled (Español, Deutsch, 日本語) and switches live.

## Out of scope

- Translating the landing page into the new locales — separate task; landing has its own bundle in `apps/landing/app/_lib/content.ts`. Doing it for v1 is nice-to-have but not blocking.
- Right-to-left (Arabic, Hebrew) — the mobile UI hasn't been audited for RTL flip; defer.
- Crowdsourced translation tooling (Crowdin, Lokalise) — overkill at 5 locales; revisit at 10+.

## Open questions

- Final pick of three new locales. Default proposal **es / de / ja**. Alternatives discussed: pt-BR (Brazil), zh-CN (China — Play Store relevance is low there), ko (Korea — strong digital-art market).
