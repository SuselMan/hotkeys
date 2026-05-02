import { contextBridge, ipcRenderer } from "electron";

export interface PairInfoFromMain {
  host: string | null;
  port: number;
  pcName: string;
  pcDeviceId: string;
  token: string;
  tokenTtlMs: number;
  /** kekkeys://pair?... */
  qrPayload: string;
  /** PNG data URL of the QR image. */
  qrDataUrl: string;
}

export interface PairedItem {
  phoneDeviceId: string;
  phoneName: string;
  pairedAt: number;
  lastSeenAt?: number;
}

export interface ConnectionStatusFromMain {
  connected: boolean;
  activeClientName?: string;
}

export interface LanCandidateFromMain {
  iface: string;
  address: string;
}

export interface LanCandidatesPayload {
  candidates: LanCandidateFromMain[];
  preferred: string | null;
}

const api = {
  refreshPairInfo: (): Promise<PairInfoFromMain> => ipcRenderer.invoke("kekkeys:refresh-pair-info"),
  listPaired: (): Promise<PairedItem[]> => ipcRenderer.invoke("kekkeys:list-paired"),
  forgetPaired: (phoneDeviceId: string): Promise<void> =>
    ipcRenderer.invoke("kekkeys:forget-paired", phoneDeviceId),
  getConnectionStatus: (): Promise<ConnectionStatusFromMain> =>
    ipcRenderer.invoke("kekkeys:connection-status"),
  listLanCandidates: (): Promise<LanCandidatesPayload> =>
    ipcRenderer.invoke("kekkeys:list-lan-candidates"),
  setPreferredHost: (addr: string | null): Promise<void> =>
    ipcRenderer.invoke("kekkeys:set-preferred-host", addr),
  onConnectionChanged: (cb: (s: ConnectionStatusFromMain) => void): (() => void) => {
    const listener = (_e: unknown, s: ConnectionStatusFromMain): void => cb(s);
    ipcRenderer.on("kekkeys:connection-status", listener);
    return () => ipcRenderer.removeListener("kekkeys:connection-status", listener);
  },
  onPairingsChanged: (cb: () => void): (() => void) => {
    const listener = (): void => cb();
    ipcRenderer.on("kekkeys:pairings-changed", listener);
    return () => ipcRenderer.removeListener("kekkeys:pairings-changed", listener);
  },
};

contextBridge.exposeInMainWorld("kekkeys", api);

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    kekkeys: typeof api;
  }
}
