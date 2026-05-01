# 07 — QR pairing flow

**Goal:** first-time pairing without typing IPs. Desktop shows QR, phone scans, both sides persist secret.

## What was delivered

### Desktop
- `qrcode` npm package added; `src/main/pair-info.ts` builds a `PairInfo` payload — picks LAN IPv4 via `os.networkInterfaces()`, generates a fresh pairing token, encodes `kekkeys://pair?host=…&port=…&token=…&pcId=…&pcName=…` and renders a 320 px PNG data URL.
- `src/preload/index.ts` — preload script exposes a typed `window.kekkeys` API (`refreshPairInfo`, `listPaired`, `forgetPaired`, `getConnectionStatus`, `onConnectionChanged`, `onPairingsChanged`).
- `src/main/ipc.ts` — `ipcMain.handle` for each channel. `setConnectionStatus` and `notifyPairingsChanged` push events to the renderer via `webContents.send`.
- `tsconfig.preload.json` builds preload as CommonJS (Electron's preload context isn't ESM yet) into `dist/preload/`.
- Window now sets `webPreferences.preload`. CSP relaxed to `img-src 'self' data:` so the QR PNG renders.
- Renderer (`renderer.js`) calls `refreshPairInfo`, swaps in the QR `<img>`, prints `host:port · pcName` underneath, refreshes every 4 minutes (1 min before token TTL), live-updates connection badge and paired list on IPC events.

### Mobile
- `expo-camera` added with config-plugin entry in `app.json` (custom permission strings).
- `src/screens/ScanScreen.tsx` — full-screen `<CameraView>` with `barcodeScannerSettings={{ barcodeTypes: ["qr"] }}`. Permission flow handled via `useCameraPermissions`. Parses `kekkeys://pair?…`, calls `staticPair`, persists `Pairing` + secret, activates the connection. Re-armable on error.
- `App.tsx` — `scanning` state takes over the screen and hides the tabbar while scanning.
- `ConnectScreen` — added "Scan QR" CTA on top of the "Manual pair (dev)" form, calling the parent's `onScanRequest`.

## Acceptance test (manual, on real hardware)

1. Cold install on PC, cold install on phone, same WiFi.
2. PC → kekkeys window opens with QR + `host:port · pcName`.
3. Phone → Connect → Scan QR → grant camera → point at PC screen.
4. Within ~1 s the phone status badge becomes `online · <pcName>` and the PC's "Paired phones" list shows the phone.
5. Restart phone → on launch it auto-resumes the active pairing, no QR needed.
6. Wait > 5 min, scan a stale QR → phone shows `pair_error: token_expired`. Refreshing the desktop window (or letting the 4-min timer fire) regenerates the QR.

## Open caveats

- LAN IP heuristic picks the first non-internal IPv4. With multiple active interfaces (WiFi + Ethernet + VPN) this can be wrong; QR might encode an unreachable address. The renderer surfaces the picked IP in the hint line so the user can spot it. Future work: let the user pick from a dropdown.
- Pairing happens over plaintext WS on LAN. After pairing the connection is HMAC-authenticated but still plaintext; for v1 this is acceptable (no sensitive data, only key events). TLS via self-signed cert is a v2 follow-up.
- mDNS-driven auto-discovery still pending — needs a custom dev client.
