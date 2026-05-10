/**
 * Adobe Premiere Pro — board for video editors.
 *
 *   Row 1: transport (J K L)     (J · K · L · Space)
 *   Row 2: mark + nav            (Mark in · Mark out · Clear in · Clear out)
 *   Row 3: tools                 (Selection · Razor · Track sel fwd · Pen)
 *   Row 4: frame / edit nav      (Prev frame · Next frame · Prev edit · Next edit)
 *   Row 5: modifiers + escape    (Shift · Ctrl · Alt · Esc)
 *   Row 6: clipboard             (Cut · Copy · Paste · Ripple delete)
 *   Row 7: edit ops              (Add edit · All-tracks edit · Insert · Overwrite)
 *   Row 8: utilities             (Save · Undo · Redo · Fit timeline)
 *   Row 9: in/out + export       (Lift · Extract · Match Frame · Export)
 *
 * Notes:
 *  - "Add edit" (Ctrl+K) splits the clip at the playhead.
 *  - "All-tracks edit" (Ctrl+Shift+K) splits across all targeted tracks.
 *  - "Ripple delete" (Shift+Delete) removes the clip and closes the gap.
 *  - "Fit timeline" is single-key Backslash in the timeline panel.
 *  - "Lift" (Semicolon) removes between in/out and leaves a gap.
 *    "Extract" (Quote / Apostrophe) removes between in/out and ripples
 *    the gap closed. They mirror Insert/Overwrite for in/out points.
 *  - "Match Frame" (KeyF) loads the source clip at playhead position into
 *    the source monitor — essential for finding "where did this come from?"
 *  - "Export" (Ctrl+M) opens the Export panel.
 */
import type { BoardTemplate } from "./types";

const premiereTemplate: BoardTemplate = {
  id: "tpl-premiere-pro",
  name: "Premiere Pro",
  iconName: "video_settings",
  description: "Video editing board with J/K/L transport and edit ops",
  gridCols: 4,
  gridRows: 9,
  buttons: [
    // Row 1 — JKL transport
    { x: 0, y: 0, label: "J (rewind)", iconName: "fast_rewind",            keys: ["KeyJ"] },
    { x: 1, y: 0, label: "K (pause)",  iconName: "pause",                  keys: ["KeyK"] },
    { x: 2, y: 0, label: "L (fwd)",    iconName: "fast_forward",           keys: ["KeyL"] },
    { x: 3, y: 0, label: "Play",       iconName: "play_arrow",             keys: ["Space"] },

    // Row 2 — mark + clear
    { x: 0, y: 1, label: "Mark in",    iconName: "vertical_align_top",     keys: ["KeyI"] },
    { x: 1, y: 1, label: "Mark out",   iconName: "vertical_align_bottom",  keys: ["KeyO"] },
    { x: 2, y: 1, label: "Clear in",   iconName: "clear",                  keys: ["ControlLeft", "ShiftLeft", "KeyI"] },
    { x: 3, y: 1, label: "Clear out",  iconName: "clear",                  keys: ["ControlLeft", "ShiftLeft", "KeyO"] },

    // Row 3 — tools
    { x: 0, y: 2, label: "Selection",  iconName: "arrow_selector_tool",    keys: ["KeyV"] },
    { x: 1, y: 2, label: "Razor",      iconName: "content_cut",            keys: ["KeyC"] },
    { x: 2, y: 2, label: "Track sel",  iconName: "double_arrow",           keys: ["KeyA"] },
    { x: 3, y: 2, label: "Pen",        iconName: "polyline",               keys: ["KeyP"] },

    // Row 4 — frame / edit nav
    { x: 0, y: 3, label: "Prev frame", iconName: "chevron_left",           keys: ["ArrowLeft"] },
    { x: 1, y: 3, label: "Next frame", iconName: "chevron_right",          keys: ["ArrowRight"] },
    { x: 2, y: 3, label: "Prev edit",  iconName: "keyboard_arrow_up",      keys: ["ArrowUp"] },
    { x: 3, y: 3, label: "Next edit",  iconName: "keyboard_arrow_down",    keys: ["ArrowDown"] },

    // Row 5 — modifiers + esc
    { x: 0, y: 4, label: "Shift",      iconName: "keyboard_capslock",      keys: ["ShiftLeft"] },
    { x: 1, y: 4, label: "Ctrl",       iconName: "keyboard_control_key",   keys: ["ControlLeft"] },
    { x: 2, y: 4, label: "Alt",        iconName: "keyboard_option_key",    keys: ["AltLeft"] },
    { x: 3, y: 4, label: "Esc",        iconName: "close",                  keys: ["Escape"] },

    // Row 6 — clipboard
    { x: 0, y: 5, label: "Cut",        iconName: "content_cut",            keys: ["ControlLeft", "KeyX"] },
    { x: 1, y: 5, label: "Copy",       iconName: "content_copy",           keys: ["ControlLeft", "KeyC"] },
    { x: 2, y: 5, label: "Paste",      iconName: "content_paste",          keys: ["ControlLeft", "KeyV"] },
    { x: 3, y: 5, label: "Ripple del", iconName: "delete_sweep",           keys: ["ShiftLeft", "Delete"] },

    // Row 7 — edit ops
    { x: 0, y: 6, label: "Add edit",   iconName: "vertical_split",         keys: ["ControlLeft", "KeyK"] },
    { x: 1, y: 6, label: "Edit all",   iconName: "splitscreen",            keys: ["ControlLeft", "ShiftLeft", "KeyK"] },
    { x: 2, y: 6, label: "Insert",     iconName: "skip_next",              keys: ["Comma"] },
    { x: 3, y: 6, label: "Overwrite",  iconName: "south",                  keys: ["Period"] },

    // Row 8 — utilities
    { x: 0, y: 7, label: "Save",       iconName: "save",                   keys: ["ControlLeft", "KeyS"] },
    { x: 1, y: 7, label: "Undo",       iconName: "undo",                   keys: ["ControlLeft", "KeyZ"] },
    { x: 2, y: 7, label: "Redo",       iconName: "redo",                   keys: ["ControlLeft", "ShiftLeft", "KeyZ"] },
    { x: 3, y: 7, label: "Fit time",   iconName: "fit_screen",             keys: ["Backslash"] },

    // Row 9 — in/out + export
    { x: 0, y: 8, label: "Lift",        iconName: "arrow_upward",          keys: ["Semicolon"] },
    { x: 1, y: 8, label: "Extract",     iconName: "compress",              keys: ["Quote"] },
    { x: 2, y: 8, label: "Match frame", iconName: "pageview",              keys: ["KeyF"] },
    { x: 3, y: 8, label: "Export",      iconName: "output",                keys: ["ControlLeft", "KeyM"] },
  ],
};

export default premiereTemplate;
