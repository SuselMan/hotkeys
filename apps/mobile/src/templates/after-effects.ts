/**
 * Adobe After Effects — board for motion design.
 *
 *   Row 1: tools                 (Selection · Hand · Zoom · Pen)
 *   Row 2: tools 2               (Rotation · Anchor · Type · Brush)
 *   Row 3: layer property reveal (Position · Anchor pt · Rotation · Scale)
 *   Row 4: modifiers + escape    (Shift · Ctrl · Alt · Esc)
 *   Row 5: clipboard + dup       (Cut · Copy · Paste · Duplicate)
 *   Row 6: comp ops              (Pre-compose · New solid · Split layer · Adjustment)
 *   Row 7: timeline              (Prev frame · Play · Next frame · RAM preview)
 *   Row 8: utilities             (Save · Undo · Redo · Render queue)
 *   Row 9: keyframe interpolation (Easy Ease · Easy Ease In · Easy Ease Out · Hold)
 *
 * Notes:
 *  - Row 3 buttons (P/A/R/S) reveal the matching property on the
 *    selected layer in the timeline panel — they are *not* tool
 *    selections. Holding Shift adds to the visible properties.
 *  - "Type" is Ctrl+T (shortcut for the Horizontal Type tool); plain T
 *    in AE reveals the Opacity property of a selected layer.
 *  - "RAM preview" = Numpad 0 (renders an in-RAM preview of the comp).
 *  - "Adjustment layer" = Ctrl+Shift+Alt+Y.
 *  - Easy Ease (F9) is the motion designer's bread-and-butter — applied
 *    to selected keyframes to smooth in/out tangents. Shift+F9 eases
 *    only the in-handle, Ctrl+Shift+F9 only the out-handle.
 *  - "Hold" (Ctrl+Alt+H) toggles the selected keyframe to a step/hold
 *    interpolation (no animation between this keyframe and the next).
 */
import type { BoardTemplate } from "./types";

const afterEffectsTemplate: BoardTemplate = {
  id: "tpl-after-effects",
  name: "After Effects",
  iconName: "auto_awesome_motion",
  description: "Motion graphics & VFX board for tablet workflows",
  gridCols: 4,
  gridRows: 9,
  buttons: [
    // Row 1 — tools
    { x: 0, y: 0, label: "Select",     iconName: "arrow_selector_tool",    keys: ["KeyV"] },
    { x: 1, y: 0, label: "Hand",       iconName: "pan_tool",               keys: ["KeyH"] },
    { x: 2, y: 0, label: "Zoom",       iconName: "zoom_in",                keys: ["KeyZ"] },
    { x: 3, y: 0, label: "Pen",        iconName: "polyline",               keys: ["KeyG"] },

    // Row 2 — tools 2
    { x: 0, y: 1, label: "Rotation",   iconName: "rotate_right",           keys: ["KeyW"] },
    { x: 1, y: 1, label: "Anchor",     iconName: "adjust",                 keys: ["KeyY"] },
    { x: 2, y: 1, label: "Type",       iconName: "text_fields",            keys: ["ControlLeft", "KeyT"] },
    { x: 3, y: 1, label: "Brush",      iconName: "brush",                  keys: ["ControlLeft", "KeyB"] },

    // Row 3 — layer property reveal (P A R S — single key, on selected layer)
    { x: 0, y: 2, label: "Position",   iconName: "place",                  keys: ["KeyP"] },
    { x: 1, y: 2, label: "Anchor pt",  iconName: "adjust",                 keys: ["KeyA"] },
    { x: 2, y: 2, label: "Rotation",   iconName: "rotate_right",           keys: ["KeyR"] },
    { x: 3, y: 2, label: "Scale",      iconName: "zoom_out_map",           keys: ["KeyS"] },

    // Row 4 — modifiers + esc
    { x: 0, y: 3, label: "Shift",      iconName: "keyboard_capslock",      keys: ["ShiftLeft"] },
    { x: 1, y: 3, label: "Ctrl",       iconName: "keyboard_control_key",   keys: ["ControlLeft"] },
    { x: 2, y: 3, label: "Alt",        iconName: "keyboard_option_key",    keys: ["AltLeft"] },
    { x: 3, y: 3, label: "Esc",        iconName: "close",                  keys: ["Escape"] },

    // Row 5 — clipboard + duplicate
    { x: 0, y: 4, label: "Cut",        iconName: "content_cut",            keys: ["ControlLeft", "KeyX"] },
    { x: 1, y: 4, label: "Copy",       iconName: "content_copy",           keys: ["ControlLeft", "KeyC"] },
    { x: 2, y: 4, label: "Paste",      iconName: "content_paste",          keys: ["ControlLeft", "KeyV"] },
    { x: 3, y: 4, label: "Duplicate",  iconName: "library_add",            keys: ["ControlLeft", "KeyD"] },

    // Row 6 — comp ops
    { x: 0, y: 5, label: "Pre-comp",   iconName: "layers",                 keys: ["ControlLeft", "ShiftLeft", "KeyC"] },
    { x: 1, y: 5, label: "New solid",  iconName: "rectangle",              keys: ["ControlLeft", "KeyY"] },
    { x: 2, y: 5, label: "Split layer",iconName: "vertical_split",         keys: ["ControlLeft", "ShiftLeft", "KeyD"] },
    { x: 3, y: 5, label: "Adjust lyr", iconName: "tune",                   keys: ["ControlLeft", "ShiftLeft", "AltLeft", "KeyY"] },

    // Row 7 — timeline
    { x: 0, y: 6, label: "Prev frame", iconName: "chevron_left",           keys: ["ArrowLeft"] },
    { x: 1, y: 6, label: "Play",       iconName: "play_arrow",             keys: ["Space"] },
    { x: 2, y: 6, label: "Next frame", iconName: "chevron_right",          keys: ["ArrowRight"] },
    { x: 3, y: 6, label: "RAM prev",   iconName: "play_circle",            keys: ["Numpad0"] },

    // Row 8 — utilities
    { x: 0, y: 7, label: "Save",       iconName: "save",                   keys: ["ControlLeft", "KeyS"] },
    { x: 1, y: 7, label: "Undo",       iconName: "undo",                   keys: ["ControlLeft", "KeyZ"] },
    { x: 2, y: 7, label: "Redo",       iconName: "redo",                   keys: ["ControlLeft", "ShiftLeft", "KeyZ"] },
    { x: 3, y: 7, label: "Render Q",   iconName: "queue_play_next",        keys: ["ControlLeft", "KeyM"] },

    // Row 9 — keyframe interpolation (animation core)
    { x: 0, y: 8, label: "Easy ease",   iconName: "query_stats",           keys: ["F9"] },
    { x: 1, y: 8, label: "Ease in",     iconName: "trending_up",           keys: ["ShiftLeft", "F9"] },
    { x: 2, y: 8, label: "Ease out",    iconName: "trending_flat",         keys: ["ControlLeft", "ShiftLeft", "F9"] },
    { x: 3, y: 8, label: "Hold KF",     iconName: "square",                keys: ["ControlLeft", "AltLeft", "KeyH"] },
  ],
};

export default afterEffectsTemplate;
