#!/usr/bin/env node
/**
 * Pick the top-N most popular Material Symbols (already filtered to outlined
 * family by fetch-meta) and download each SVG from jsdelivr's mirror of the
 * @material-symbols/svg-400 npm package. Writes a single JSON file mapping
 * name → SVG string so the mobile app can ship offline-first icons in the
 * picker without extra network on first launch.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TOP_N = 200;
const CONCURRENCY = 16;

const here = dirname(fileURLToPath(import.meta.url));
const metaPath = resolve(here, "../data/icons-meta.json");
const out = resolve(here, "../data/popular-svgs.json");

const meta = JSON.parse(await readFile(metaPath, "utf8"));
const top = meta.slice(0, TOP_N);
console.log(`fetching ${top.length} svgs (top ${TOP_N} by popularity)`);

const svgs = {};
let done = 0;
let failed = 0;

async function worker(queue) {
  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) break;
    try {
      const url = `https://cdn.jsdelivr.net/npm/@material-symbols/svg-400/outlined/${item.name}.svg`;
      const res = await fetch(url);
      if (!res.ok) {
        failed++;
        continue;
      }
      svgs[item.name] = (await res.text()).trim();
    } catch {
      failed++;
    } finally {
      done++;
      if (done % 25 === 0) console.log(`  ${done}/${top.length}`);
    }
  }
}

const queue = [...top];
const workers = Array.from({ length: CONCURRENCY }, () => worker(queue));
await Promise.all(workers);

await mkdir(dirname(out), { recursive: true });
await writeFile(out, JSON.stringify(svgs));
console.log(`wrote ${Object.keys(svgs).length} svgs to ${out} (${failed} failed)`);
