import { app } from "electron";
import { PROTOCOL_VERSION } from "@kekkeys/protocol";
import { startMdns, stopMdns } from "./discovery.js";
import {
  flushAll,
  initInjector,
  injectorPress,
  injectorRelease,
  injectorReady,
} from "./injector.js";
import { notifyPairingsChanged, registerIpcHandlers, setConnectionStatus } from "./ipc.js";
import { startServer, stopServer } from "./server.js";
import { createTray } from "./tray.js";
import { showMainWindow } from "./window.js";

// Tray-only app — no dock icon on macOS, no taskbar entry visible without window.
app.setName("kekkeys");

if (process.platform === "darwin") {
  app.dock?.hide();
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
}

app.whenReady().then(async () => {
  registerIpcHandlers();
  createTray();
  showMainWindow();

  initInjector();
  if (!injectorReady()) {
    console.warn("[app] running without key injection — phone presses will be logged only");
  }

  const { port, pcDeviceId, pcName } = await startServer({
    onClientConnected: (name) => {
      console.log(`[app] client connected: ${name}`);
      setConnectionStatus({ connected: true, activeClientName: name });
      notifyPairingsChanged();
    },
    onClientDisconnected: (name) => {
      console.log(`[app] client disconnected: ${name}`);
      setConnectionStatus({ connected: false });
    },
    onPress: (keys, buttonId, clientId) => {
      console.log(`[app] press btn=${buttonId.slice(0, 8)} client=${clientId.slice(0, 8)} keys=${keys.join("+")}`);
      injectorPress(keys);
    },
    onRelease: (keys, buttonId, clientId) => {
      console.log(`[app] release btn=${buttonId.slice(0, 8)} client=${clientId.slice(0, 8)} keys=${keys.join("+")}`);
      injectorRelease(keys);
    },
  });

  startMdns({ name: pcName, port, deviceId: pcDeviceId, protocolVersion: PROTOCOL_VERSION });
});

app.on("second-instance", () => {
  showMainWindow();
});

app.on("window-all-closed", () => {
  // Tray-only — keep the app alive when the window is closed.
});

app.on("before-quit", () => {
  stopMdns();
  stopServer();
  flushAll();
});
