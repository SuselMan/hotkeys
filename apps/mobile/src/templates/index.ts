/**
 * Template registry. The picker reads `TEMPLATES` (lightweight metadata) and
 * lazy-loads the full `BoardTemplate` only when the user instantiates one.
 *
 * Adding a new template: drop a new module under this directory exporting
 * `default: BoardTemplate`, then register its meta + lazy loader below.
 */
import type { BoardTemplate, TemplateMeta } from "./types";

type Loader = () => Promise<BoardTemplate>;

interface Entry {
  meta: TemplateMeta;
  load: Loader;
}

// Static metadata mirrors what's in each module — kept in sync by hand. We
// duplicate it here so the picker doesn't need to load every template's full
// button payload at startup just to render a card grid.
const ENTRIES: Entry[] = [
  {
    meta: {
      id: "tpl-adobe-animate",
      name: "Adobe Animate",
      iconName: "movie",
      description: "Frame-by-frame animation board for tablet workflows",
      hint: "Onion skin has no default Animate shortcut — bind one in Edit → Keyboard Shortcuts and add the button.",
      buttonCount: 32,
      gridCols: 4,
      gridRows: 8,
    },
    load: async () => (await import("./adobe-animate")).default,
  },
  {
    meta: {
      id: "tpl-after-effects",
      name: "After Effects",
      iconName: "auto_awesome_motion",
      description: "Motion graphics & VFX board for tablet workflows",
      buttonCount: 32,
      gridCols: 4,
      gridRows: 8,
    },
    load: async () => (await import("./after-effects")).default,
  },
  {
    meta: {
      id: "tpl-blender",
      name: "Blender",
      iconName: "view_in_ar",
      description: "3D modeling board (default keymap)",
      hint: "Default keymap assumed. Numpad view shortcuts (1/3/7/0) require a numpad — laptop users may need to re-bind.",
      buttonCount: 32,
      gridCols: 4,
      gridRows: 8,
    },
    load: async () => (await import("./blender")).default,
  },
  {
    meta: {
      id: "tpl-davinci-resolve",
      name: "DaVinci Resolve",
      iconName: "theaters",
      description: "Edit page board with J/K/L transport and mark/edit ops",
      hint: "Shortcuts target the Edit page (default keymap). Cut, Color, Fairlight, and Deliver pages have their own shortcut sets.",
      buttonCount: 32,
      gridCols: 4,
      gridRows: 8,
    },
    load: async () => (await import("./davinci-resolve")).default,
  },
  {
    meta: {
      id: "tpl-figma",
      name: "Figma",
      iconName: "design_services",
      description: "UI/UX design board for tablet workflows",
      buttonCount: 32,
      gridCols: 4,
      gridRows: 8,
    },
    load: async () => (await import("./figma")).default,
  },
  {
    meta: {
      id: "tpl-obs",
      name: "OBS Studio",
      iconName: "videocam",
      description: "Streaming & recording controls (requires binding in OBS Hotkeys)",
      hint: "OBS has no default hotkeys. Open OBS → Settings → Hotkeys and bind each action to the matching key (F13–F24 and Ctrl+Shift+F1..F8). One-time setup — kekkeys keys won't conflict with other apps.",
      buttonCount: 20,
      gridCols: 4,
      gridRows: 5,
    },
    load: async () => (await import("./obs")).default,
  },
  {
    meta: {
      id: "tpl-photoshop",
      name: "Photoshop",
      iconName: "palette",
      description: "Digital painting & retouching board for Wacom / iPad workflows",
      buttonCount: 32,
      gridCols: 4,
      gridRows: 8,
    },
    load: async () => (await import("./photoshop")).default,
  },
  {
    meta: {
      id: "tpl-premiere-pro",
      name: "Premiere Pro",
      iconName: "video_settings",
      description: "Video editing board with J/K/L transport and edit ops",
      buttonCount: 32,
      gridCols: 4,
      gridRows: 8,
    },
    load: async () => (await import("./premiere-pro")).default,
  },
  {
    meta: {
      id: "tpl-toonboom-harmony",
      name: "Toon Boom Harmony",
      iconName: "animation",
      description: "Cut-out / 2D animation board (Harmony 21+ default keymap)",
      hint: "Harmony defaults vary by version and studios often remap heavily. If a button doesn't fire, check Harmony → Edit → Keyboard Shortcuts.",
      buttonCount: 28,
      gridCols: 4,
      gridRows: 7,
    },
    load: async () => (await import("./toonboom-harmony")).default,
  },
  {
    meta: {
      id: "tpl-vs-code",
      name: "VS Code",
      iconName: "code",
      description: "Code editor board (Windows / Linux keymap)",
      hint: "Windows / Linux keymap. Mac users: re-bind Ctrl- combos to Cmd in their kekkeys buttons (Cmd = Meta in W3C).",
      buttonCount: 32,
      gridCols: 4,
      gridRows: 8,
    },
    load: async () => (await import("./vs-code")).default,
  },
];

export const TEMPLATES: TemplateMeta[] = ENTRIES.map((e) => e.meta);

export async function loadTemplate(id: string): Promise<BoardTemplate | null> {
  const entry = ENTRIES.find((e) => e.meta.id === id);
  if (!entry) return null;
  return entry.load();
}

export type { BoardTemplate, TemplateMeta };
