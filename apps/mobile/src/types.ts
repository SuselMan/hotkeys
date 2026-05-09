import type { KeyCode } from "./protocol";

export interface BoardButton {
  id: string;
  /** Cell coordinates on the grid; (0,0) is top-left. */
  x: number;
  y: number;
  label?: string;
  iconName?: string;
  /**
   * Basename of a user-uploaded icon under `${documentDirectory}user-icons/`,
   * e.g. `"a1b2c3d4.svg"`. Wins over `iconName` when set. PRO-only to add,
   * but kept rendering on tier downgrade.
   */
  customIcon?: string;
  /** PRO fields — ignored on free tier for now. */
  bgColor?: string;
  iconColor?: string;
  textColor?: string;
  /** Keys pressed when the button is held. */
  keys: KeyCode[];
  /**
   * Latch mode: a tap presses the keys and they stay down until the next tap
   * releases them, instead of the default press-and-hold. Useful for using
   * one button as a held modifier (e.g. Shift) while tapping other keys with
   * another finger, on apps that bind app-specific shortcuts to a modifier.
   */
  sticky?: boolean;
}

export interface Board {
  id: string;
  name: string;
  gridCols: number;
  gridRows: number;
  buttons: BoardButton[];
}
