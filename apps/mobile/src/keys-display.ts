/**
 * Format a combo (W3C `code` array) for display like `Ctrl + Shift + S`.
 * Modifiers are sorted in conventional order regardless of input order.
 */
import type { KeyCode } from "./protocol";

const MODIFIER_ORDER: KeyCode[] = [
  "ControlLeft",
  "ControlRight",
  "ShiftLeft",
  "ShiftRight",
  "AltLeft",
  "AltRight",
  "MetaLeft",
  "MetaRight",
];

const PRETTY: Record<string, string> = {
  ControlLeft: "Ctrl",
  ControlRight: "RCtrl",
  ShiftLeft: "Shift",
  ShiftRight: "RShift",
  AltLeft: "Alt",
  AltRight: "Alt",
  MetaLeft: "Win",
  MetaRight: "Win",
  Space: "Space",
  Enter: "Enter",
  Tab: "Tab",
  Escape: "Esc",
  Backspace: "Backspace",
  Delete: "Del",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  Home: "Home",
  End: "End",
  PageUp: "PgUp",
  PageDown: "PgDn",
  Insert: "Ins",
  CapsLock: "Caps",
  PrintScreen: "PrtSc",
  Backquote: "`",
  Minus: "-",
  Equal: "=",
  BracketLeft: "[",
  BracketRight: "]",
  Backslash: "\\",
  Semicolon: ";",
  Quote: "'",
  Comma: ",",
  Period: ".",
  Slash: "/",
};

export function prettyKey(code: KeyCode): string {
  const direct = PRETTY[code];
  if (direct) return direct;
  if (code.startsWith("Key")) return code.slice(3);
  if (code.startsWith("Digit")) return code.slice(5);
  if (code.startsWith("F") && /^F\d+$/.test(code)) return code;
  if (code.startsWith("Numpad")) return `Num${code.slice(6)}`;
  return code;
}

export function formatCombo(keys: KeyCode[]): string {
  if (keys.length === 0) return "—";
  const seen = new Set<string>();
  const ordered: KeyCode[] = [];
  for (const m of MODIFIER_ORDER) {
    if (keys.includes(m) && !seen.has(m)) {
      ordered.push(m);
      seen.add(m);
    }
  }
  for (const k of keys) {
    if (!MODIFIER_ORDER.includes(k) && !seen.has(k)) {
      ordered.push(k);
      seen.add(k);
    }
  }
  return ordered.map(prettyKey).join(" + ");
}
