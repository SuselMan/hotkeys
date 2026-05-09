/**
 * Persistent state for the mobile app.
 * - Identity (phone device id + opaque "pubkey") and per-pairing secrets go to
 *   expo-secure-store (Android Keystore on real devices).
 * - Non-secret bookkeeping (pc name, last host, etc.) is kept in plain JSON
 *   inside SecureStore too — it's small and the API is convenient.
 */
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import { sha256 } from "js-sha256";
import { useEffect, useState } from "react";

const KEY_IDENTITY = "kekkeys.identity";
const KEY_PAIRINGS = "kekkeys.pairings";
const KEY_ACTIVE = "kekkeys.activePairingId";
const KEY_SECRET_PREFIX = "kekkeys.secret."; // + pcDeviceId

/** Free tier supports a single paired PC; PRO is uncapped. */
export const MAX_FREE_PAIRINGS = 1;

export interface PhoneIdentity {
  phoneDeviceId: string;
  /**
   * Opaque "pubkey" — currently 32 random bytes base64. The protocol field is
   * named pubkey for forward compatibility; we hash it on the desktop to derive
   * phoneDeviceId, so it works as a stable identifier without real asymmetric
   * crypto in v1.
   */
  phonePubKey: string;
  phoneName: string;
}

export interface Pairing {
  pcDeviceId: string;
  pcName: string;
  /** Last successful host:port — phone uses it as the first reconnect target. */
  lastHost?: string;
  lastPort?: number;
  pairedAt: number;
  lastSeenAt?: number;
}

export async function getOrCreateIdentity(defaultName: string): Promise<PhoneIdentity> {
  const raw = await SecureStore.getItemAsync(KEY_IDENTITY);
  if (raw) {
    const parsed = JSON.parse(raw) as PhoneIdentity;
    const expected = sha256(parsed.phonePubKey);
    if (parsed.phoneDeviceId !== expected) {
      // Old build used a random phoneDeviceId; the desktop derives it from the
      // pubkey. Recompute, drop stale pairings (their secrets on the PC are
      // keyed by the old id and unreachable now).
      parsed.phoneDeviceId = expected;
      await SecureStore.setItemAsync(KEY_IDENTITY, JSON.stringify(parsed));
      await savePairings([]);
      await SecureStore.deleteItemAsync(KEY_ACTIVE);
    }
    return parsed;
  }

  const keyBytes = await Crypto.getRandomBytesAsync(32);
  const phonePubKey = bytesToBase64(keyBytes);
  const identity: PhoneIdentity = {
    phoneDeviceId: sha256(phonePubKey),
    phonePubKey,
    phoneName: defaultName,
  };
  await SecureStore.setItemAsync(KEY_IDENTITY, JSON.stringify(identity));
  return identity;
}

export async function setPhoneName(name: string): Promise<void> {
  const id = await SecureStore.getItemAsync(KEY_IDENTITY);
  if (!id) return;
  const parsed = JSON.parse(id) as PhoneIdentity;
  parsed.phoneName = name;
  await SecureStore.setItemAsync(KEY_IDENTITY, JSON.stringify(parsed));
}

let pairingsCache: Pairing[] | null = null;
let pairingsHydrated: Promise<Pairing[]> | null = null;
const pairingListeners = new Set<() => void>();

export async function listPairings(): Promise<Pairing[]> {
  if (pairingsCache) return pairingsCache;
  if (!pairingsHydrated) {
    pairingsHydrated = (async () => {
      const raw = await SecureStore.getItemAsync(KEY_PAIRINGS);
      pairingsCache = raw ? (JSON.parse(raw) as Pairing[]) : [];
      return pairingsCache;
    })();
  }
  return pairingsHydrated;
}

async function savePairings(list: Pairing[]): Promise<void> {
  // Fresh array ref — `upsertPairing` / `touchPairing` mutate the live cache
  // in place, so without a clone React listeners would see the same reference
  // and bail out of re-rendering.
  pairingsCache = list.slice();
  await SecureStore.setItemAsync(KEY_PAIRINGS, JSON.stringify(pairingsCache));
  for (const fn of pairingListeners) fn();
}

/**
 * Reactive view of the pairing list — mirrors `useBoards` / `useTier`.
 * Consumers re-render on `upsertPairing` / `removePairing` / `touchPairing`.
 */
export function usePairings(): Pairing[] {
  const [pairings, setP] = useState<Pairing[]>(pairingsCache ?? []);
  useEffect(() => {
    let cancelled = false;
    void listPairings().then((ps) => {
      if (!cancelled) setP(ps);
    });
    const fn = (): void => setP(pairingsCache ?? []);
    pairingListeners.add(fn);
    return () => {
      cancelled = true;
      pairingListeners.delete(fn);
    };
  }, []);
  return pairings;
}

/**
 * Single source of truth for the pairing-creation gate. Re-pairing an
 * already-known `pcDeviceId` is always allowed (it's an update — token
 * rotated on the desktop, secret refreshed on the phone), so only a truly
 * new device counts against the free-tier cap.
 */
export function canPairAnother(
  current: Pairing[],
  isPro: boolean,
  newPcDeviceId: string,
): boolean {
  if (isPro) return true;
  if (current.some((p) => p.pcDeviceId === newPcDeviceId)) return true;
  return current.length < MAX_FREE_PAIRINGS;
}

export async function upsertPairing(p: Pairing): Promise<void> {
  const list = await listPairings();
  const idx = list.findIndex((x) => x.pcDeviceId === p.pcDeviceId);
  if (idx >= 0) list[idx] = { ...list[idx], ...p };
  else list.push(p);
  await savePairings(list);
}

export async function removePairing(pcDeviceId: string): Promise<void> {
  const list = (await listPairings()).filter((p) => p.pcDeviceId !== pcDeviceId);
  await savePairings(list);
  await SecureStore.deleteItemAsync(KEY_SECRET_PREFIX + pcDeviceId);
  const active = await getActivePairingId();
  if (active === pcDeviceId) await SecureStore.deleteItemAsync(KEY_ACTIVE);
}

export async function setSharedSecret(pcDeviceId: string, secretBase64: string): Promise<void> {
  await SecureStore.setItemAsync(KEY_SECRET_PREFIX + pcDeviceId, secretBase64);
}

export async function getSharedSecret(pcDeviceId: string): Promise<string | null> {
  return SecureStore.getItemAsync(KEY_SECRET_PREFIX + pcDeviceId);
}

export async function setActivePairingId(pcDeviceId: string): Promise<void> {
  await SecureStore.setItemAsync(KEY_ACTIVE, pcDeviceId);
}

export async function getActivePairingId(): Promise<string | null> {
  return SecureStore.getItemAsync(KEY_ACTIVE);
}

export async function touchPairing(pcDeviceId: string, host: string, port: number): Promise<void> {
  const list = await listPairings();
  const p = list.find((x) => x.pcDeviceId === pcDeviceId);
  if (!p) return;
  p.lastSeenAt = Date.now();
  p.lastHost = host;
  p.lastPort = port;
  await savePairings(list);
}

function bytesToHex(b: Uint8Array): string {
  let s = "";
  for (let i = 0; i < b.length; i++) {
    s += b[i]!.toString(16).padStart(2, "0");
  }
  return s;
}

function bytesToBase64(b: Uint8Array): string {
  // RN/Hermes lacks Buffer; build base64 manually.
  let bin = "";
  for (let i = 0; i < b.length; i++) bin += String.fromCharCode(b[i]!);
  return globalThis.btoa(bin);
}
