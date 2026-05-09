# 31 — Expand mobile i18n to 5 languages

**Goal:** multiply Play Store discoverability by localising the mobile app into Spanish, German, and Japanese on top of the existing English + Russian bundles, before the v1.0 store listing goes live.

## What was delivered

### Three new bundles

`apps/mobile/src/i18n/es.ts`, `de.ts`, `ja.ts` — each implements the full `Translations` shape derived from `en.ts`. Every key the app reads has a target-language string; missing keys would fall back to en, but none do.

Translation conventions per locale:
- **es:** informal `tú`. `¿?¡!` punctuation kept where it'd appear in print; UI strings are short enough that "?" usually sits alone. `«»` for quotes. App-specific terms (kekkeys, QR, JSON, PNG, SVG, Material Symbols) stay latin.
- **de:** informal `Du` / `dein` — matches indie-tooling tone. `„"` German quotes. F-keys → "F-Tasten" (R-Ctrl → R-Strg, R-Shift → R-Umschalt). Nouns capitalised per German orthography.
- **ja:** polite です/ます. 「」 corner brackets for quoted board names. Hyphenated technical terms kept (Sticky / ラッチ; Material Symbols un-translated; F-keys → Fキー). Numbers use ASCII digits since the app contexts are all small counts/prices.

### Pluralisation

en already declared `_one / _few / _many / _other` (a forward-compatible quad). The `Translations` type therefore demands all four slots in every bundle:
- **es / de:** `_one` distinct, the other three duplicate `_other`.
- **ja:** all four identical (Japanese has no grammatical plural for these contexts).
- **ru:** unchanged — the existing four-form set is correct for Slavic plurals.

`compatibilityJSON: "v4"` in the loader keeps i18next's plural-rule lookup matching what these resource keys expect; no behaviour change.

### Loader — `apps/mobile/src/i18n/index.ts`

- `AppLocale` union widened from `"en" | "ru"` to `"en" | "ru" | "es" | "de" | "ja"`.
- Single source of truth `SUPPORTED: ReadonlyArray<AppLocale>` driving the `isSupported(value)` type guard.
- `deviceLocale()` returns the device's language code if it's in `SUPPORTED`, else `"en"`. Replaces the previous hard-coded `sys === "ru" ? "ru" : "en"` ladder.
- Saved-locale validation (`AsyncStorage[STORAGE_KEY]`) goes through the same guard — no `if (saved === "en" || saved === "ru")` drift to keep updating.
- Resource map registers all five bundles.

### Settings UI — `apps/mobile/src/screens/SettingsScreen.tsx`

Language section now lists six rows: System + the five localised labels, each native-spelled (`English`, `Русский`, `Español`, `Deutsch`, `日本語`). Selection persists via the existing `setAppLocale` flow.

### Pricing copy alignment

`upgrade.priceLine` standardised across all five bundles to reflect the IAP decision (`$9.99 — lifetime` and locale-equivalents). Was `$4.99 / month` in en + ru. Replaced inline so dogfood builds show the right number until #32 wires the live Play-returned price.

## Verified

- `tsc --noEmit` on `apps/mobile` is clean — the `Translations` type catches any missing key in any of the three new bundles.
- All five locale rows render in the Settings language picker.

## Deferred

- **Landing localisation** into es / de / ja. The landing has its own bundle in `apps/landing/app/_lib/content.ts` and currently ships en + ru only. Nice-to-have, not blocking v1.0.
- **Promo video tracks** in es / de / ja — see #27, deferred to v1.1.
- **RTL languages (Arabic, Hebrew):** RN UI hasn't been audited for layout flips. Not in v1.0 scope.
- **Crowdsourced translation tooling (Crowdin / Lokalise):** overkill at five locales. Revisit if the bundle count crosses ~10.
