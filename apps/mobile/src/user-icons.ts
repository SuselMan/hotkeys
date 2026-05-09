/**
 * Storage for user-uploaded button icons (PRO).
 *
 * Files live under `${documentDirectory}user-icons/<sha256>.<ext>`. Buttons
 * reference them by basename via `BoardButton.customIcon`. Content-hashing
 * means two buttons with the same image share one file on disk.
 *
 * SVGs are sanitized on save — `<script>`, `<foreignObject>`, on* event
 * handlers and external `<image href>` are stripped before persisting, so
 * even if some future native viewer interprets them later, no payload sits
 * on disk.
 */
import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";

export type UserIconExt = "svg" | "png";

export const MAX_BYTES = 256 * 1024;

const DIR = `${FileSystem.documentDirectory ?? ""}user-icons/`;

let ensureDirPromise: Promise<void> | null = null;
function ensureDir(): Promise<void> {
  if (ensureDirPromise) return ensureDirPromise;
  ensureDirPromise = (async () => {
    if (!FileSystem.documentDirectory) return;
    const info = await FileSystem.getInfoAsync(DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(DIR, { intermediates: true });
    }
  })().catch((err) => {
    ensureDirPromise = null;
    throw err;
  });
  return ensureDirPromise;
}

export function userIconUri(basename: string): string {
  return `${DIR}${basename}`;
}

export function extOf(basename: string): UserIconExt | null {
  if (basename.endsWith(".svg")) return "svg";
  if (basename.endsWith(".png")) return "png";
  return null;
}

export class UserIconError extends Error {
  constructor(public reason: "tooLarge" | "unsupportedType" | "readFailed" | "writeFailed") {
    super(reason);
  }
}

/**
 * Sanitize a user-supplied SVG so we don't sit on potentially-active script
 * payloads. We don't try to be a full XML parser — just strip the elements
 * and attributes that have any chance of executing.
 */
export function sanitizeSvg(svg: string): string {
  let out = svg;
  out = out.replace(/<!DOCTYPE[\s\S]*?>/gi, "");
  out = out.replace(/<\?xml[\s\S]*?\?>/gi, "");
  out = out.replace(/<script\b[\s\S]*?<\/script\s*>/gi, "");
  out = out.replace(/<script\b[^>]*\/>/gi, "");
  out = out.replace(/<foreignObject\b[\s\S]*?<\/foreignObject\s*>/gi, "");
  out = out.replace(/<foreignObject\b[^>]*\/>/gi, "");
  out = out.replace(/<iframe\b[\s\S]*?<\/iframe\s*>/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "");
  out = out.replace(
    /<image\b[^>]*\b(?:xlink:href|href)\s*=\s*["']https?:[^"']*["'][^>]*\/?>/gi,
    "",
  );
  return out.trim();
}

/**
 * Save a user-picked file to disk and return its basename. Caller hands us
 * the source URI from a DocumentPicker result, the file size (for the
 * pre-upload limit check), and the extension we inferred from MIME / suffix.
 */
export async function saveUserIcon(
  srcUri: string,
  size: number,
  ext: UserIconExt,
): Promise<string> {
  if (size > MAX_BYTES) throw new UserIconError("tooLarge");
  await ensureDir();

  let payload: string;
  let encoding: "utf8" | "base64";
  if (ext === "svg") {
    let raw: string;
    try {
      raw = await FileSystem.readAsStringAsync(srcUri);
    } catch {
      throw new UserIconError("readFailed");
    }
    payload = sanitizeSvg(raw);
    encoding = "utf8";
  } else {
    try {
      payload = await FileSystem.readAsStringAsync(srcUri, { encoding: "base64" });
    } catch {
      throw new UserIconError("readFailed");
    }
    encoding = "base64";
  }

  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, payload);
  const basename = `${hash.slice(0, 32)}.${ext}`;
  const path = userIconUri(basename);
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    try {
      await FileSystem.writeAsStringAsync(path, payload, { encoding });
    } catch {
      throw new UserIconError("writeFailed");
    }
  }
  return basename;
}

const svgCache = new Map<string, string>();

/** Read an SVG file's text content (cached in-memory). */
export async function readUserSvg(basename: string): Promise<string | null> {
  const hit = svgCache.get(basename);
  if (hit !== undefined) return hit;
  try {
    const text = await FileSystem.readAsStringAsync(userIconUri(basename));
    svgCache.set(basename, text);
    return text;
  } catch {
    return null;
  }
}

/** Synchronous fast-path lookup for an already-resolved SVG. */
export function readUserSvgSync(basename: string): string | null {
  return svgCache.get(basename) ?? null;
}

export async function listUserIcons(): Promise<string[]> {
  if (!FileSystem.documentDirectory) return [];
  const info = await FileSystem.getInfoAsync(DIR);
  if (!info.exists) return [];
  const entries = await FileSystem.readDirectoryAsync(DIR);
  return entries.filter((n) => extOf(n) !== null);
}

/** Delete every file in the user-icons dir not present in `referenced`. */
export async function cleanupUnreferenced(referenced: Set<string>): Promise<void> {
  const all = await listUserIcons();
  await Promise.all(
    all
      .filter((n) => !referenced.has(n))
      .map((n) =>
        FileSystem.deleteAsync(userIconUri(n), { idempotent: true }).then(() => {
          svgCache.delete(n);
        }),
      ),
  );
}

/** Read raw bytes of a referenced icon, base64-encoded — for export envelope. */
export async function readUserIconBase64(basename: string): Promise<string | null> {
  try {
    return await FileSystem.readAsStringAsync(userIconUri(basename), { encoding: "base64" });
  } catch {
    return null;
  }
}

/** Write a base64 payload as a user icon — for import. Skips if same hash already on disk. */
export async function writeUserIconBase64(basename: string, dataBase64: string): Promise<void> {
  await ensureDir();
  const path = userIconUri(basename);
  const info = await FileSystem.getInfoAsync(path);
  if (info.exists) return;
  await FileSystem.writeAsStringAsync(path, dataBase64, { encoding: "base64" });
  svgCache.delete(basename);
}
