import { app, clipboard, Menu, Notification, Tray } from "electron";
import { networkInterfaces } from "node:os";
import { makeTrayIcon } from "./icon.js";
import { createPairingToken, getPcIdentity } from "./state.js";
import { isQuittingFlag, showMainWindow } from "./window.js";

let tray: Tray | null = null;

export function createTray(): void {
  tray = new Tray(makeTrayIcon());
  tray.setToolTip("kekkeys");

  const menu = Menu.buildFromTemplate([
    { label: "Open", click: showMainWindow },
    {
      label: "Copy fresh pair token",
      click: async () => {
        const token = createPairingToken();
        const { port } = await getPcIdentity();
        const ip = pickLanIp();
        const payload = ip ? `${ip} ${port} ${token}` : token;
        clipboard.writeText(payload);
        new Notification({
          title: "kekkeys",
          body: ip
            ? `Copied: host=${ip} port=${port} token=${token.slice(0, 8)}…`
            : `Copied token ${token.slice(0, 8)}… (could not detect LAN IP)`,
          silent: true,
        }).show();
      },
    },
    { type: "separator" },
    {
      label: "Auto-start with Windows",
      type: "checkbox",
      checked: app.getLoginItemSettings().openAtLogin,
      click: (item) => {
        app.setLoginItemSettings({ openAtLogin: item.checked });
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        isQuittingFlag.value = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(menu);
  tray.on("click", showMainWindow);
}

function pickLanIp(): string | null {
  const ifaces = networkInterfaces();
  for (const list of Object.values(ifaces)) {
    if (!list) continue;
    for (const i of list) {
      if (i.family === "IPv4" && !i.internal) return i.address;
    }
  }
  return null;
}
