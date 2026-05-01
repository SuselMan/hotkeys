# 12 — JSON export/import + i18n EN+RU

**Goal:** users can back up / move boards across phones; UI strings localized.

## What was delivered

### i18n
- Stack: `i18next` + `react-i18next` + `expo-localization` (config-plugin auto-installed).
- `apps/mobile/src/i18n/{en,ru}.ts` — flat keyed translation tree covering tabs, status badges, every screen (Connect, Boards, BoardEditor, ButtonEditor, ComboBuilder, IconPicker, Scan, Run, Settings) and common buttons.
- `apps/mobile/src/i18n/index.ts`:
  - Initializes synchronously with the device locale (Expo `getLocales` → `en`/`ru`, fallback to `en`), then asynchronously checks AsyncStorage for a user override.
  - `setAppLocale("system" | "en" | "ru")` persists the choice and calls `i18n.changeLanguage(...)` so all `useTranslation()` consumers re-render without restart.
  - `getSavedLocale()` reads the override; missing → `"system"`.
  - Russian plurals use CLDR keys (`_one` / `_few` / `_many` / `_other`); English mirrors all four to satisfy the type guard.
- `apps/mobile/index.ts` imports `./src/i18n` first so the very first paint already sees the right language.
- All visible strings in screens have been wrapped in `t(...)`. The Russian translations are the ones you ship the app with — not auto-translated, written by hand in this PR.

### Export / import (`apps/mobile/src/backup.ts`)
- `exportBoards()` builds an envelope `{ format: "kekkeys-boards-export", version: 1, exportedAt, boards }`, writes a `kekkeys-boards-YYYY-MM-DD.json` to the cache directory, and shells out to the system share sheet via `expo-sharing` (`Sharing.shareAsync` with `application/json` MIME).
- `pickAndImport()` opens `expo-document-picker`, reads the chosen file, and validates via `validateBoardsJson()` — checks the format tag, version (rejects future versions), array shape, and per-board structure (id/name/grid dims/buttons array, each button has id/x/y/keys).
- Pairings are intentionally NOT included — the per-PC `sharedSecret`s aren't useful on a different device anyway.
- `boards.ts` now exports `replaceAllBoards(next)` so import can swap the whole list atomically.

### Settings screen
- Replaced placeholder. Sections:
  - **Language**: System / English / Русский radio rows. Tapping switches live, no restart, with a checkmark on the active row.
  - **Backup**: Export to JSON button (yellow), Import from JSON button (gray). Import shows a confirmation Alert before replacing.
  - **About**: app version (read from `expo-constants`), Material Symbols / Apache 2.0 credit.

### Dependencies added
- `i18next`, `react-i18next`, `expo-localization`, `expo-document-picker`, `expo-sharing`, `expo-constants`.

## Acceptance test (manual)

1. Reload Expo. UI defaults to English (or Russian if your phone's system language is Russian).
2. Settings → Language → Русский. All visible UI flips to Russian instantly. Tabs, headers, buttons, status badge, board list, picker — all translated.
3. Switch back to English; same effect.
4. Settings → Export to JSON. Share sheet opens. Save the file via your phone's Files app or send it via Telegram/etc.
5. Open another phone (or wipe Expo Go data + reload), pair it. Settings → Import from JSON → pick the file → confirm. Boards from the source phone replace whatever was there. Pairings list is untouched.
6. Try importing a malformed file (e.g. plain text) — alert appears with the validation reason instead of a crash.

## Open follow-ups

- Haptics on/off and pressed-highlight on/off toggles are referenced in translations but not yet wired to settings (the values only exist in `AppState.settings` per the project doc; the actual `<Switch>` rows can land with the next pass).
- Translation key typing — today key paths are runtime-verified by i18next's missing-key warning. We could add a generated union via `i18next-typescript` or similar for compile-time safety.
- Adding more languages is one file each — the `Translations` type in `en.ts` is the contract.
- Per-board export (not all-boards) for sharing community templates.
