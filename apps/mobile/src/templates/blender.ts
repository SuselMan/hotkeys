/**
 * Blender — board for 3D modeling on tablet.
 *
 *   Row 1: transform             (Move · Rotate · Scale · Mode toggle)
 *   Row 2: modeling ops          (Extrude · Inset · Loop cut · Bevel)
 *   Row 3: selection             (Select all · Deselect · Invert · Knife)
 *   Row 4: views                 (Front · Right · Top · Camera)
 *   Row 5: modifiers + escape    (Shift · Ctrl · Alt · Esc)
 *   Row 6: clipboard + dup       (Copy · Paste · Duplicate · Linked dup)
 *   Row 7: timeline              (Prev frame · Play · Next frame · Frame selected)
 *   Row 8: utilities             (Save · Undo · Redo · Render F12)
 *   Row 9: visibility + view     (Hide · Unhide · Frame all · Snap toggle)
 *
 * Notes:
 *  - View shortcuts use the Numpad (Numpad 1/3/7/0). Some users with
 *    laptop keyboards remap these to top-row digits — adjust if needed.
 *  - "Mode toggle" (Tab) cycles Object/Edit mode for the selected object.
 *  - "I" (Inset) and "I" (Insert Keyframe) share the same key — Blender
 *    distinguishes by mode: Inset in Edit mode, Insert Keyframe in Object
 *    mode.
 *  - Default keymap assumed (Blender 3.x+); Industry Compatible keymap
 *    will need user re-binds.
 *  - "Hide" (H) hides selected; "Unhide" (Alt+H) brings everything back.
 *    Used heavily during modeling to clean up the viewport.
 *  - "Frame all" (Home) zooms the viewport to fit every visible object.
 *  - "Snap toggle" (Shift+Tab) flips snapping on/off globally.
 */
import type { BoardTemplate } from "./types";

const blenderTemplate: BoardTemplate = {
  id: "tpl-blender",
  name: "Blender",
  iconName: "view_in_ar",
  description: "3D modeling board (default keymap)",
  hint: "Default keymap assumed. Numpad view shortcuts (1/3/7/0) require a numpad — laptop users may need to re-bind.",
  gridCols: 4,
  gridRows: 9,
  buttons: [
    // Row 1 — transform
    { x: 0, y: 0, label: "Move",       iconName: "open_with",              keys: ["KeyG"] },
    { x: 1, y: 0, label: "Rotate",     iconName: "rotate_right",           keys: ["KeyR"] },
    { x: 2, y: 0, label: "Scale",      iconName: "zoom_out_map",           keys: ["KeyS"] },
    { x: 3, y: 0, label: "Mode",       iconName: "keyboard_tab",           keys: ["Tab"] },

    // Row 2 — modeling ops
    { x: 0, y: 1, label: "Extrude",    iconName: "arrow_outward",          keys: ["KeyE"] },
    { x: 1, y: 1, label: "Inset",      iconName: "picture_in_picture",     keys: ["KeyI"] },
    { x: 2, y: 1, label: "Loop cut",   iconName: "linear_scale",           keys: ["ControlLeft", "KeyR"] },
    { x: 3, y: 1, label: "Bevel",      iconName: "rounded_corner",         keys: ["ControlLeft", "KeyB"] },

    // Row 3 — selection
    { x: 0, y: 2, label: "Select all", iconName: "select_all",             keys: ["KeyA"] },
    { x: 1, y: 2, label: "Deselect",   iconName: "deselect",               keys: ["AltLeft", "KeyA"] },
    { x: 2, y: 2, label: "Invert",     iconName: "flip",                   keys: ["ControlLeft", "KeyI"] },
    { x: 3, y: 2, label: "Knife",      iconName: "straighten",             keys: ["KeyK"] },

    // Row 4 — views
    { x: 0, y: 3, label: "Front",      iconName: "crop_portrait",          keys: ["Numpad1"] },
    { x: 1, y: 3, label: "Right",      iconName: "crop_landscape",         keys: ["Numpad3"] },
    { x: 2, y: 3, label: "Top",        iconName: "crop_square",            keys: ["Numpad7"] },
    { x: 3, y: 3, label: "Camera",     iconName: "videocam",               keys: ["Numpad0"] },

    // Row 5 — modifiers + esc
    { x: 0, y: 4, label: "Shift",      iconName: "keyboard_capslock",      keys: ["ShiftLeft"] },
    { x: 1, y: 4, label: "Ctrl",       iconName: "keyboard_control_key",   keys: ["ControlLeft"] },
    { x: 2, y: 4, label: "Alt",        iconName: "keyboard_option_key",    keys: ["AltLeft"] },
    { x: 3, y: 4, label: "Esc",        iconName: "close",                  keys: ["Escape"] },

    // Row 6 — clipboard + duplicate
    { x: 0, y: 5, label: "Copy",       iconName: "content_copy",           keys: ["ControlLeft", "KeyC"] },
    { x: 1, y: 5, label: "Paste",      iconName: "content_paste",          keys: ["ControlLeft", "KeyV"] },
    { x: 2, y: 5, label: "Duplicate",  iconName: "library_add",            keys: ["ShiftLeft", "KeyD"] },
    { x: 3, y: 5, label: "Linked dup", iconName: "link",                   keys: ["AltLeft", "KeyD"] },

    // Row 7 — timeline
    { x: 0, y: 6, label: "Prev frame", iconName: "chevron_left",           keys: ["ArrowLeft"] },
    { x: 1, y: 6, label: "Play",       iconName: "play_arrow",             keys: ["Space"] },
    { x: 2, y: 6, label: "Next frame", iconName: "chevron_right",          keys: ["ArrowRight"] },
    { x: 3, y: 6, label: "Frame sel.", iconName: "center_focus_strong",    keys: ["NumpadDecimal"] },

    // Row 8 — utilities
    { x: 0, y: 7, label: "Save",       iconName: "save",                   keys: ["ControlLeft", "KeyS"] },
    { x: 1, y: 7, label: "Undo",       iconName: "undo",                   keys: ["ControlLeft", "KeyZ"] },
    { x: 2, y: 7, label: "Redo",       iconName: "redo",                   keys: ["ControlLeft", "ShiftLeft", "KeyZ"] },
    { x: 3, y: 7, label: "Render",     iconName: "image",                  keys: ["F12"] },

    // Row 9 — visibility + view
    { x: 0, y: 8, label: "Hide",       iconName: "visibility_off",         keys: ["KeyH"] },
    { x: 1, y: 8, label: "Unhide",     iconName: "visibility",             keys: ["AltLeft", "KeyH"] },
    { x: 2, y: 8, label: "Frame all",  iconName: "crop_free",              keys: ["Home"] },
    { x: 3, y: 8, label: "Snap",       iconName: "vertical_align_center",  keys: ["ShiftLeft", "Tab"] },
  ],
};

export default blenderTemplate;
