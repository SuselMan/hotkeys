# 23 — Custom icon upload (PRO)

**What:** today `iconName` on a `BoardButton` resolves to a Material Symbols SVG fetched and cached by `apps/mobile/src/icons.ts`. Users can pick from the bundled set in `IconPickerScreen` but cannot bring their own. Pro should let them attach a custom image (SVG preferred, PNG acceptable) per button — for app logos, custom marks, brand assets that aren't in Material Symbols.

## Scope

1. **Storage model.** Don't bloat the Board JSON with base64 image bytes — that wrecks export/import and AsyncStorage size. Instead:
   - Drop user-uploaded files into `${FileSystem.documentDirectory}user-icons/<contentHash>.svg|png`.
   - Reference them on the button via a new field `customIconUri?: string` (or repurpose `iconName` with a `custom://` prefix; new field is cleaner — keeps Material Symbols path simple).
   - Content-hash the bytes so two buttons with the same uploaded image share one file.
2. **Upload flow.** New "Upload custom" button in `IconPickerScreen` (above the Material Symbols grid, gated behind `useIsPro()`). Uses `expo-image-picker` (already a likely dep — if not, add it) for camera-roll and `expo-document-picker` for SVG. Validate: ≤256 KB, SVG/PNG only. Strip script tags from SVGs before saving (security — SVGs can carry JS).
3. **Render path.** `IconView` (`apps/mobile/src/components/IconView.tsx`) needs a branch: `customIconUri` → `<Image source={{ uri }} />` for PNG or read+inline SVG for vector. Color tint controls in `iconColor` (from task #21) only apply to monochrome SVGs — give custom icons a "respect color overrides" toggle in the editor that defaults to off for PNG.
4. **Backup/import.** `apps/mobile/src/backup.ts` `exportBoards` currently exports JSON. Custom icons need to come along — either zip the user-icons dir into the export, or inline as base64 into the JSON. **Inline base64** is simpler for v1 (no new file format), and the import flow rehydrates them back into the user-icons dir.
5. **Cleanup.** When a button's `customIconUri` changes or button is deleted, run a sweep that removes any user-icons file no longer referenced by any board. Easy to do in `persist()` in `boards.ts`.
6. **Pro gating.** Free users: see the "Upload custom" button in the picker but it's locked with proLock hint. Existing custom icons keep rendering on tier downgrade — do not silently swap to a placeholder.
7. **i18n:** `iconPicker.uploadBtn`, `iconPicker.uploadHint`, `iconPicker.proLockTitle`, `iconPicker.proLockBody`, error strings for size/type rejections (EN + RU).

## Implementation sketch

- `apps/mobile/src/user-icons.ts`: write/read/list/cleanup helpers around `${documentDirectory}user-icons/`.
- `IconPickerScreen` gets a small "Custom" header above the grid showing user's uploaded icons + an "Upload" tile.
- Backup format: bump an internal `formatVersion` field on the export JSON (currently absent — start with `2` if 1 implied) and migrate older JSON to drop unknown fields gracefully.

## Security note

User-supplied SVGs can contain `<script>`, `<foreignObject>`, external `<image href>` references. Strip these on upload. RN doesn't execute SVG scripts in `react-native-svg`'s renderer, but we still don't want them sitting on disk for any future native viewer to interpret.

## Acceptance test

1. Free → IconPicker shows Upload button as locked.
2. Pro → upload a small PNG: appears in a "Your icons" row at the top of the picker, can pick it for a button, renders in editor + run mode.
3. Same flow with an SVG: renders crisp at all sizes.
4. Upload a 1 MB PNG → rejected with a clear message.
5. Upload an SVG containing `<script>` → file saved on disk has the script removed.
6. Delete the only button referencing a custom icon → next save sweeps the file.
7. Export a board with custom icons → import on a clean install → icons come back correctly.
8. Tier downgrade does not break rendering of already-attached custom icons.

## Out of scope

- Vector editing (rotate / crop / recolor) — out.
- A shared community icon library — out.
- Per-team icon packs / sync — out.
