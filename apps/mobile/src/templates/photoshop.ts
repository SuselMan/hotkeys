/**
 * Adobe Photoshop — board for digital painters & retouchers on tablet.
 *
 *   Row 1: drawing primary       (Brush · Eraser · Eyedropper · Lasso)
 *   Row 2: selection & crop      (Move · Marquee · Magic Wand · Crop)
 *   Row 3: brush adjust          (Size − · Size + · Hardness − · Hardness +)
 *   Row 4: view + transform      (Zoom − · Zoom + · Fit screen · Free Transform)
 *   Row 5: modifiers + escape    (Shift · Ctrl · Alt · Esc)
 *   Row 6: clipboard             (Cut · Copy · Paste · Paste in Place)
 *   Row 7: color + select        (Switch FG/BG · Default colors · Fill FG · Deselect)
 *   Row 8: utilities             (Save · Undo · Redo · New layer)
 *   Row 9: pan + layer ops       (Pan-hold · Select All · Group layers · Merge layers)
 *
 * Notes:
 *  - "Hardness ±" uses Shift+[ / Shift+] (Photoshop standard for brush
 *    edge softness).
 *  - "Paste in Place" = Ctrl+Shift+V (Edit → Paste Special → Paste in Place).
 *  - "Fill FG" = Alt+Backspace (fills selection with foreground color).
 *  - "X" toggles foreground/background colors; "D" resets to black/white.
 */
import type { BoardTemplate } from "./types";

const photoshopTemplate: BoardTemplate = {
  id: "tpl-photoshop",
  name: "Photoshop",
  iconName: "palette",
  description: "Digital painting & retouching board for Wacom / iPad workflows",
  gridCols: 4,
  gridRows: 9,
  buttons: [
    // Row 1 — drawing primary
    { x: 0, y: 0, label: "Brush",      iconName: "brush",                  keys: ["KeyB"] },
    { x: 1, y: 0, label: "Eraser",     iconName: "ink_eraser",             keys: ["KeyE"] },
    { x: 2, y: 0, label: "Eyedropper", iconName: "colorize",               keys: ["KeyI"] },
    { x: 3, y: 0, label: "Lasso",      iconName: "lasso_select",           keys: ["KeyL"] },

    // Row 2 — selection & crop
    { x: 0, y: 1, label: "Move",       iconName: "arrow_selector_tool",    keys: ["KeyV"] },
    { x: 1, y: 1, label: "Marquee",    iconName: "crop_square",            keys: ["KeyM"] },
    { x: 2, y: 1, label: "Magic wand", iconName: "auto_fix_high",          keys: ["KeyW"] },
    { x: 3, y: 1, label: "Crop",       iconName: "crop",                   keys: ["KeyC"] },

    // Row 3 — brush adjust
    { x: 0, y: 2, label: "Size −",     iconName: "remove",                 keys: ["BracketLeft"] },
    { x: 1, y: 2, label: "Size +",     iconName: "add",                    keys: ["BracketRight"] },
    { x: 2, y: 2, label: "Hard −",     iconName: "blur_on",                keys: ["ShiftLeft", "BracketLeft"] },
    { x: 3, y: 2, label: "Hard +",     iconName: "lens",                   keys: ["ShiftLeft", "BracketRight"] },

    // Row 4 — view + transform
    { x: 0, y: 3, label: "Zoom −",     iconName: "zoom_out",               keys: ["ControlLeft", "Minus"] },
    { x: 1, y: 3, label: "Zoom +",     iconName: "zoom_in",                keys: ["ControlLeft", "Equal"] },
    { x: 2, y: 3, label: "Fit",        iconName: "fit_screen",             keys: ["ControlLeft", "Digit0"] },
    { x: 3, y: 3, label: "Transform",  iconName: "transform",              keys: ["ControlLeft", "KeyT"] },

    // Row 5 — modifiers + esc
    { x: 0, y: 4, label: "Shift",      iconName: "keyboard_capslock",      keys: ["ShiftLeft"] },
    { x: 1, y: 4, label: "Ctrl",       iconName: "keyboard_control_key",   keys: ["ControlLeft"] },
    { x: 2, y: 4, label: "Alt",        iconName: "keyboard_option_key",    keys: ["AltLeft"] },
    { x: 3, y: 4, label: "Esc",        iconName: "close",                  keys: ["Escape"] },

    // Row 6 — clipboard
    { x: 0, y: 5, label: "Cut",            iconName: "content_cut",        keys: ["ControlLeft", "KeyX"] },
    { x: 1, y: 5, label: "Copy",           iconName: "content_copy",       keys: ["ControlLeft", "KeyC"] },
    { x: 2, y: 5, label: "Paste",          iconName: "content_paste",      keys: ["ControlLeft", "KeyV"] },
    { x: 3, y: 5, label: "Paste in place", iconName: "content_paste_go",   keys: ["ControlLeft", "ShiftLeft", "KeyV"] },

    // Row 7 — color + select
    { x: 0, y: 6, label: "Swap FG/BG", iconName: "swap_horiz",             keys: ["KeyX"] },
    { x: 1, y: 6, label: "Reset color",iconName: "format_color_reset",     keys: ["KeyD"] },
    { x: 2, y: 6, label: "Fill FG",    iconName: "format_color_fill",      keys: ["AltLeft", "Backspace"] },
    { x: 3, y: 6, label: "Deselect",   iconName: "deselect",               keys: ["ControlLeft", "KeyD"] },

    // Row 8 — utilities
    { x: 0, y: 7, label: "Save",       iconName: "save",                   keys: ["ControlLeft", "KeyS"] },
    { x: 1, y: 7, label: "Undo",       iconName: "undo",                   keys: ["ControlLeft", "KeyZ"] },
    { x: 2, y: 7, label: "Redo",       iconName: "redo",                   keys: ["ControlLeft", "ShiftLeft", "KeyZ"] },
    { x: 3, y: 7, label: "New layer",  iconName: "add_box",                keys: ["ControlLeft", "ShiftLeft", "KeyN"] },

    // Row 9 — pan + layer ops
    { x: 0, y: 8, label: "Pan",          iconName: "open_with",            keys: ["Space"] },
    { x: 1, y: 8, label: "Select all",   iconName: "select_all",           keys: ["ControlLeft", "KeyA"] },
    { x: 2, y: 8, label: "Group layers", iconName: "group_work",           keys: ["ControlLeft", "KeyG"] },
    { x: 3, y: 8, label: "Merge layers", iconName: "merge",                keys: ["ControlLeft", "KeyE"] },
  ],
};

export default photoshopTemplate;
