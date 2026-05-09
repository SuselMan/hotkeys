/**
 * Fixed palette for per-button colors (PRO). One palette is reused for the
 * Background, Icon, and Label slots — keeps the picker UI cheap and gives
 * a "feels designed" look without an HSL picker. Default values mirror the
 * values hardcoded in the run / editor screens before this feature, so
 * `?? DEFAULT_*` is a literal no-op for any button without overrides.
 */
export const PALETTE: readonly string[] = [
  "#1f1f1f", // near-black
  "#3a3a3a", // dark gray
  "#e8e8e8", // off-white
  "#dc2626", // red
  "#ea580c", // orange
  "#ca8a04", // yellow (dim)
  "#fadc50", // brand amber
  "#16a34a", // green
  "#0d9488", // teal
  "#2563eb", // blue
  "#7c3aed", // violet
  "#db2777", // pink
];

export const DEFAULT_BG = "#2d2d2d";
export const DEFAULT_BORDER = "#3d3d3d";
export const DEFAULT_FG = "#e8e8e8";
export const PRESSED_BG = "#fadc50";
export const PRESSED_FG = "#1a1a1a";
