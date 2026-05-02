/**
 * Lightweight in-app logger. Patches console.{log,warn,error,info} so every
 * call is mirrored to a rotating file at `${cacheDirectory}/kekkeys.log`.
 * Used for diagnosing release-build issues where adb logcat isn't practical
 * (e.g. shared APKs on testers' phones).
 *
 * Settings → Export logs uses `getLogPath()` to share the file.
 */
import * as FileSystem from "expo-file-system/legacy";

const LOG_FILE = `${FileSystem.cacheDirectory ?? ""}kekkeys.log`;
const MAX_BYTES = 256 * 1024;
const FLUSH_INTERVAL_MS = 750;

let installed = false;
let memoryLog = "";
let pendingLines: string[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let writeChain: Promise<void> = Promise.resolve();
let historyLoaded = false;

type ConsoleFn = (...args: unknown[]) => void;
let originalConsole: { log: ConsoleFn; warn: ConsoleFn; error: ConsoleFn; info: ConsoleFn } | null = null;

export function installLogger(): void {
  if (installed) return;
  installed = true;

  originalConsole = {
    log: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    info: (console.info ?? console.log).bind(console),
  };
  console.log = patched("LOG", originalConsole.log);
  console.warn = patched("WARN", originalConsole.warn);
  console.error = patched("ERROR", originalConsole.error);
  console.info = patched("INFO", originalConsole.info);

  appendLine(`---- session start ${new Date().toISOString()} ----`);

  void (async () => {
    try {
      const info = await FileSystem.getInfoAsync(LOG_FILE);
      if (info.exists) {
        const existing = await FileSystem.readAsStringAsync(LOG_FILE);
        memoryLog = existing + memoryLog;
      }
    } catch {
      /* ignore — first run, or unreadable */
    }
    historyLoaded = true;
    scheduleFlush();
  })();
}

function patched(level: string, original: ConsoleFn): ConsoleFn {
  return (...args: unknown[]) => {
    original(...args);
    appendLine(`${new Date().toISOString()} [${level}] ${args.map(formatArg).join(" ")}`);
  };
}

function formatArg(a: unknown): string {
  if (a === null) return "null";
  if (a === undefined) return "undefined";
  if (typeof a === "string") return a;
  if (a instanceof Error) return `${a.name}: ${a.message}${a.stack ? `\n${a.stack}` : ""}`;
  if (typeof a === "object") {
    try {
      return JSON.stringify(a);
    } catch {
      return String(a);
    }
  }
  return String(a);
}

function appendLine(line: string): void {
  pendingLines.push(line);
  scheduleFlush();
}

function scheduleFlush(): void {
  if (!historyLoaded) return;
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushNow();
  }, FLUSH_INTERVAL_MS);
}

async function flushNow(): Promise<void> {
  if (pendingLines.length === 0) return;
  const lines = pendingLines.splice(0).join("\n") + "\n";
  memoryLog += lines;
  if (memoryLog.length > MAX_BYTES) {
    const cut = memoryLog.length - Math.floor(MAX_BYTES * 0.75);
    const nl = memoryLog.indexOf("\n", cut);
    memoryLog = memoryLog.slice(nl >= 0 ? nl + 1 : cut);
  }
  const snapshot = memoryLog;
  writeChain = writeChain.then(async () => {
    try {
      await FileSystem.writeAsStringAsync(LOG_FILE, snapshot, { encoding: "utf8" });
    } catch {
      /* swallow — don't recurse via console */
    }
  });
  await writeChain;
}

export async function getLogPath(): Promise<string> {
  if (historyLoaded) await flushNow();
  return LOG_FILE;
}

export async function getLogSize(): Promise<number> {
  try {
    const info = await FileSystem.getInfoAsync(LOG_FILE);
    if (!info.exists) return 0;
    return info.size ?? 0;
  } catch {
    return 0;
  }
}

export async function clearLogs(): Promise<void> {
  pendingLines = [];
  memoryLog = "";
  try {
    await FileSystem.deleteAsync(LOG_FILE, { idempotent: true });
  } catch {
    /* ignore */
  }
}
