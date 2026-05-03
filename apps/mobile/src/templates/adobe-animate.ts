/**
 * Adobe Animate — designed for tablet+phone animators with no keyboard at all.
 * Layout follows the rhythm of traditional frame-by-frame animation:
 *
 *   Row 1: drawing primary tools  (Brush · Pencil · Eraser · Select)
 *   Row 2: drawing secondary      (Subselect · Transform · Lasso · Hand)
 *   Row 3: size + zoom            (Brush − · Brush + · Zoom − · Zoom +)
 *   Row 4: modifiers + escape     (Shift · Ctrl · Alt · Esc)
 *   Row 5: clipboard              (Cut · Copy · Paste · Paste in Place)
 *   Row 6: timeline keyframes     (F5 · F6 · F7 · F8)
 *   Row 7: timeline navigation    (Prev · Play · Next · Test movie)
 *   Row 8: edit utilities         (Pan-hold · Undo · Redo · Save)
 *
 * Notable choices:
 *  - F6 / F7 use the radio_button_checked / radio_button_unchecked icons —
 *    that's literally how Animate renders keyframes vs blank keyframes on
 *    the timeline, so animators recognize them at a glance.
 *  - "Pan" is Space-hold (temporary pan while held) — the standard Adobe
 *    pattern.
 *  - Brush size uses `[` / `]` (BracketLeft / BracketRight) — Animate's
 *    standard while a brush-like tool is active. Same convention as
 *    Photoshop.
 *  - Standalone modifier buttons (Shift / Ctrl / Alt) leverage kekkeys
 *    hold semantics: hold one on the phone, then press another button to
 *    compose ad-hoc combos. Hold Shift while drawing = constrained line;
 *    hold Shift while clicking = add to selection; etc.
 *  - Onion-skin is intentionally absent: Animate has no default keyboard
 *    shortcut for it. Users who want it can bind one via Edit → Keyboard
 *    Shortcuts and add the button themselves.
 */
import type { BoardTemplate } from "./types";

const adobeAnimateTemplate: BoardTemplate = {
  id: "tpl-adobe-animate",
  name: "Adobe Animate",
  iconName: "movie",
  description: "Frame-by-frame animation board for tablet workflows",
  hint: "Onion skin has no default Animate shortcut — bind one in Edit → Keyboard Shortcuts and add the button.",
  gridCols: 4,
  gridRows: 8,
  buttons: [
    // Row 1 — drawing primary
    { x: 0, y: 0, label: "Brush",      iconName: "brush",                  keys: ["KeyB"] },
    { x: 1, y: 0, label: "Pencil",     iconName: "edit",                   keys: ["KeyY"] },
    { x: 2, y: 0, label: "Eraser",     iconName: "ink_eraser",             keys: ["KeyE"] },
    { x: 3, y: 0, label: "Select",     iconName: "arrow_selector_tool",    keys: ["KeyV"] },

    // Row 2 — drawing secondary
    { x: 0, y: 1, label: "Subselect",  iconName: "near_me",                keys: ["KeyA"] },
    { x: 1, y: 1, label: "Transform",  iconName: "transform",              keys: ["KeyQ"] },
    { x: 2, y: 1, label: "Lasso",      iconName: "lasso_select",           keys: ["KeyL"] },
    { x: 3, y: 1, label: "Hand",       iconName: "pan_tool",               keys: ["KeyH"] },

    // Row 3 — size + zoom (paired ± controls)
    { x: 0, y: 2, label: "Brush −",    iconName: "remove",                 keys: ["BracketLeft"] },
    { x: 1, y: 2, label: "Brush +",    iconName: "add",                    keys: ["BracketRight"] },
    { x: 2, y: 2, label: "Zoom −",     iconName: "zoom_out",               keys: ["ControlLeft", "Minus"] },
    { x: 3, y: 2, label: "Zoom +",     iconName: "zoom_in",                keys: ["ControlLeft", "Equal"] },

    // Row 4 — standalone modifiers + Esc (hold to compose ad-hoc combos)
    { x: 0, y: 3, label: "Shift",      iconName: "keyboard_capslock",      keys: ["ShiftLeft"] },
    { x: 1, y: 3, label: "Ctrl",       iconName: "keyboard_control_key",   keys: ["ControlLeft"] },
    { x: 2, y: 3, label: "Alt",        iconName: "keyboard_option_key",    keys: ["AltLeft"] },
    { x: 3, y: 3, label: "Esc",        iconName: "close",                  keys: ["Escape"] },

    // Row 5 — clipboard
    { x: 0, y: 4, label: "Cut",            iconName: "content_cut",        keys: ["ControlLeft", "KeyX"] },
    { x: 1, y: 4, label: "Copy",           iconName: "content_copy",       keys: ["ControlLeft", "KeyC"] },
    { x: 2, y: 4, label: "Paste",          iconName: "content_paste",      keys: ["ControlLeft", "KeyV"] },
    { x: 3, y: 4, label: "Paste in place", iconName: "content_paste_go",   keys: ["ControlLeft", "ShiftLeft", "KeyV"] },

    // Row 6 — timeline keyframes (F5/F6/F7/F8 — the rhythm of frame-by-frame)
    { x: 0, y: 5, label: "Frame",      iconName: "more_horiz",             keys: ["F5"] },
    { x: 1, y: 5, label: "Keyframe",   iconName: "radio_button_checked",   keys: ["F6"] },
    { x: 2, y: 5, label: "Blank KF",   iconName: "radio_button_unchecked", keys: ["F7"] },
    { x: 3, y: 5, label: "Symbol",     iconName: "widgets",                keys: ["F8"] },

    // Row 7 — timeline navigation
    { x: 0, y: 6, label: "Prev",       iconName: "chevron_left",           keys: ["Comma"] },
    { x: 1, y: 6, label: "Play",       iconName: "play_arrow",             keys: ["Enter"] },
    { x: 2, y: 6, label: "Next",       iconName: "chevron_right",          keys: ["Period"] },
    { x: 3, y: 6, label: "Test movie", iconName: "play_circle",            keys: ["ControlLeft", "Enter"] },

    // Row 8 — edit utilities
    { x: 0, y: 7, label: "Pan",        iconName: "open_with",              keys: ["Space"] },
    { x: 1, y: 7, label: "Undo",       iconName: "undo",                   keys: ["ControlLeft", "KeyZ"] },
    { x: 2, y: 7, label: "Redo",       iconName: "redo",                   keys: ["ControlLeft", "ShiftLeft", "KeyZ"] },
    { x: 3, y: 7, label: "Save",       iconName: "save",                   keys: ["ControlLeft", "KeyS"] },
  ],
};

export default adobeAnimateTemplate;
