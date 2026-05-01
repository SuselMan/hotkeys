#!/usr/bin/env node
/**
 * Fetch the Google Fonts Material Symbols metadata, distill it down to the
 * fields the mobile app needs (name, popularity, categories, tags, version),
 * and write data/icons-meta.json. Filters to icons available in the
 * "Material Symbols Outlined" family — that's the only style we ship today.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../data/icons-meta.json");

const url = "https://fonts.google.com/metadata/icons?incomplete=true";
console.log(`fetching ${url}`);
const res = await fetch(url);
if (!res.ok) throw new Error(`metadata fetch ${res.status}`);
let text = await res.text();
if (text.startsWith(")]}'")) {
  text = text.slice(text.indexOf("\n") + 1);
}
const meta = JSON.parse(text);

const FAMILY = "Material Symbols Outlined";
const filtered = meta.icons
  .filter((i) => !(i.unsupported_families ?? []).includes(FAMILY))
  .map((i) => ({
    name: i.name,
    version: i.version,
    popularity: i.popularity ?? 0,
    categories: i.categories ?? [],
    tags: i.tags ?? [],
  }));

filtered.sort((a, b) => b.popularity - a.popularity);

await mkdir(dirname(out), { recursive: true });
await writeFile(out, JSON.stringify(filtered));
console.log(`wrote ${filtered.length} icons to ${out}`);
