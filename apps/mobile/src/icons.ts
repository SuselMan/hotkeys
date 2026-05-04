/**
 * Material Symbols icons — offline search via Fuse.js, lazy SVG fetch with
 * disk cache for icons outside the bundled top-200.
 *
 * Data:
 *   - data/icons-meta.json  — full set (~3866 icons), {name, popularity, tags, categories}
 *   - data/popular-svgs.json — top-200 SVG strings, instant offline.
 *
 * Anything outside the top-200 is fetched from jsdelivr's mirror of
 * @material-symbols/svg-400 and persisted to expo-file-system cacheDirectory.
 */
// SDK 54's expo-file-system rewrote the API; the legacy entry is the
// drop-in for the previous getInfoAsync / read / write helpers we use.
import * as FileSystem from "expo-file-system/legacy";
import Fuse from "fuse.js";
import metaJson from "./data/icons-meta.json";
import popularSvgsJson from "./data/popular-svgs.json";

export interface IconMeta {
  name: string;
  version: number;
  popularity: number;
  categories: string[];
  tags: string[];
}

const allMeta = metaJson as IconMeta[];
const popularSvgs = popularSvgsJson as Record<string, string>;

const memSvgCache = new Map<string, string>(Object.entries(popularSvgs));
const inflight = new Map<string, Promise<string | null>>();

let fuse: Fuse<IconMeta> | null = null;

function getFuse(): Fuse<IconMeta> {
  if (fuse) return fuse;
  fuse = new Fuse(allMeta, {
    keys: [
      { name: "name", weight: 0.6 },
      { name: "tags", weight: 0.3 },
      { name: "categories", weight: 0.1 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
  return fuse;
}

export function listAllIcons(): IconMeta[] {
  return allMeta;
}

export function searchIcons(query: string, limit = 100): IconMeta[] {
  const q = query.trim();
  if (!q) {
    // No query → top by popularity.
    return allMeta.slice(0, limit);
  }
  const results = getFuse().search(q, { limit });
  return results.map((r) => r.item);
}

const CACHE_DIR = `${FileSystem.cacheDirectory ?? ""}icons/`;

let ensureDirPromise: Promise<void> | null = null;
function ensureDir(): Promise<void> {
  if (ensureDirPromise) return ensureDirPromise;
  ensureDirPromise = (async () => {
    if (!FileSystem.cacheDirectory) return;
    const info = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
    }
  })().catch((err) => {
    // Don't permanently cache the failure — let the next call retry.
    ensureDirPromise = null;
    throw err;
  });
  return ensureDirPromise;
}

function cachePath(name: string): string {
  return `${CACHE_DIR}${name}.svg`;
}

/**
 * Synchronous fast path for the bundled top-200 (and any icon already
 * resolved this session). Returns `null` on a miss — caller should fall
 * back to the async `getSvg`. Letting `IconView` initialize from this
 * avoids a `null → svg` re-render flash for cached icons.
 */
export function getSvgSync(name: string): string | null {
  return memSvgCache.get(name) ?? null;
}

/**
 * Resolve an icon by name to an SVG XML string. Memoized in memory; reads
 * from / writes to expo-file-system cache; falls back to network.
 * Returns `null` if the icon doesn't exist or can't be fetched.
 */
export async function getSvg(name: string): Promise<string | null> {
  const cached = memSvgCache.get(name);
  if (cached !== undefined) return cached;

  const existing = inflight.get(name);
  if (existing) return existing;

  const p = (async () => {
    try {
      await ensureDir();
      const path = cachePath(name);
      const info = await FileSystem.getInfoAsync(path);
      if (info.exists) {
        const svg = await FileSystem.readAsStringAsync(path);
        memSvgCache.set(name, svg);
        return svg;
      }
      const url = `https://cdn.jsdelivr.net/npm/@material-symbols/svg-400/outlined/${name}.svg`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const svg = (await res.text()).trim();
      memSvgCache.set(name, svg);
      // Best-effort write — don't block on failure.
      FileSystem.writeAsStringAsync(path, svg).catch(() => undefined);
      return svg;
    } catch {
      return null;
    } finally {
      inflight.delete(name);
    }
  })();

  inflight.set(name, p);
  return p;
}

/**
 * Recolor a Material Symbols SVG by injecting `fill` on its <path>.
 * The raw SVGs ship with no fill attribute, so the OS defaults to black —
 * we override here so icons look right on dark backgrounds.
 *
 * Result is memoized by `(svg, color)` so re-renders that only flip the
 * highlight state of an already-resolved icon don't re-run the regex.
 */
const colorizeCache = new Map<string, string>();
export function colorize(svg: string, color: string): string {
  const key = `${color}\0${svg.length}\0${svg}`;
  const hit = colorizeCache.get(key);
  if (hit !== undefined) return hit;
  const out = svg.replace(/<path(?![^>]*\bfill=)/g, `<path fill="${color}"`);
  colorizeCache.set(key, out);
  return out;
}
