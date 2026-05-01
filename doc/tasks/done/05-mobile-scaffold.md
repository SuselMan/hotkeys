# 05 — Mobile scaffold (Expo + skeleton screens)

**Goal:** runnable Expo app branded as kekkeys, with placeholder screens reachable via tabbar.

## What was delivered

`apps/mobile` (Expo SDK 54, RN 0.81, new architecture enabled):
- `app.json` — name `kekkeys`, slug `kekkeys`, scheme `kekkeys`, dark UI style, both orientations, package `com.kekkeys.app`. Permissions declared: `CAMERA`, `INTERNET`, `ACCESS_WIFI_STATE`, `ACCESS_NETWORK_STATE`, `VIBRATE`.
- `App.tsx` — bottom tabbar with three tabs (Connect / Boards / Settings), state-machine routing (no extra deps). Dark theme with `#fadc50` accent.
- `src/screens/{Connect,Boards,Settings}Screen.tsx` — placeholders.
- Type-checks clean (`tsc --noEmit`).

## Notes

- Mobile is OUTSIDE the workspaces glob; deps installed locally (`apps/mobile/node_modules`).
- Real navigation lib (react-navigation) deferred — current state-switcher is good enough until screen count grows.
