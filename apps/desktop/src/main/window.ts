import { BrowserWindow } from "electron";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const rendererHtml = resolve(here, "../renderer/index.html");
const preloadJs = resolve(here, "../preload/index.js");

let mainWindow: BrowserWindow | null = null;

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

export function showMainWindow(): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 480,
    height: 700,
    show: false,
    title: "kekkeys",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: preloadJs,
    },
  });

  mainWindow.loadFile(rendererHtml);

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  // Hide on close instead of quitting — tray-only app.
  mainWindow.on("close", (e) => {
    if (!isQuittingFlag.value) {
      e.preventDefault();
      mainWindow?.hide();
    }
  });
}

export function broadcast(channel: string, payload: unknown): void {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.webContents.send(channel, payload);
}

export const isQuittingFlag = { value: false };
