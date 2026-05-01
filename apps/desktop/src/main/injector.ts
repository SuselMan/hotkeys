/**
 * Key injection on the host OS.
 *
 * Backend: direct Win32 SendInput via koffi (see ./win32-input.ts for the
 * rationale — short version: nut.js sends scancodes which break under
 * non-Latin keyboard layouts).
 *
 * Reference counting per W3C key code: only the first press of a key issues
 * an OS keydown, only the last release issues a keyup. This is what lets the
 * user hold two phone buttons that share `Ctrl` without `Ctrl` being released
 * mid-flight.
 */
import type { KeyCode } from "@kekkeys/protocol";
import { initWin32Input, sendVkBatch, win32InitError, win32InputReady } from "./win32-input.js";

const refCount = new Map<KeyCode, number>();

export function initInjector(): void {
  const ok = initWin32Input();
  if (ok) {
    console.log("[injector] win32 SendInput ready");
  } else {
    console.warn(`[injector] win32 input unavailable: ${win32InitError()} — running without key injection`);
  }
}

export function injectorReady(): boolean {
  return win32InputReady();
}

export function injectorPress(keys: KeyCode[]): void {
  if (!win32InputReady()) return;
  const vks: number[] = [];
  for (const k of keys) {
    const cur = refCount.get(k) ?? 0;
    refCount.set(k, cur + 1);
    if (cur === 0) {
      const vk = mapToVk(k);
      if (vk !== null) vks.push(vk);
      else console.warn(`[injector] no VK mapping for code ${k}`);
    }
  }
  if (vks.length > 0) sendVkBatch(vks, false);
}

export function injectorRelease(keys: KeyCode[]): void {
  if (!win32InputReady()) return;
  const vks: number[] = [];
  for (const k of keys) {
    const cur = refCount.get(k) ?? 0;
    if (cur <= 1) {
      refCount.delete(k);
      const vk = mapToVk(k);
      if (vk !== null) vks.push(vk);
    } else {
      refCount.set(k, cur - 1);
    }
  }
  if (vks.length > 0) sendVkBatch(vks, true);
}

/** Force-release every key the injector thinks is held — call on app exit. */
export function flushAll(): void {
  if (!win32InputReady()) {
    refCount.clear();
    return;
  }
  const vks: number[] = [];
  for (const k of refCount.keys()) {
    const vk = mapToVk(k);
    if (vk !== null) vks.push(vk);
  }
  refCount.clear();
  if (vks.length > 0) sendVkBatch(vks, true);
}

/**
 * W3C UI Events `code` → Win32 VK code.
 * VK codes are layout-independent for shortcut purposes — that's the whole
 * point of going direct to SendInput instead of nut.js.
 *
 * https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes
 */
