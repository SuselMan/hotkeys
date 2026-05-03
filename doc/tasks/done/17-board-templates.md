# 17 — Preset board templates for popular creative software

**Goal:** ship a curated set of board templates (Photoshop, Figma, Blender, OBS, DaVinci Resolve, Premiere Pro, VS Code, Adobe Animate, ToonBoom Harmony, After Effects) so first-launch users have something to use immediately. Move from "open the app and stare at an empty board" to "pick the app you use, done."

## Why

Highest-impact retention fix from `doc/marketing.md` §2.4 — moved from v1.2 roadmap to v1.0. Currently a fresh install seeds one Adobe Animate sample board (`apps/mobile/src/boards.ts`); after that, users have to author every shortcut manually. Two-thirds of new users churn in the first 30 seconds for that reason.

## Data model

Templates are static, bundled in the APK as TS modules — not editable, not synced.

```
apps/mobile/src/templates/
  index.ts                  // exports TEMPLATES: TemplateMeta[]
  photoshop.ts              // exports default: BoardTemplate
  figma.ts
  blender.ts
  obs.ts
  davinci-resolve.ts
  premiere-pro.ts
  vs-code.ts
  adobe-animate.ts
  toonboom-harmony.ts
  after-effects.ts
```

Each template module:

```ts
export interface BoardTemplate {
  id: string;             // stable, e.g. "tpl-photoshop"
  name: string;           // display name shown in picker
  iconName: string;       // Material Symbols icon for the picker card
  gridCols: number;
  gridRows: number;
  buttons: Array<Omit<BoardButton, "id">>; // ids generated at instantiation time
}
```

Picker reads `index.ts`'s TEMPLATES list (TemplateMeta = `{ id, name, iconName, buttonCount, gridCols, gridRows }`); the heavy `buttons` array loads only when the user picks one.

## UX

### Entry point — `BoardsScreen`

Replace the inline-name "+ New board" form with a two-step flow:

1. Tap **+ New board** → a modal appears with two top-level options:
   - **Start from template** (primary, accent-colored).
   - **Empty board** (secondary).
2. **Start from template** → full-screen template picker (a `<FlatList>` of cards: 2 columns, each card = template icon + name + "12 buttons · 4×4 grid").
3. Tap a card → confirmation row appears at the bottom: "Create '<Name>' board?" → Cancel / Create.
4. **Empty board** → existing inline-name input flow (keep for power users who want a clean slate).

