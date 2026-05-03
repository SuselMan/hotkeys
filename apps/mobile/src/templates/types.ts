/**
 * Bundled board templates. Each template is a static blueprint that the user
 * instantiates into a real Board (with fresh button IDs) via `instantiateTemplate`.
 *
 * Templates live in `apps/mobile/src/templates/<app-id>.ts` and are surfaced
 * from `index.ts`. The picker reads the lightweight `TemplateMeta` summary
 * synchronously; the heavy `buttons[]` array is only loaded when the user
 * actually picks one.
 */
import type { BoardButton } from "../types";

/** Lightweight summary, safe to keep in memory for the picker grid. */
export interface TemplateMeta {
  id: string;
  name: string;
  /** Material Symbols icon for the picker card. */
  iconName: string;
  /** Short description shown under the name in the picker. */
  description: string;
  /** Optional one-liner shown after instantiation (e.g. "bind these in OBS Hotkeys"). */
  hint?: string;
  buttonCount: number;
  gridCols: number;
  gridRows: number;
}

/** Full template payload, used at instantiation time. */
export interface BoardTemplate {
  id: string;
  name: string;
  iconName: string;
  description: string;
  hint?: string;
  gridCols: number;
  gridRows: number;
  /** Buttons without `id` — IDs are minted fresh per instantiation. */
  buttons: Array<Omit<BoardButton, "id">>;
}
