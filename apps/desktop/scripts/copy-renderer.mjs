import { cp, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "../src/renderer");
const dst = resolve(here, "../dist/renderer");

await mkdir(dst, { recursive: true });
await cp(src, dst, { recursive: true });
console.log(`copied renderer: ${src} -> ${dst}`);