### Instantiating a template
- Generate fresh button IDs for every button (so multiple instantiations of the same template don't collide).
- Default board name = template name.
- Add the new board, set it active, return to the boards list.

### First-launch behavior
- Replace the current "seed Adobe Animate sample on empty AsyncStorage" path with **no seeded board**. Instead show an empty-state on `BoardsScreen` with a primary CTA "Browse templates" → opens the picker.
- This makes the empty-state functional rather than confusing, and avoids users wondering why they have a random "Adobe Animate" board.

## Templates — content

Goal per template: 8–14 most-used shortcuts. Pick them by reading the official keyboard-shortcuts page for each app and short-listing what professionals actually press dozens of times per session. **Labels stay in English** for v1 — most creative pros use EN UI even on localized OS, and translating per locale doubles the editorial work. Add localization via i18n in a follow-up.

Below — the seed list per template. The author of this task will refine while implementing; treat these as starting points, not final.

### Photoshop (4×4)
Save (Ctrl+S) · Save As (Ctrl+Shift+S) · Undo (Ctrl+Z) · Redo (Ctrl+Shift+Z) · Brush size − (`[`) · Brush size + (`]`) · Hardness − (Shift+`[`) · Hardness + (Shift+`]`) · Brush (B) · Eraser (E) · Eyedropper (I) · Move (V) · Hand pan (Space hold) · Fit screen (Ctrl+0) · Deselect (Ctrl+D)

### Figma (4×3)
Move (V) · Frame (F) · Rectangle (R) · Ellipse (O) · Pen (P) · Text (T) · Hand (H) · Group (Ctrl+G) · Ungroup (Ctrl+Shift+G) · Auto layout (Shift+A) · Component (Ctrl+Alt+K) · Mask (Ctrl+Alt+M)

### Blender (4×4)
Move (G) · Rotate (R) · Scale (S) · Toggle Edit/Object (Tab) · Front view (Numpad 1) · Right view (Numpad 3) · Top view (Numpad 7) · Camera view (Numpad 0) · Toggle perspective (Numpad 5) · Frame selected (Numpad .) · Loop cut (Ctrl+R) · Bevel (Ctrl+B) · Extrude (E) · Inset (I) · Render (F12) · Save (Ctrl+S)

### OBS (3×3)
OBS hotkeys aren't bound by default — the user binds them in **Settings → Hotkeys**. Template uses **F13–F20** and a few Ctrl+Shift combos that almost never conflict. The picker card description explicitly mentions: "After creating: open OBS → Settings → Hotkeys → bind these keys to Start/Stop streaming, scene switching, and mute toggles."

Buttons: Start streaming (F13) · Stop streaming (F14) · Start recording (F15) · Stop recording (F16) · Scene 1 (F17) · Scene 2 (F18) · Scene 3 (F19) · Mute mic (F20) · Mute desktop (Ctrl+Shift+F12)

### DaVinci Resolve (4×3)
Mark in (I) · Mark out (O) · Play/pause (Space) · J · K · L · Previous frame (Left) · Next frame (Right) · Cut/blade (Ctrl+B) · Selection (A) · Trim (T) · Save (Ctrl+S)

### Premiere Pro (4×3)
Mark in (I) · Mark out (O) · Play/pause (Space) · J · K · L · Razor (C) · Selection (V) · Track select fwd (A) · Save (Ctrl+S) · Export (Ctrl+M) · Slip (Y)

### VS Code (4×3)
Skip chords (Ctrl+K, S etc) — protocol doesn't support them. Single-combo shortcuts:
Save (Ctrl+S) · Quick open (Ctrl+P) · Command palette (Ctrl+Shift+P) · Find (Ctrl+F) · Replace (Ctrl+H) · Toggle terminal (Ctrl+`) · Toggle sidebar (Ctrl+B) · Comment line (Ctrl+/) · Format doc (Shift+Alt+F) · Go to definition (F12) · Multi-cursor down (Ctrl+Alt+Down) · Multi-cursor up (Ctrl+Alt+Up)

### Adobe Animate (4×4)
Selection (V) · Subselection (A) · Free transform (Q) · Brush (B) · Pencil (Y) · Eraser (E) · Lasso (L) · Hand (H) · Convert to Symbol (F8) · Insert Frame (F5) · Insert Keyframe (F6) · Insert Blank Keyframe (F7) · Test movie (Ctrl+Enter) · Save (Ctrl+S) · Undo (Ctrl+Z) · Redo (Ctrl+Shift+Z)

(Replaces the current hardcoded sample seed in `boards.ts`.)

### ToonBoom Harmony (4×4)
Harmony's defaults are heavily customized in studios. Use the out-of-the-box single-key shortcuts and call out in the picker description: "If your studio uses a custom keymap, edit the buttons after creating."
Selection (Alt+S) · Brush (Alt+B) · Eraser (Alt+E) · Pencil (Alt+/) · Cutter (Alt+T) · Paint (Alt+I) · Eyedropper (Alt+D) · Transform (Alt+Q) · Add keyframe (F6) · Add blank keyframe (F7) · Add frame (F5) · Play (Shift+Enter) · Onion skin (Alt+O) · Show grid (Ctrl+') · Save (Ctrl+S) · Undo (Ctrl+Z)

### After Effects (4×3)
Selection (V) · Hand (H) · Zoom (Z) · Pen (G) · Pre-compose (Ctrl+Shift+C) · Render queue (Ctrl+M) · Play/pause (Space) · RAM preview (Numpad 0) · Step back (Ctrl+Alt+Z) · New solid (Ctrl+Y) · Save (Ctrl+S) · Time to start (Home)

## Implementation steps

1. **Add types & directory:** new `apps/mobile/src/templates/index.ts` exporting `TEMPLATES: TemplateMeta[]` and a `loadTemplate(id)` that lazy-imports the heavy module.
2. **Author template modules:** one TS file per app per the lists above, each exporting `default: BoardTemplate`. Pick `iconName` from Material Symbols (`brush`, `palette`, `videocam`, `code`, `movie`, etc).
3. **Boards store:** add `instantiateTemplate(id): Promise<Board>` in `apps/mobile/src/boards.ts` — generates fresh button IDs via `newButtonId()`, calls `createBoard(...)`, sets active.
4. **Picker UI:** new `apps/mobile/src/screens/TemplatePickerScreen.tsx` (full-screen modal style like `ScanScreen` and `IconPickerScreen`). 2-column FlatList, search bar at top.
5. **Wire `BoardsScreen`:** replace inline "+ New board" with a small chooser modal (`Pressable` rows: "From template" / "Empty board"). Route accordingly.
6. **First-launch:** in `apps/mobile/src/boards.ts`, drop the Adobe Animate seed. Render empty-state with "Browse templates" CTA in `BoardsScreen` when `boards.length === 0`.
7. **i18n:** new keys for `templates.browseBtn`, `templates.fromTemplateBtn`, `templates.emptyBoardBtn`, `templates.pickerTitle`, `templates.searchPlaceholder`, `templates.confirmCreate`, `templates.obsHint`, `templates.harmonyHint`. Translate to RU.

## Acceptance test (manual)

1. Wipe AsyncStorage (or fresh install). Open app → Boards tab → empty state with "Browse templates" CTA, **no** seeded Adobe Animate board.
2. Tap CTA → picker shows 10 cards (Photoshop, Figma, Blender, OBS, DaVinci, Premiere, VS Code, Adobe Animate, Harmony, AE). Each card shows icon + name + "N buttons · CxR grid".
3. Pick Photoshop → confirm row → Create.
4. New board "Photoshop" appears, all 15 buttons populated with correct combos. Tap **Run** → board works against the desktop app.
5. Tap **+ New board** again → chooser modal → tap **Empty board** → existing inline-name flow → blank board created.
6. Pick OBS template → board has F13–F20 keys. Open OBS Settings → Hotkeys → bind one (e.g. F17 to Scene 1). Run kekkeys → tap "Scene 1" → OBS switches scenes.
7. Pick Adobe Animate template → board has 16 buttons matching the previous hardcoded seed.
8. Switch language to Russian → picker UI strings translated; button labels stay English.
9. Reload app → all created boards persist.

## i18n strategy notes

- Picker chrome (titles, button text, hints, app description copy) — translated.
- Template button labels — English-only in v1. Adding translated labels per template would mean tracking 10 templates × 12 buttons × N locales. Defer.
- App display names — kept as-is (proper nouns).
- The OBS / Harmony hint strings (about needing to bind in app settings) — translated.

## Open questions

- 🟡 Should the user be able to **preview** a template before instantiating it? E.g., a thumbnail of the grid layout in the picker card. Nice-to-have; v1 picker can show just icon + name + counts. Add layout-thumbnail in v1.1 if asked for.
- 🟡 Should templates be **versioned** so we can ship updates? E.g., "Photoshop v2" with new buttons added. For v1: no versioning — instantiated boards are independent copies, so updating a template doesn't affect existing instantiations. Future flag: per-board `templateOrigin?: { id, version }` for "update template" UX. Not now.
- 🟡 OBS/Harmony hints — should they show as a one-time banner inside the created board, or only in the picker confirmation? Both is overkill. **Recommend** banner inside the board's editor on first open (dismissable, persisted via AsyncStorage flag), since the user opens the editor right after creation anyway.
- 🟡 Should we also ship a **community templates** repository (separate from bundled)? Out of scope for v1, but `templateOrigin` opens the door.

## Effort estimate

~2.5 days for one dev:
- 1 day on UX (picker, chooser, empty-state).
- 1 day on authoring 10 templates (incl. testing each combo against the actual app — important to catch typos in W3C key codes).
- 0.5 day on i18n + acceptance polish.

## Out of scope

- Translated template labels (defer).
- Layout thumbnails in picker cards (defer).
- Updating instantiated boards when a template version bumps (defer).
- Community templates / sharing (defer to v1.2+).
- Per-OS variants (mac vs win shortcuts) — only Windows is in MVP scope.
