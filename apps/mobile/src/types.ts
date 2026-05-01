import type { KeyCode } from "./protocol";

export interface BoardButton {
  id: string;
  /** Cell coordinates on the grid; (0,0) is top-left. */
  x: number;
  y: number;
  label?: string;
  iconName?: string;
  /** PRO fields — ignored on free tier for now. */
  bgColor?: string;
  iconColor?: string;
  textColor?: string;
  /** Keys pressed when the button is held. */
  keys: KeyCode[];
}

export interface Board {
  id: string;
  name: string;
  gridCols: number;
  gridRows: number;
  buttons: BoardButton[];
}
