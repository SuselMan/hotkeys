/**
 * Singleton connection facade — keeps one WsConnection alive across screens
 * and exposes a hook for components.
 */
import { useEffect, useState } from "react";
import { WsConnection, type ConnectionParams, type ConnectionStatus } from "./net";
import {
  getActivePairingId,
  getOrCreateIdentity,
  getSharedSecret,
  listPairings,
  setActivePairingId,
  touchPairing,
} from "./storage";

let current: WsConnection | null = null;
let currentParams: ConnectionParams | null = null;
let lastStatus: ConnectionStatus = { kind: "idle" };
const subs = new Set<(s: ConnectionStatus) => void>();

function emit(s: ConnectionStatus): void {
  lastStatus = s;
  for (const cb of subs) cb(s);
}

export function getStatus(): ConnectionStatus {
  return lastStatus;
}

export function getParams(): ConnectionParams | null {
  return currentParams;
}

export async function activatePairing(pcDeviceId: string, host: string, port: number): Promise<void> {
  const identity = await getOrCreateIdentity(defaultPhoneName());
  const secret = await getSharedSecret(pcDeviceId);
  if (!secret) throw new Error("no shared secret for this PC — repair needed");

  if (current) current.stop();
  currentParams = {
    host,
    port,
    pcDeviceId,
    phoneDeviceId: identity.phoneDeviceId,
    phoneName: identity.phoneName,
    sharedSecret: secret,
  };
  current = new WsConnection(currentParams);
  current.subscribe({
    onStatus: (s) => {
      emit(s);
      if (s.kind === "online") {
        void touchPairing(pcDeviceId, host, port);
      }
    },
  });
  await setActivePairingId(pcDeviceId);
  current.start();
}

export function disconnect(): void {
  if (current) {
    current.stop();
    current = null;
    currentParams = null;
  }
  emit({ kind: "idle" });
}

export function press(buttonId: string, keys: string[]): string | null {
  return current?.press(buttonId, keys) ?? null;
}

export function release(buttonId: string, evtId: string): void {
  current?.release(buttonId, evtId);
}

export function useConnectionStatus(): ConnectionStatus {
  const [s, setS] = useState<ConnectionStatus>(lastStatus);
  useEffect(() => {
    const fn = (next: ConnectionStatus): void => setS(next);
    subs.add(fn);
    return () => {
      subs.delete(fn);
    };
  }, []);
  return s;
}

/**
 * Try to restart the previously active pairing on app launch — common case.
 */
export async function tryResume(): Promise<boolean> {
  const activeId = await getActivePairingId();
  if (!activeId) return false;
  const list = await listPairings();
  const p = list.find((x) => x.pcDeviceId === activeId);
  if (!p || !p.lastHost || !p.lastPort) return false;
  try {
    await activatePairing(activeId, p.lastHost, p.lastPort);
    return true;
  } catch {
    return false;
  }
}

function defaultPhoneName(): string {
  return "kekkeys phone";
}
