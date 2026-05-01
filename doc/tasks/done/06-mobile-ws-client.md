# 06 — Mobile WS client + manual pairing

**Goal:** mobile can pair with a desktop and stay connected over WS, with auto-reconnect and heartbeat.

## What was delivered

### Protocol mirroring
- `apps/mobile/src/protocol.ts` — self-contained mirror of `packages/protocol`.
- `apps/mobile/scripts/sync-protocol.mjs` — generator that pulls source files from the workspace package, strips ESM-only imports, and writes a single TS module. Run with `node scripts/sync-protocol.mjs` from `apps/mobile`.
- Reason for the copy: Metro doesn't follow ESM symlinks across the workspace boundary cleanly.

### Storage
- `src/storage.ts` — wraps `expo-secure-store`.
- `getOrCreateIdentity` returns a stable `phoneDeviceId` (16 random bytes hex) + `phonePubKey` (32 random bytes base64) generated once on first launch.
- Pairings list is persisted as JSON; per-PC shared secret stored under a separate key prefix.
- `setActivePairingId` / `getActivePairingId` for the resume-on-launch flow.

### WS client (`src/net.ts`)
- `WsConnection` class with state-machine status: `idle` / `connecting` / `authenticating` / `online` / `offline`.
- Sends `hello` with HMAC-SHA256(`phoneDeviceId|nonce`, sharedSecret) on each open; `js-sha256` for the HMAC, `expo-crypto` for the nonce.
- Heartbeat: ping every 2 s, dead if no pong in 5 s.
- Auto-reconnect with exponential backoff (250 ms → 5 s cap).
- `press(buttonId, keys)` / `release(buttonId, evtId)` for runtime mode.
- `staticPair()` — one-shot WS pairing (open, send `pair`, await `paired`, close), used by the manual pair UI.

### Connection facade (`src/connection.ts`)
- Singleton wrapping a single live `WsConnection`.
- `useConnectionStatus()` React hook.
- `tryResume()` reads `activePairingId` + last known host/port and restarts on app launch.

### UI
- `ConnectScreen` rewritten:
  - Live status badge (idle / connecting / online with pong RTT / offline with reason).
  - Paired-PCs list with Connect / Forget per row.
  - Manual pair form (host / port / token) — replaces QR until #07 lands.

### Desktop side
- New tray menu item **"Copy fresh pair token"** generates a token, picks a LAN IP via `os.networkInterfaces()`, and copies `host port token` to the clipboard. A toast confirms the copy.

## How to test end-to-end

1. `npm run dev:desktop` — Electron tray app starts, WS server logs `[ws] listening on 41234`.
2. Right-click tray → **Copy fresh pair token**. The notification shows the host, port, and first bytes of the token.
3. `cd apps/mobile && npx expo start`. Open in Expo Go on a phone on the same WiFi.
4. Connect tab → Manual pair → paste host, port, token → Pair.
5. Status badge flips to `online · <pcName> · NN ms`. Desktop logs `[app] client connected: kekkeys phone`.
6. Toggle WiFi off → status flips to `offline · pong timeout`, then reconnects when WiFi returns.

## Open follow-ups

- Real QR scanning UI on mobile + QR rendering on desktop renderer — task #07.
- Zeroconf-based auto-discovery — needs `expo-dev-client`, will fold into a later task.
- `press`/`release` are exposed but not used yet — wired in tasks #09 and #10.
