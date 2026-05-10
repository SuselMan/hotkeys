/**
 * DaVinci Resolve — Edit page board for video editors.
 *
 *   Row 1: transport (J K L)     (J · K · L · Space)
 *   Row 2: mark + marker         (Mark in · Mark out · Clear in/out · Marker)
 *   Row 3: tools                 (Selection · Blade · Trim · Snap)
 *   Row 4: frame / clip nav      (Prev frame · Next frame · Prev clip · Next clip)
 *   Row 5: modifiers + escape    (Shift · Ctrl · Alt · Esc)
 *   Row 6: clipboard             (Cut · Copy · Paste · Delete clip)
 *   Row 7: edit ops              (Blade @ playhead · Add edit · Insert · Overwrite)
 *   Row 8: utilities             (Save · Undo · Redo · Fit timeline)
 *   Row 9: more edit ops         (Append · Replace · Match Frame · Src/TL toggle)
 *
 * Notes:
 *  - Targets the Edit page (default keymap). Cut / Color / Fairlight pages
 *    have different shortcuts.
 *  - "Delete clip" uses Backspace which ripple-deletes by default in
 *    Resolve.
 *  - "Fit timeline" = Shift+Z (zoom timeline to fit window).
 *  - "Append" (Shift+F12) drops the source clip at the very end of the
 *    timeline regardless of playhead — handy for assembling B-roll.
 *  - "Replace" (F11) drops the source clip into the target track at the
 *    playhead, replacing whatever is there for the source's duration.
 *  - "Match Frame" (KeyF) loads the source clip at playhead position
 *    into the source viewer.
 *  - "Src/TL toggle" (KeyQ) cycles focus between source and timeline
 *    viewers — essential when navigating with JKL.
 */
import type { BoardTemplate } from "./types";

const davinciTemplate: BoardTemplate = {
  id: "tpl-davinci-resolve",
  name: "DaVinci Resolve",
  iconName: "theaters",
  description: "Edit page board with J/K/L transport and mark/edit ops",
  hint: "Shortcuts target the Edit page (default keymap). Cut, Color, Fairlight, and Deliver pages have their own shortcut sets.",
  gridCols: 4,
  gridRows: 9,
  buttons: [
    // Row 1 — JKL transport
    { x: 0, y: 0, label: "J (rewind)", iconName: "fast_rewind",            keys: ["KeyJ"] },
    { x: 1, y: 0, label: "K (pause)",  iconName: "pause",                  keys: ["KeyK"] },
    { x: 2, y: 0, label: "L (fwd)",    iconName: "fast_forward",           keys: ["KeyL"] },
    { x: 3, y: 0, label: "Play",       iconName: "play_arrow",             keys: ["Space"] },

    // Row 2 — mark + marker
    { x: 0, y: 1, label: "Mark in",    iconName: "vertical_align_top",     keys: ["KeyI"] },
    { x: 1, y: 1, label: "Mark out",   iconName: "vertical_align_bottom",  keys: ["KeyO"] },
    { x: 2, y: 1, label: "Clear I/O",  iconName: "clear",                  keys: ["AltLeft", "KeyX"] },
    { x: 3, y: 1, label: "Marker",     iconName: "bookmark",               keys: ["KeyM"] },

    // Row 3 — tools
    { x: 0, y: 2, label: "Selection",  iconName: "arrow_selector_tool",    keys: ["KeyA"] },
    { x: 1, y: 2, label: "Blade",      iconName: "content_cut",            keys: ["KeyB"] },
    { x: 2, y: 2, label: "Trim",       iconName: "drag_handle",            keys: ["KeyT"] },
    { x: 3, y: 2, label: "Snap",       iconName: "vertical_align_center",  keys: ["KeyN"] },

    // Row 4 — frame / clip nav
    { x: 0, y: 3, label: "Prev frame", iconName: "chevron_left",           keys: ["ArrowLeft"] },
    { x: 1, y: 3, label: "Next frame", iconName: "chevron_right",          keys: ["ArrowRight"] },
    { x: 2, y: 3, label: "Prev clip",  iconName: "keyboard_arrow_up",      keys: ["ArrowUp"] },
    { x: 3, y: 3, label: "Next clip",  iconName: "keyboard_arrow_down",    keys: ["ArrowDown"] },

    // Row 5 — modifiers + esc
    { x: 0, y: 4, label: "Shift",      iconName: "keyboard_capslock",      keys: ["ShiftLeft"] },
    { x: 1, y: 4, label: "Ctrl",       iconName: "keyboard_control_key",   keys: ["ControlLeft"] },
    { x: 2, y: 4, label: "Alt",        iconName: "keyboard_option_key",    keys: ["AltLeft"] },
    { x: 3, y: 4, label: "Esc",        iconName: "close",                  keys: ["Escape"] },

    // Row 6 — clipboard + delete
    { x: 0, y: 5, label: "Cut",        iconName: "content_cut",            keys: ["ControlLeft", "KeyX"] },
    { x: 1, y: 5, label: "Copy",       iconName: "content_copy",           keys: ["ControlLeft", "KeyC"] },
    { x: 2, y: 5, label: "Paste",      iconName: "content_paste",          keys: ["ControlLeft", "KeyV"] },
    { x: 3, y: 5, label: "Delete",     iconName: "delete",                 keys: ["Backspace"] },

    // Row 7 — edit ops
    { x: 0, y: 6, label: "Blade @ph",  iconName: "vertical_split",         keys: ["ControlLeft", "KeyB"] },
    { x: 1, y: 6, label: "Add edit",   iconName: "playlist_add",           keys: ["ControlLeft", "Backslash"] },
    { x: 2, y: 6, label: "Insert",     iconName: "skip_next",              keys: ["Semicolon"] },
    { x: 3, y: 6, label: "Overwrite",  iconName: "south",                  keys: ["Quote"] },

    // Row 8 — utilities
    { x: 0, y: 7, label: "Save",       iconName: "save",                   keys: ["ControlLeft", "KeyS"] },
    { x: 1, y: 7, label: "Undo",       iconName: "undo",                   keys: ["ControlLeft", "KeyZ"] },
    { x: 2, y: 7, label: "Redo",       iconName: "redo",                   keys: ["ControlLeft", "ShiftLeft", "KeyZ"] },
    { x: 3, y: 7, label: "Fit time",   iconName: "fit_screen",             keys: ["ShiftLeft", "KeyZ"] },

    // Row 9 — more edit ops
    { x: 0, y: 8, label: "Append",      iconName: "arrow_outward",         keys: ["ShiftLeft", "F12"] },
    { x: 1, y: 8, label: "Replace",     iconName: "swap_horiz",            keys: ["F11"] },
    { x: 2, y: 8, label: "Match frame", iconName: "pageview",              keys: ["KeyF"] },
    { x: 3, y: 8, label: "Src/TL",      iconName: "compare_arrows",        keys: ["KeyQ"] },
  ],
};

export default davinciTemplate;
