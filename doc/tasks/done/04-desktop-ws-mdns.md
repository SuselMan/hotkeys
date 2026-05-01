# 04 — Desktop WS server + mDNS + persistent state

**Goal:** desktop accepts WS connections, advertises itself over mDNS, persists pairings.

## What was delivered

- `state.ts` — JSON state in `app.getPath("userData")/state.json`.
  - `pcDeviceId` (UUID), `pcName` (`COMPUTERNAME`), `serverPort`, `pairedDevices[]`.
  - `sharedSecret` encrypted via `safeStorage` (Windows DPAPI). Plaintext fallback if unavailable (dev builds without keychain).
  - One-time pairing tokens — in-memory Map, 5-min TTL, sweep on each new token.
- `server.ts` — `ws` WebSocketServer on `0.0.0.0:41234`.
  - Port fallback: tries 20 ports starting from preferred.
  - `handlePair` → consume token, generate 32-byte sharedSecret, persist with `phoneDeviceId = sha256(phonePubKey)`.
  - `handleHello` → recompute HMAC-SHA256(`phoneDeviceId|nonce`), timing-safe compare.
  - `press`/`release` → ack, update last-seen, log button id.
  - Heartbeat watchdog (1.5 s tick): drop clients silent for 5+ s.
- `discovery.ts` — `bonjour-service` advertising `_kekkeys._tcp.local` with TXT.
- `index.ts` wires everything in `app.whenReady`. On `before-quit` stops mDNS and WS.

## Open follow-ups

- Key injection on press/release events — see #08.
- Renderer doesn't yet show real connection state — wire IPC in #07 alongside QR.
- Disconnect should flush held keys via reference counting — needs #08 to be wired.