function mapToVk(code: KeyCode): number | null {
  switch (code) {
    // Modifiers
    case "ControlLeft": return 0xa2;
    case "ControlRight": return 0xa3;
    case "ShiftLeft": return 0xa0;
    case "ShiftRight": return 0xa1;
    case "AltLeft": return 0xa4;
    case "AltRight": return 0xa5;
    case "MetaLeft": return 0x5b;
    case "MetaRight": return 0x5c;

    // Letters — VK_A..VK_Z = 0x41..0x5A
    case "KeyA": return 0x41;
    case "KeyB": return 0x42;
    case "KeyC": return 0x43;
    case "KeyD": return 0x44;
    case "KeyE": return 0x45;
    case "KeyF": return 0x46;
    case "KeyG": return 0x47;
    case "KeyH": return 0x48;
    case "KeyI": return 0x49;
    case "KeyJ": return 0x4a;
    case "KeyK": return 0x4b;
    case "KeyL": return 0x4c;
    case "KeyM": return 0x4d;
    case "KeyN": return 0x4e;
    case "KeyO": return 0x4f;
    case "KeyP": return 0x50;
    case "KeyQ": return 0x51;
    case "KeyR": return 0x52;
    case "KeyS": return 0x53;
    case "KeyT": return 0x54;
    case "KeyU": return 0x55;
    case "KeyV": return 0x56;
    case "KeyW": return 0x57;
    case "KeyX": return 0x58;
    case "KeyY": return 0x59;
    case "KeyZ": return 0x5a;

    // Digits — VK_0..VK_9 = 0x30..0x39
    case "Digit0": return 0x30;
    case "Digit1": return 0x31;
    case "Digit2": return 0x32;
    case "Digit3": return 0x33;
    case "Digit4": return 0x34;
    case "Digit5": return 0x35;
    case "Digit6": return 0x36;
    case "Digit7": return 0x37;
    case "Digit8": return 0x38;
    case "Digit9": return 0x39;

    // F-keys — VK_F1..VK_F24 = 0x70..0x87
    case "F1": return 0x70;
    case "F2": return 0x71;
    case "F3": return 0x72;
    case "F4": return 0x73;
    case "F5": return 0x74;
    case "F6": return 0x75;
    case "F7": return 0x76;
    case "F8": return 0x77;
    case "F9": return 0x78;
    case "F10": return 0x79;
    case "F11": return 0x7a;
    case "F12": return 0x7b;
    case "F13": return 0x7c;
    case "F14": return 0x7d;
    case "F15": return 0x7e;
    case "F16": return 0x7f;
    case "F17": return 0x80;
    case "F18": return 0x81;
    case "F19": return 0x82;
    case "F20": return 0x83;
    case "F21": return 0x84;
    case "F22": return 0x85;
    case "F23": return 0x86;
    case "F24": return 0x87;

    // Whitespace and editing
    case "Space": return 0x20;
    case "Enter": return 0x0d;
    case "Tab": return 0x09;
    case "Escape": return 0x1b;
    case "Backspace": return 0x08;
    case "Delete": return 0x2e;
    case "CapsLock": return 0x14;

    // Navigation
    case "ArrowUp": return 0x26;
    case "ArrowDown": return 0x28;
    case "ArrowLeft": return 0x25;
    case "ArrowRight": return 0x27;
    case "Home": return 0x24;
    case "End": return 0x23;
    case "PageUp": return 0x21;
    case "PageDown": return 0x22;
    case "Insert": return 0x2d;

    // Punctuation (layout-dependent semantics, but VK is stable for US-ish layouts)
    case "Backquote": return 0xc0;
    case "Minus": return 0xbd;
    case "Equal": return 0xbb;
    case "BracketLeft": return 0xdb;
    case "BracketRight": return 0xdd;
    case "Backslash": return 0xdc;
    case "Semicolon": return 0xba;
    case "Quote": return 0xde;
    case "Comma": return 0xbc;
    case "Period": return 0xbe;
    case "Slash": return 0xbf;

    // Numpad
    case "NumLock": return 0x90;
    case "NumpadDivide": return 0x6f;
    case "NumpadMultiply": return 0x6a;
    case "NumpadSubtract": return 0x6d;
    case "NumpadAdd": return 0x6b;
    case "NumpadEnter": return 0x0d;
    case "NumpadDecimal": return 0x6e;
    case "Numpad0": return 0x60;
    case "Numpad1": return 0x61;
    case "Numpad2": return 0x62;
    case "Numpad3": return 0x63;
    case "Numpad4": return 0x64;
    case "Numpad5": return 0x65;
    case "Numpad6": return 0x66;
    case "Numpad7": return 0x67;
    case "Numpad8": return 0x68;
    case "Numpad9": return 0x69;

    // Misc
    case "PrintScreen": return 0x2c;
    case "ScrollLock": return 0x91;
    case "Pause": return 0x13;
    case "ContextMenu": return 0x5d;

    // Media
    case "AudioVolumeMute": return 0xad;
    case "AudioVolumeDown": return 0xae;
    case "AudioVolumeUp": return 0xaf;
    case "MediaPlayPause": return 0xb3;
    case "MediaStop": return 0xb2;
    case "MediaTrackPrevious": return 0xb1;
    case "MediaTrackNext": return 0xb0;

    default:
      return null;
  }
}
