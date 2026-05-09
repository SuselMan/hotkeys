/**
 * JSON export / import of all boards. Pairings are intentionally excluded —
 * they're per-device secrets and don't survive a phone swap anyway.
 */
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { loadBoards } from "./boards";
import { getLogPath, getLogSize } from "./logger";
import type { Board } from "./types";
import { extOf, readUserIconBase64, writeUserIconBase64 } from "./user-icons";

const FORMAT_TAG = "kekkeys-boards-export";
const FORMAT_VERSION = 2;

interface ExportEnvelope {
  format: typeof FORMAT_TAG;
  version: number;
  exportedAt: string;
  boards: Board[];
  /** v2+: basename → base64 of file bytes for every customIcon referenced by `boards`. */
  userIcons?: Record<string, string>;
}

export async function exportBoards(): Promise<{ uri: string; shared: boolean }> {
  const boards = await loadBoards();
  // Inline every referenced custom icon as base64 so the export is one
  // self-contained file. Hash-based basenames mean duplicates across buttons
  // collapse to a single entry.
  const referenced = new Set<string>();
  for (const b of boards) {
    for (const btn of b.buttons) {
      if (btn.customIcon && extOf(btn.customIcon)) referenced.add(btn.customIcon);
    }
  }
  const userIcons: Record<string, string> = {};
  for (const basename of referenced) {
    const data = await readUserIconBase64(basename);
    if (data !== null) userIcons[basename] = data;
  }

  const envelope: ExportEnvelope = {
    format: FORMAT_TAG,
    version: FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    boards,
    ...(Object.keys(userIcons).length > 0 ? { userIcons } : {}),
  };
  const json = JSON.stringify(envelope, null, 2);
  const filename = `kekkeys-boards-${new Date().toISOString().slice(0, 10)}.json`;
  const uri = `${FileSystem.cacheDirectory ?? ""}${filename}`;
  await FileSystem.writeAsStringAsync(uri, json, { encoding: "utf8" });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: "application/json",
      dialogTitle: "Export kekkeys boards",
      UTI: "public.json",
    });
    return { uri, shared: true };
  }
  return { uri, shared: false };
}

export async function exportLogs(): Promise<{ uri: string; shared: boolean }> {
  if ((await getLogSize()) === 0) {
    throw new Error("no logs yet");
  }
  const logPath = await getLogPath();
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const out = `${FileSystem.cacheDirectory ?? ""}kekkeys-logs-${stamp}.txt`;
  await FileSystem.copyAsync({ from: logPath, to: out });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(out, {
      mimeType: "text/plain",
      dialogTitle: "Share kekkeys logs",
      UTI: "public.plain-text",
    });
    return { uri: out, shared: true };
  }
  return { uri: out, shared: false };
}

export async function pickAndImport(): Promise<{ ok: true; boards: Board[] } | { ok: false; reason: string }> {
  const picked = await DocumentPicker.getDocumentAsync({
    type: ["application/json", "text/json", "*/*"],
    copyToCacheDirectory: true,
  });
  if (picked.canceled) return { ok: false, reason: "canceled" };
  const asset = picked.assets[0];
  if (!asset) return { ok: false, reason: "no asset" };
  let raw: string;
  try {
    raw = await FileSystem.readAsStringAsync(asset.uri);
  } catch (e) {
    return { ok: false, reason: `read failed: ${(e as Error).message}` };
  }
  const validated = validateBoardsJson(raw);
  if (!validated.ok) return validated;
  // v2 envelopes may carry user-uploaded icon bytes — restore them to the
  // user-icons dir before returning so the boards' customIcon refs resolve.
  if (validated.userIcons) {
    for (const [basename, dataBase64] of Object.entries(validated.userIcons)) {
      if (!extOf(basename)) continue;
      try {
        await writeUserIconBase64(basename, dataBase64);
      } catch {
        // Skip a single bad entry; the button will render as a placeholder.
      }
    }
  }
  return { ok: true, boards: validated.boards };
}

export function validateBoardsJson(
  raw: string,
):
  | { ok: true; boards: Board[]; userIcons?: Record<string, string> }
  | { ok: false; reason: string } {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "not JSON" };
  }
  if (!data || typeof data !== "object") return { ok: false, reason: "not an object" };
  const env = data as Partial<ExportEnvelope>;
  if (env.format !== FORMAT_TAG) return { ok: false, reason: "wrong format tag" };
  if (typeof env.version !== "number" || env.version > FORMAT_VERSION) {
    return { ok: false, reason: `unsupported version ${env.version}` };
  }
  if (!Array.isArray(env.boards)) return { ok: false, reason: "boards is not an array" };
  for (const b of env.boards) {
    if (!isValidBoard(b)) return { ok: false, reason: "invalid board entry" };
  }
  let userIcons: Record<string, string> | undefined;
  if (env.userIcons !== undefined) {
    if (!env.userIcons || typeof env.userIcons !== "object" || Array.isArray(env.userIcons)) {
      return { ok: false, reason: "userIcons is not an object" };
    }
    for (const [k, v] of Object.entries(env.userIcons)) {
      if (typeof v !== "string") return { ok: false, reason: `userIcons[${k}] not a string` };
    }
    userIcons = env.userIcons as Record<string, string>;
  }
  return { ok: true, boards: env.boards, ...(userIcons ? { userIcons } : {}) };
}

function isValidBoard(b: unknown): b is Board {
  if (!b || typeof b !== "object") return false;
  const x = b as Partial<Board>;
  if (typeof x.id !== "string" || typeof x.name !== "string") return false;
  if (typeof x.gridCols !== "number" || typeof x.gridRows !== "number") return false;
  if (!Array.isArray(x.buttons)) return false;
  for (const btn of x.buttons) {
    if (!btn || typeof btn !== "object") return false;
    const bb = btn as Partial<{ id: string; x: number; y: number; keys: string[] }>;
    if (typeof bb.id !== "string") return false;
    if (typeof bb.x !== "number" || typeof bb.y !== "number") return false;
    if (!Array.isArray(bb.keys)) return false;
  }
  return true;
}
