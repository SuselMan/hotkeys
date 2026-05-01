/**
 * Key codes follow the W3C UI Events code values.
 * https://www.w3.org/TR/uievents-code/
 *
 * On the desktop side these get mapped to Windows VK codes for SendInput.
 */
export type KeyCode = string;

export const Modifiers = [
  "ControlLeft",
  "ControlRight",
  "ShiftLeft",
  "ShiftRight",
  "AltLeft",
  "AltRight",
  "MetaLeft",
  "MetaRight",
] as const satisfies readonly KeyCode[];

export type Modifier = (typeof Modifiers)[number];

export const isModifier = (k: KeyCode): k is Modifier =>
  (Modifiers as readonly string[]).includes(k);
