/**
 * Figma — board for UI/UX designers on iPad / tablet.
 *
 *   Row 1: tools primary         (Move · Frame · Rectangle · Ellipse)
 *   Row 2: tools secondary       (Pen · Text · Hand · Comment)
 *   Row 3: arrange + layout      (Group · Ungroup · Forward · Backward)
 *   Row 4: components & layout   (Component · Detach · Auto layout · Mask)
 *   Row 5: modifiers + escape    (Shift · Ctrl · Alt · Esc)
 *   Row 6: clipboard             (Cut · Copy · Paste · Paste over selection)
 *   Row 7: view                  (Zoom − · Zoom + · Fit screen · 100%)
 *   Row 8: utilities             (Duplicate · Undo · Redo · Lock)
 *   Row 9: select + stack        (Select All · Delete · To Front · To Back)
 *
 * Notes:
 *  - "Paste over selection" = Ctrl+Shift+V (pastes at the same coords as
 *    the original).
 *  - Auto Layout is Figma's killer responsive feature — Shift+A on
 *    a selection.
 *  - "100%" zoom is Ctrl+1 in newer Figma; Ctrl+0 is "Fit to screen".
 *  - Forward / Backward (row 3) move one step at a time. "To Front" /
 *    "To Back" (row 9) jump to the top / bottom of the stacking order
 *    in one go (Ctrl+Shift+] / Ctrl+Shift+[).
 */
import type { BoardTemplate } from "./types";

const figmaTemplate: BoardTemplate = {
  id: "tpl-figma",
  name: "Figma",
  iconName: "design_services",
  description: "UI/UX design board for tablet workflows",
  gridCols: 4,
  gridRows: 9,
  buttons: [
    // Row 1 — tools primary
    { x: 0, y: 0, label: "Move",       iconName: "arrow_selector_tool",    keys: ["KeyV"] },
    { x: 1, y: 0, label: "Frame",      iconName: "crop_square",            keys: ["KeyF"] },
    { x: 2, y: 0, label: "Rectangle",  iconName: "rectangle",              keys: ["KeyR"] },
    { x: 3, y: 0, label: "Ellipse",    iconName: "circle",                 keys: ["KeyO"] },

    // Row 2 — tools secondary
    { x: 0, y: 1, label: "Pen",        iconName: "polyline",               keys: ["KeyP"] },
    { x: 1, y: 1, label: "Text",       iconName: "text_fields",            keys: ["KeyT"] },
    { x: 2, y: 1, label: "Hand",       iconName: "pan_tool",               keys: ["KeyH"] },
    { x: 3, y: 1, label: "Comment",    iconName: "comment",                keys: ["KeyC"] },

    // Row 3 — arrange + layer order
    { x: 0, y: 2, label: "Group",      iconName: "group_work",             keys: ["ControlLeft", "KeyG"] },
    { x: 1, y: 2, label: "Ungroup",    iconName: "unfold_more",            keys: ["ControlLeft", "ShiftLeft", "KeyG"] },
    { x: 2, y: 2, label: "Forward",    iconName: "flip_to_front",          keys: ["ControlLeft", "BracketRight"] },
    { x: 3, y: 2, label: "Back",       iconName: "flip_to_back",           keys: ["ControlLeft", "BracketLeft"] },

    // Row 4 — components & layout
    { x: 0, y: 3, label: "Component",  iconName: "extension",              keys: ["ControlLeft", "AltLeft", "KeyK"] },
    { x: 1, y: 3, label: "Detach",     iconName: "link_off",               keys: ["ControlLeft", "AltLeft", "KeyB"] },
    { x: 2, y: 3, label: "Auto layout",iconName: "auto_awesome",           keys: ["ShiftLeft", "KeyA"] },
    { x: 3, y: 3, label: "Mask",       iconName: "mediation",              keys: ["ControlLeft", "AltLeft", "KeyM"] },

    // Row 5 — modifiers + esc
    { x: 0, y: 4, label: "Shift",      iconName: "keyboard_capslock",      keys: ["ShiftLeft"] },
    { x: 1, y: 4, label: "Ctrl",       iconName: "keyboard_control_key",   keys: ["ControlLeft"] },
    { x: 2, y: 4, label: "Alt",        iconName: "keyboard_option_key",    keys: ["AltLeft"] },
    { x: 3, y: 4, label: "Esc",        iconName: "close",                  keys: ["Escape"] },

    // Row 6 — clipboard
    { x: 0, y: 5, label: "Cut",                iconName: "content_cut",    keys: ["ControlLeft", "KeyX"] },
    { x: 1, y: 5, label: "Copy",               iconName: "content_copy",   keys: ["ControlLeft", "KeyC"] },
    { x: 2, y: 5, label: "Paste",              iconName: "content_paste",  keys: ["ControlLeft", "KeyV"] },
    { x: 3, y: 5, label: "Paste over",         iconName: "content_paste_go", keys: ["ControlLeft", "ShiftLeft", "KeyV"] },

    // Row 7 — view
    { x: 0, y: 6, label: "Zoom −",     iconName: "zoom_out",               keys: ["ControlLeft", "Minus"] },
    { x: 1, y: 6, label: "Zoom +",     iconName: "zoom_in",                keys: ["ControlLeft", "Equal"] },
    { x: 2, y: 6, label: "Fit",        iconName: "fit_screen",             keys: ["ControlLeft", "Digit0"] },
    { x: 3, y: 6, label: "100%",       iconName: "aspect_ratio",           keys: ["ControlLeft", "Digit1"] },

    // Row 8 — utilities
    { x: 0, y: 7, label: "Duplicate",  iconName: "file_copy",              keys: ["ControlLeft", "KeyD"] },
    { x: 1, y: 7, label: "Undo",       iconName: "undo",                   keys: ["ControlLeft", "KeyZ"] },
    { x: 2, y: 7, label: "Redo",       iconName: "redo",                   keys: ["ControlLeft", "ShiftLeft", "KeyZ"] },
    { x: 3, y: 7, label: "Lock",       iconName: "lock",                   keys: ["ControlLeft", "ShiftLeft", "KeyL"] },

    // Row 9 — select + stack extremes
    { x: 0, y: 8, label: "Select all", iconName: "select_all",                keys: ["ControlLeft", "KeyA"] },
    { x: 1, y: 8, label: "Delete",     iconName: "delete",                    keys: ["Delete"] },
    { x: 2, y: 8, label: "To front",   iconName: "keyboard_double_arrow_up",  keys: ["ControlLeft", "ShiftLeft", "BracketRight"] },
    { x: 3, y: 8, label: "To back",    iconName: "keyboard_double_arrow_down",keys: ["ControlLeft", "ShiftLeft", "BracketLeft"] },
  ],
};

export default figmaTemplate;
