/**
 * Direct Win32 SendInput binding via koffi.
 *
 * The reason we don't use nut.js / libnut for keyboard input: libnut's Windows
 * backend sends scancodes which the OS translates through the active keyboard
 * layout. With a non-Latin layout active (Russian, Arabic, etc.) Ctrl+S is
 * physically remapped to Ctrl+ы / Ctrl+ش and the target app never sees the
 * shortcut. Real keyboards work fine because their VK_S in WM_KEYDOWN is
 * layout-independent — that's what this module replicates by setting
 * KEYBDINPUT.wVk directly with no scancode flag.
 *
 * Keyboard input only — mouse / touch / hardware paths are intentionally
 * unused.
 */
import koffi from "koffi";

const KEYBDINPUT = koffi.struct("KEYBDINPUT", {
  wVk: "uint16",
  wScan: "uint16",
  dwFlags: "uint32",
  time: "uint32",
  dwExtraInfo: "uintptr_t",
});

const MOUSEINPUT = koffi.struct("MOUSEINPUT", {
  dx: "int32",
  dy: "int32",
  mouseData: "uint32",
  dwFlags: "uint32",
  time: "uint32",
  dwExtraInfo: "uintptr_t",
});

const HARDWAREINPUT = koffi.struct("HARDWAREINPUT", {
  uMsg: "uint32",
  wParamL: "uint16",
  wParamH: "uint16",
});

const INPUT_UNION = koffi.union("INPUT_UNION", {
  mi: MOUSEINPUT,
  ki: KEYBDINPUT,
  hi: HARDWAREINPUT,
});

const INPUT = koffi.struct("INPUT", {
  type: "uint32",
  u: INPUT_UNION,
});

const INPUT_SIZE = koffi.sizeof(INPUT);

const INPUT_KEYBOARD = 1;
const KEYEVENTF_KEYUP = 0x0002;
const KEYEVENTF_EXTENDEDKEY = 0x0001;

type SendInputFn = (n: number, inputs: unknown[], size: number) => number;
let SendInput: SendInputFn | null = null;
let initError: string | null = null;

export function initWin32Input(): boolean {
  if (process.platform !== "win32") {
    initError = `unsupported platform: ${process.platform}`;
    return false;
  }
  try {
    const lib = koffi.load("user32.dll");
    SendInput = lib.func(
      "uint32 __stdcall SendInput(uint32 cInputs, INPUT *pInputs, int32 cbSize)",
    ) as unknown as SendInputFn;
    return true;
  } catch (e) {
    initError = (e as Error).message;
    return false;
  }
}

export function win32InputReady(): boolean {
  return SendInput !== null;
}

export function win32InitError(): string | null {
  return initError;
}

/**
 * Virtual-key codes that must be marked as extended in SendInput so Windows
 * picks the right physical scancode (right-hand modifiers, navigation cluster,
 * arrows, numpad helpers, win keys, print screen).
 */
const EXTENDED_VK = new Set<number>([
  0x21, // VK_PRIOR (PageUp)
  0x22, // VK_NEXT (PageDown)
  0x23, // VK_END
  0x24, // VK_HOME
  0x25, // VK_LEFT
  0x26, // VK_UP
  0x27, // VK_RIGHT
  0x28, // VK_DOWN
  0x2D, // VK_INSERT
  0x2E, // VK_DELETE
  0x90, // VK_NUMLOCK
  0x2C, // VK_SNAPSHOT (PrintScreen)
  0xa3, // VK_RCONTROL
  0xa5, // VK_RMENU (right Alt)
  0x5b, // VK_LWIN
  0x5c, // VK_RWIN
]);

function buildInput(vk: number, isUp: boolean): unknown {
  let flags = EXTENDED_VK.has(vk) ? KEYEVENTF_EXTENDEDKEY : 0;
  if (isUp) flags |= KEYEVENTF_KEYUP;
  return {
    type: INPUT_KEYBOARD,
    u: {
      ki: {
        wVk: vk,
        wScan: 0,
        dwFlags: flags,
        time: 0,
        dwExtraInfo: 0n,
      },
    },
  };
}

export function sendVkBatch(vks: number[], isUp: boolean): void {
  if (!SendInput || vks.length === 0) return;
  const inputs = vks.map((vk) => buildInput(vk, isUp));
  const sent = SendInput(inputs.length, inputs, INPUT_SIZE);
  if (sent !== inputs.length) {
    console.warn(`[win32] SendInput sent ${sent}/${inputs.length} events`);
  }
}
