/**
 * OBS Studio — board for streamers / recorders.
 *
 * IMPORTANT: OBS has NO default global hotkeys. Every button below sends
 * a "safe" key (F13–F24 and Ctrl+Shift+F1..F8) that almost no app binds
 * by default. After creating the board, the user must open OBS →
 * Settings → Hotkeys and bind each kekkeys key to the matching action.
 *
 * Layout:
 *   Row 1: streaming           (Start stream · Stop stream · Start rec · Stop rec)
 *   Row 2: replay & studio     (Pause rec · Save replay · Replay buffer · Studio mode)
 *   Row 3: scenes 1–4          (Scene 1 · Scene 2 · Scene 3 · Scene 4)
 *   Row 4: scenes 5–8          (Scene 5 · Scene 6 · Scene 7 · Scene 8)
 *   Row 5: audio               (Mute mic · Push to talk · Mute desktop · Transition)
 *
 * Push-to-Talk is a great fit for kekkeys hold semantics: hold the
 * button on the phone → mic transmits on PC. Release → mic mutes.
 */
import type { BoardTemplate } from "./types";

const obsTemplate: BoardTemplate = {
  id: "tpl-obs",
  name: "OBS Studio",
  iconName: "videocam",
  description: "Streaming & recording controls (requires binding in OBS Hotkeys)",
  hint: "OBS has no default hotkeys. Open OBS → Settings → Hotkeys and bind each action to the matching key (F13–F24 and Ctrl+Shift+F1..F8). One-time setup — kekkeys keys won't conflict with other apps.",
  gridCols: 4,
  gridRows: 5,
  buttons: [
    // Row 1 — streaming
    { x: 0, y: 0, label: "Start stream", iconName: "live_tv",              keys: ["F21"] },
    { x: 1, y: 0, label: "Stop stream",  iconName: "stop_circle",          keys: ["F22"] },
    { x: 2, y: 0, label: "Start rec",    iconName: "fiber_manual_record",  keys: ["F23"] },
    { x: 3, y: 0, label: "Stop rec",     iconName: "stop",                 keys: ["F24"] },

    // Row 2 — replay & studio
    { x: 0, y: 1, label: "Pause rec",    iconName: "pause_circle",         keys: ["ControlLeft", "ShiftLeft", "F1"] },
    { x: 1, y: 1, label: "Save replay",  iconName: "save",                 keys: ["ControlLeft", "ShiftLeft", "F2"] },
    { x: 2, y: 1, label: "Replay buf",   iconName: "replay",               keys: ["ControlLeft", "ShiftLeft", "F3"] },
    { x: 3, y: 1, label: "Studio mode",  iconName: "compare",              keys: ["ControlLeft", "ShiftLeft", "F4"] },

    // Row 3 — scenes 1-4
    { x: 0, y: 2, label: "Scene 1",      iconName: "filter_1",             keys: ["F13"] },
    { x: 1, y: 2, label: "Scene 2",      iconName: "filter_2",             keys: ["F14"] },
    { x: 2, y: 2, label: "Scene 3",      iconName: "filter_3",             keys: ["F15"] },
    { x: 3, y: 2, label: "Scene 4",      iconName: "filter_4",             keys: ["F16"] },

    // Row 4 — scenes 5-8
    { x: 0, y: 3, label: "Scene 5",      iconName: "filter_5",             keys: ["F17"] },
    { x: 1, y: 3, label: "Scene 6",      iconName: "filter_6",             keys: ["F18"] },
    { x: 2, y: 3, label: "Scene 7",      iconName: "filter_7",             keys: ["F19"] },
    { x: 3, y: 3, label: "Scene 8",      iconName: "filter_8",             keys: ["F20"] },

    // Row 5 — audio
    { x: 0, y: 4, label: "Mute mic",     iconName: "mic_off",              keys: ["ControlLeft", "ShiftLeft", "F5"] },
    { x: 1, y: 4, label: "Push to talk", iconName: "mic",                  keys: ["ControlLeft", "ShiftLeft", "F6"] },
    { x: 2, y: 4, label: "Mute desktop", iconName: "volume_off",           keys: ["ControlLeft", "ShiftLeft", "F7"] },
    { x: 3, y: 4, label: "Transition",   iconName: "swap_horiz",           keys: ["ControlLeft", "ShiftLeft", "F8"] },
  ],
};

export default obsTemplate;
