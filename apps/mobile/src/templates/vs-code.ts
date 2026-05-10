/**
 * Visual Studio Code — board for code editing.
 *
 *   Row 1: navigation            (Quick open · Cmd palette · Find · Replace)
 *   Row 2: editor toggles        (Sidebar · Terminal · Panel · Word wrap)
 *   Row 3: multi-cursor          (Cursor up · Cursor down · Add next · Select line)
 *   Row 4: move / copy lines     (Move ↑ · Move ↓ · Copy ↑ · Copy ↓)
 *   Row 5: modifiers + escape    (Shift · Ctrl · Alt · Esc)
 *   Row 6: clipboard + format    (Cut · Copy · Paste · Format doc)
 *   Row 7: code intelligence     (Comment · Quick fix · Go to def · Rename)
 *   Row 8: utilities             (Save · Undo · Redo · Close tab)
 *   Row 9: input + window        (Trigger Suggest · Param Hints · Split Editor · New File)
 *
 * Notes:
 *  - VS Code "Save All" (Ctrl+K, S) is a chord — kekkeys protocol can't
 *    send chords (only simultaneous combos), so it's omitted.
 *  - Defaults assume Windows / Linux keymap.
 *  - Multi-cursor "Add next" (Ctrl+D) selects the next match of the
 *    current selection.
 *  - Trigger Suggest (Ctrl+Space) re-opens the autocomplete popup when
 *    you've dismissed it — used constantly while typing.
 */
import type { BoardTemplate } from "./types";

const vsCodeTemplate: BoardTemplate = {
  id: "tpl-vs-code",
  name: "VS Code",
  iconName: "code",
  description: "Code editor board (Windows / Linux keymap)",
  hint: "Windows / Linux keymap. Mac users: re-bind Ctrl- combos to Cmd in their kekkeys buttons (Cmd = Meta in W3C).",
  gridCols: 4,
  gridRows: 9,
  buttons: [
    // Row 1 — navigation
    { x: 0, y: 0, label: "Quick open", iconName: "search",                 keys: ["ControlLeft", "KeyP"] },
    { x: 1, y: 0, label: "Cmd palette",iconName: "terminal",               keys: ["ControlLeft", "ShiftLeft", "KeyP"] },
    { x: 2, y: 0, label: "Find",       iconName: "find_in_page",           keys: ["ControlLeft", "KeyF"] },
    { x: 3, y: 0, label: "Replace",    iconName: "find_replace",           keys: ["ControlLeft", "KeyH"] },

    // Row 2 — editor toggles
    { x: 0, y: 1, label: "Sidebar",    iconName: "vertical_split",         keys: ["ControlLeft", "KeyB"] },
    { x: 1, y: 1, label: "Terminal",   iconName: "terminal",               keys: ["ControlLeft", "Backquote"] },
    { x: 2, y: 1, label: "Panel",      iconName: "horizontal_split",       keys: ["ControlLeft", "KeyJ"] },
    { x: 3, y: 1, label: "Wrap",       iconName: "wrap_text",              keys: ["AltLeft", "KeyZ"] },

    // Row 3 — multi-cursor
    { x: 0, y: 2, label: "Cursor ↑",   iconName: "keyboard_arrow_up",      keys: ["ControlLeft", "AltLeft", "ArrowUp"] },
    { x: 1, y: 2, label: "Cursor ↓",   iconName: "keyboard_arrow_down",    keys: ["ControlLeft", "AltLeft", "ArrowDown"] },
    { x: 2, y: 2, label: "Add next",   iconName: "playlist_add",           keys: ["ControlLeft", "KeyD"] },
    { x: 3, y: 2, label: "Select line",iconName: "horizontal_rule",        keys: ["ControlLeft", "KeyL"] },

    // Row 4 — move / copy lines
    { x: 0, y: 3, label: "Move ↑",     iconName: "north",                  keys: ["AltLeft", "ArrowUp"] },
    { x: 1, y: 3, label: "Move ↓",     iconName: "south",                  keys: ["AltLeft", "ArrowDown"] },
    { x: 2, y: 3, label: "Copy ↑",     iconName: "vertical_align_top",     keys: ["ShiftLeft", "AltLeft", "ArrowUp"] },
    { x: 3, y: 3, label: "Copy ↓",     iconName: "vertical_align_bottom",  keys: ["ShiftLeft", "AltLeft", "ArrowDown"] },

    // Row 5 — modifiers + esc
    { x: 0, y: 4, label: "Shift",      iconName: "keyboard_capslock",      keys: ["ShiftLeft"] },
    { x: 1, y: 4, label: "Ctrl",       iconName: "keyboard_control_key",   keys: ["ControlLeft"] },
    { x: 2, y: 4, label: "Alt",        iconName: "keyboard_option_key",    keys: ["AltLeft"] },
    { x: 3, y: 4, label: "Esc",        iconName: "close",                  keys: ["Escape"] },

    // Row 6 — clipboard + format
    { x: 0, y: 5, label: "Cut",        iconName: "content_cut",            keys: ["ControlLeft", "KeyX"] },
    { x: 1, y: 5, label: "Copy",       iconName: "content_copy",           keys: ["ControlLeft", "KeyC"] },
    { x: 2, y: 5, label: "Paste",      iconName: "content_paste",          keys: ["ControlLeft", "KeyV"] },
    { x: 3, y: 5, label: "Format",     iconName: "auto_fix_high",          keys: ["ShiftLeft", "AltLeft", "KeyF"] },

    // Row 7 — code intelligence
    { x: 0, y: 6, label: "Comment",    iconName: "comment",                keys: ["ControlLeft", "Slash"] },
    { x: 1, y: 6, label: "Quick fix",  iconName: "build",                  keys: ["ControlLeft", "Period"] },
    { x: 2, y: 6, label: "Go to def",  iconName: "subdirectory_arrow_right", keys: ["F12"] },
    { x: 3, y: 6, label: "Rename",     iconName: "edit_note",              keys: ["F2"] },

    // Row 8 — utilities
    { x: 0, y: 7, label: "Save",       iconName: "save",                   keys: ["ControlLeft", "KeyS"] },
    { x: 1, y: 7, label: "Undo",       iconName: "undo",                   keys: ["ControlLeft", "KeyZ"] },
    { x: 2, y: 7, label: "Redo",       iconName: "redo",                   keys: ["ControlLeft", "ShiftLeft", "KeyZ"] },
    { x: 3, y: 7, label: "Close tab",  iconName: "tab_close",              keys: ["ControlLeft", "KeyW"] },

    // Row 9 — input helpers + window
    { x: 0, y: 8, label: "Suggest",    iconName: "psychology",             keys: ["ControlLeft", "Space"] },
    { x: 1, y: 8, label: "Param hints",iconName: "info",                   keys: ["ControlLeft", "ShiftLeft", "Space"] },
    { x: 2, y: 8, label: "Split",      iconName: "splitscreen_right",      keys: ["ControlLeft", "Backslash"] },
    { x: 3, y: 8, label: "New file",   iconName: "note_add",               keys: ["ControlLeft", "KeyN"] },
  ],
};

export default vsCodeTemplate;
