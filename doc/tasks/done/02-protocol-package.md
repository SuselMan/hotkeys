# 02 — Shared protocol package

**Goal:** single source of truth for WS message types and key-code names, importable from desktop and mobile.

## What was delivered

`packages/protocol`:
- `keycodes.ts` — `KeyCode` (W3C UI Events `code` values), `Modifiers` array, `isModifier` type-guard.
- `messages.ts` — `PROTOCOL_VERSION = 1`, message types:
  - `pair` / `paired` / `pair_error`
  - `hello` / `welcome` / `auth_error`
  - `press` / `release` / `ack`
  - `ping` / `pong`
  - `state`
  - Discriminated unions: `ClientToServer`, `ServerToClient`, `AnyMessage`.
- `service.ts` — `MDNS_SERVICE_TYPE = "kekkeys"`, `MdnsTxt` shape (`deviceId`, `name`, `v`).
- Builds to `dist/` with declarations + sourcemaps.

## Notes

- Package is ESM only. Desktop main process is also ESM (Electron 33).
- For mobile, the package is referenced via a `file:` dep in apps/mobile when WS client lands (#6).
