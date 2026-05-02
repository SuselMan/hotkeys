import { ipcMain } from "electron";
import { buildPairInfo, listLanCandidates } from "./pair-info.js";
import { forgetPaired, getPreferredLanIp, listPaired, setPreferredLanIp } from "./state.js";
import { broadcast } from "./window.js";

interface RuntimeStatus {
  connected: boolean;
  activeClientName?: string;
}

let lastStatus: RuntimeStatus = { connected: false };

export function registerIpcHandlers(): void {
  ipcMain.handle("kekkeys:refresh-pair-info", () => buildPairInfo());

  ipcMain.handle("kekkeys:list-paired", () => listPaired());

  ipcMain.handle("kekkeys:forget-paired", async (_e, phoneDeviceId: string) => {
    await forgetPaired(phoneDeviceId);
    broadcast("kekkeys:pairings-changed", null);
  });

  ipcMain.handle("kekkeys:connection-status", (): RuntimeStatus => lastStatus);

  ipcMain.handle("kekkeys:list-lan-candidates", async () => ({
    candidates: listLanCandidates().map(({ iface, address }) => ({ iface, address })),
    preferred: await getPreferredLanIp(),
  }));

  ipcMain.handle("kekkeys:set-preferred-host", async (_e, addr: string | null) => {
    await setPreferredLanIp(addr);
  });
}

export function setConnectionStatus(s: RuntimeStatus): void {
  lastStatus = s;
  broadcast("kekkeys:connection-status", s);
}

export function notifyPairingsChanged(): void {
  broadcast("kekkeys:pairings-changed", null);
}
