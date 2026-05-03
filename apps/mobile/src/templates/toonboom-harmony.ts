/**
 * Toon Boom Harmony — board for cut-out / 2D animation.
 *
 *   Row 1: drawing primary       (Brush · Pencil · Eraser · Selection)
 *   Row 2: drawing secondary     (Cutter · Paint · Eyedropper · Transform)
 *   Row 3: brush + onion         (Brush − · Brush + · Onion skin · Pan-hold)
 *   Row 4: modifiers + escape    (Shift · Ctrl · Alt · Esc)
 *   Row 5: clipboard + group     (Cut · Copy · Paste · Group)
 *   Row 6: timeline keyframes    (Add frame · Add keyframe · Prev frame · Next frame)
 *   Row 7: utilities             (Save · Undo · Redo · Play)
 *
 * IMPORTANT: Harmony's defaults vary by version, and most studios remap
 * tool shortcuts heavily. This template targets the out-of-the-box
 * Harmony 21+ Premium keymap. If your studio uses a custom keymap, edit
 * the buttons after creating the board.
 *
 * Notes:
 *  - Most tools are Alt+letter (Harmony's signature pattern).
 *  - Alt+O toggles Onion Skin — Harmony has this as a default, unlike
 *    Adobe Animate.
 *  - Play is Shift+Enter (Harmony's default, NOT Space).
 */
import type { BoardTemplate } from "./types";

const harmonyTemplate: BoardTemplate = {
  id: "tpl-toonboom-harmony",
  name: "Toon Boom Harmony",
  iconName: "animation",
  description: "Cut-out / 2D animation board (Harmony 21+ default keymap)",
  hint: "Harmony defaults vary by version and studios often remap heavily. If a button doesn't fire, check Harmony → Edit → Keyboard Shortcuts.",
  gridCols: 4,
  gridRows: 7,
  buttons: [
    // Row 1 — drawing primary
    { x: 0, y: 0, label: "Brush",      iconName: "brush",                  keys: ["AltLeft", "KeyB"] },
    { x: 1, y: 0, label: "Pencil",     iconName: "edit",                   keys: ["AltLeft", "Slash"] },
    { x: 2, y: 0, label: "Eraser",     iconName: "ink_eraser",             keys: ["AltLeft", "KeyE"] },
    { x: 3, y: 0, label: "Select",     iconName: "arrow_selector_tool",    keys: ["AltLeft", "KeyS"] },

    // Row 2 — drawing secondary
    { x: 0, y: 1, label: "Cutter",     iconName: "content_cut",            keys: ["AltLeft", "KeyT"] },
    { x: 1, y: 1, label: "Paint",      iconName: "format_color_fill",      keys: ["AltLeft", "KeyI"] },
    { x: 2, y: 1, label: "Dropper",    iconName: "colorize",               keys: ["AltLeft", "KeyD"] },
    { x: 3, y: 1, label: "Transform",  iconName: "transform",              keys: ["AltLeft", "KeyQ"] },

    // Row 3 — brush sizing + onion + pan
    { x: 0, y: 2, label: "Brush −",    iconName: "remove",                 keys: ["BracketLeft"] },
    { x: 1, y: 2, label: "Brush +",    iconName: "add",                    keys: ["BracketRight"] },
    { x: 2, y: 2, label: "Onion skin", iconName: "filter_drama",           keys: ["AltLeft", "KeyO"] },
    { x: 3, y: 2, label: "Pan",        iconName: "open_with",              keys: ["Space"] },

    // Row 4 — modifiers + esc
    { x: 0, y: 3, label: "Shift",      iconName: "keyboard_capslock",      keys: ["ShiftLeft"] },
    { x: 1, y: 3, label: "Ctrl",       iconName: "keyboard_control_key",   keys: ["ControlLeft"] },
    { x: 2, y: 3, label: "Alt",        iconName: "keyboard_option_key",    keys: ["AltLeft"] },
    { x: 3, y: 3, label: "Esc",        iconName: "close",                  keys: ["Escape"] },

    // Row 5 — clipboard + group
    { x: 0, y: 4, label: "Cut",        iconName: "content_cut",            keys: ["ControlLeft", "KeyX"] },
    { x: 1, y: 4, label: "Copy",       iconName: "content_copy",           keys: ["ControlLeft", "KeyC"] },
    { x: 2, y: 4, label: "Paste",      iconName: "content_paste",          keys: ["ControlLeft", "KeyV"] },
    { x: 3, y: 4, label: "Group",      iconName: "group_work",             keys: ["ControlLeft", "KeyG"] },

    // Row 6 — timeline & frame nav
    { x: 0, y: 5, label: "Add frame",  iconName: "more_horiz",             keys: ["F5"] },
    { x: 1, y: 5, label: "Keyframe",   iconName: "radio_button_checked",   keys: ["F6"] },
    { x: 2, y: 5, label: "Prev frame", iconName: "chevron_left",           keys: ["Comma"] },
    { x: 3, y: 5, label: "Next frame", iconName: "chevron_right",          keys: ["Period"] },

    // Row 7 — utilities
    { x: 0, y: 6, label: "Save",       iconName: "save",                   keys: ["ControlLeft", "KeyS"] },
    { x: 1, y: 6, label: "Undo",       iconName: "undo",                   keys: ["ControlLeft", "KeyZ"] },
    { x: 2, y: 6, label: "Redo",       iconName: "redo",                   keys: ["ControlLeft", "KeyY"] },
    { x: 3, y: 6, label: "Play",       iconName: "play_arrow",             keys: ["ShiftLeft", "Enter"] },
  ],
};

export default harmonyTemplate;
