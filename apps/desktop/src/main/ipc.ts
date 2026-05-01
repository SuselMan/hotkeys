import { ipcMain } from "electron";
import { buildPairInfo } from "./pair-info.js";
import { forgetPaired, listPaired } from "./state.js";
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
}

export function setConnectionStatus(s: RuntimeStatus): void {
  lastStatus = s;
  broadcast("kekkeys:connection-status", s);
}

export function notifyPairingsChanged(): void {
  broadcast("kekkeys:pairings-changed", null);
}
