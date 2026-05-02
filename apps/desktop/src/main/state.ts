import { app, safeStorage } from "electron";
import { randomBytes, randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

interface PairedDevice {
  /** Stable phone-side id (sha256 of phonePubKey, hex). */
  phoneDeviceId: string;
  phoneName: string;
  /** Encrypted via safeStorage, base64. */
  sharedSecretEnc: string;
  pairedAt: number;
  lastSeenAt?: number;
}

interface PersistedState {
  pcDeviceId: string;
  pcName: string;
  serverPort: number;
  pairedDevices: PairedDevice[];
  /**
   * User-chosen LAN address for the QR. Persisted across restarts so the user
   * doesn't have to re-pick on every launch (relevant for multi-NIC machines
   * like Surface — see doc/tasks/todo/15).
   */
  preferredLanIp?: string;
}

const DEFAULT_PORT = 41234;
let cached: PersistedState | null = null;
let stateFilePath = "";

function getStateFile(): string {
  if (!stateFilePath) {
    const dir = app.getPath("userData");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    stateFilePath = join(dir, "state.json");
  }
  return stateFilePath;
}

async function loadState(): Promise<PersistedState> {
  if (cached) return cached;
  const file = getStateFile();
  try {
    const raw = await readFile(file, "utf8");
    cached = JSON.parse(raw) as PersistedState;
  } catch {
    cached = {
      pcDeviceId: randomUUID(),
      pcName: process.env["COMPUTERNAME"] ?? "kekkeys PC",
      serverPort: DEFAULT_PORT,
      pairedDevices: [],
    };
    await persist();
  }
  return cached;
}

async function persist(): Promise<void> {
  if (!cached) return;
  await writeFile(getStateFile(), JSON.stringify(cached, null, 2), "utf8");
}

export async function getPcIdentity(): Promise<{ pcDeviceId: string; pcName: string; port: number }> {
  const s = await loadState();
  return { pcDeviceId: s.pcDeviceId, pcName: s.pcName, port: s.serverPort };
}

export async function setServerPort(port: number): Promise<void> {
  const s = await loadState();
  s.serverPort = port;
  await persist();
}

export async function getPreferredLanIp(): Promise<string | null> {
  const s = await loadState();
  return s.preferredLanIp ?? null;
}

export async function setPreferredLanIp(addr: string | null): Promise<void> {
  const s = await loadState();
  if (addr) {
    s.preferredLanIp = addr;
  } else {
    delete s.preferredLanIp;
  }
  await persist();
}

export async function listPaired(): Promise<Array<Pick<PairedDevice, "phoneDeviceId" | "phoneName" | "pairedAt" | "lastSeenAt">>> {
  const s = await loadState();
  return s.pairedDevices.map(({ phoneDeviceId, phoneName, pairedAt, lastSeenAt }) => ({
    phoneDeviceId,
    phoneName,
    pairedAt,
    lastSeenAt,
  }));
}

export async function addPaired(phoneDeviceId: string, phoneName: string, sharedSecret: Buffer): Promise<void> {
  const s = await loadState();
  const enc = safeStorage.isEncryptionAvailable()
    ? safeStorage.encryptString(sharedSecret.toString("base64")).toString("base64")
    : sharedSecret.toString("base64"); // dev fallback when DPAPI unavailable
  const existing = s.pairedDevices.find((p) => p.phoneDeviceId === phoneDeviceId);
  if (existing) {
    existing.phoneName = phoneName;
    existing.sharedSecretEnc = enc;
    existing.pairedAt = Date.now();
  } else {
    s.pairedDevices.push({
      phoneDeviceId,
      phoneName,
      sharedSecretEnc: enc,
      pairedAt: Date.now(),
    });
  }
  await persist();
}

export async function getSharedSecret(phoneDeviceId: string): Promise<Buffer | null> {
  const s = await loadState();
  const dev = s.pairedDevices.find((p) => p.phoneDeviceId === phoneDeviceId);
  if (!dev) return null;
  const encBuf = Buffer.from(dev.sharedSecretEnc, "base64");
  const decoded = safeStorage.isEncryptionAvailable()
    ? safeStorage.decryptString(encBuf)
    : encBuf.toString();
  return Buffer.from(decoded, "base64");
}

export async function forgetPaired(phoneDeviceId: string): Promise<void> {
  const s = await loadState();
  s.pairedDevices = s.pairedDevices.filter((p) => p.phoneDeviceId !== phoneDeviceId);
  await persist();
}

export async function touchPairedSeen(phoneDeviceId: string): Promise<void> {
  const s = await loadState();
  const dev = s.pairedDevices.find((p) => p.phoneDeviceId === phoneDeviceId);
  if (dev) {
    dev.lastSeenAt = Date.now();
    await persist();
  }
}

/**
 * One-time pairing tokens, in-memory, 5-minute TTL.
 */
const PAIRING_TTL_MS = 5 * 60 * 1000;
const pendingTokens = new Map<string, number>();

export function createPairingToken(): string {
  // Sweep expired tokens.
  const now = Date.now();
  for (const [t, exp] of pendingTokens) {
    if (exp < now) pendingTokens.delete(t);
  }
  const token = randomBytes(16).toString("hex");
  pendingTokens.set(token, now + PAIRING_TTL_MS);
  return token;
}

export type ConsumeTokenResult = "ok" | "unknown" | "expired";

export function consumePairingToken(token: string): ConsumeTokenResult {
  const exp = pendingTokens.get(token);
  if (exp === undefined) return "unknown";
  pendingTokens.delete(token);
  if (exp < Date.now()) return "expired";
  return "ok";
}
