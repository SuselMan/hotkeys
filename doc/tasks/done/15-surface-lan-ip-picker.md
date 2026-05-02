# 15 — LAN IP picker for multi-NIC desktops

**Goal:** on Surface and other multi-NIC PCs, the QR must encode the real LAN IP (Wi-Fi 192.168.x.x), not a vEthernet/Hyper-V/WSL adapter. User must also be able to override.

**Bug:** previously `pickLanIp()` returned the first non-internal IPv4 in iteration order. On Surface with WSL/Hyper-V the first one was often `vEthernet (…) 172.x.x.x` — phone routed it to itself, silent TCP drop, 8 s `pair timeout`.

## What was delivered

### `apps/desktop/src/main/pair-info.ts`
- `listLanCandidates()` returns every non-internal IPv4 with a score.
- Scoring (in `scoreCandidate`):
  - `vEthernet|Hyper-?V|WSL|VirtualBox|VMware|TAP|Loopback|Bluetooth|VPN|Tailscale|ZeroTier|Docker` → −100
  - `^(Wi-?Fi|Ethernet|en\d|wlan\d|eth\d)` → +50
  - RFC1918 (10/8, 172.16/12, 192.168/16) → +20
  - APIPA `169.254.x.x` → −200
- `pickHost()` uses the saved `preferredLanIp` if it's still in the candidate list, else the top-scored candidate, else null.
- Localized Windows adapter names (e.g. Russian "Беспроводная сеть") don't match the `^(Wi-Fi|Ethernet|…)` boost but still beat vEthernet via the −100 vs +20 (RFC1918) gap.

### `apps/desktop/src/main/state.ts`
- New `preferredLanIp?: string` on `PersistedState`.
- `getPreferredLanIp()` / `setPreferredLanIp(addr | null)`. Passing `null` deletes the field — back to Auto.

### `apps/desktop/src/main/ipc.ts` + `apps/desktop/src/preload/index.ts`
- `kekkeys:list-lan-candidates` → `{ candidates: { iface, address }[], preferred: string | null }` (sorted by score desc).
- `kekkeys:set-preferred-host` → accepts `string | null`.
- Preload exposes `listLanCandidates()` and `setPreferredHost(addr)`.

### `apps/desktop/src/renderer/`
- `index.html` — `<select id="lan-select">` row under the QR-host hint.
- `renderer.js`:
  - `refreshLanCandidates(currentHost)` populates the select with `Auto` + every candidate as `iface · address`.
  - When no preference is saved, the Auto option's label includes the auto-picked IP, so the dropdown still reflects what the QR encodes.
  - On change → `setPreferredHost(value || null)` → `refreshQr()`.
  - If a saved preferred IP is no longer in the candidate list (adapter was disabled), the renderer falls back to Auto rather than showing a phantom value.
- `styles.css` — `.lan-row` flex layout, dark-themed select.

## Acceptance test (manual, on Surface)

1. Surface with WSL/Hyper-V active. Run kekkeys → QR's host shows the WiFi 192.168.x.x by default. ✅ confirmed by user.
2. Open the LAN-address dropdown — every adapter is listed, `iface · address` format.
3. Pick a vEthernet 172.x.x.x → QR regenerates → pair from phone fails with `pair timeout` after 8 s (sanity check that the dropdown actually drives the QR).
4. Pick Auto → QR regenerates with WiFi IP → pair succeeds.
5. Restart kekkeys with a manual override active → QR still encodes the override on launch (persisted via `state.json`).

## Notes / follow-ups

- Scoring is heuristic. If a future user has an unusual setup (e.g. only Ethernet without "Ethernet" in the name and a public IP), they can override via the dropdown.
- The dropdown currently regenerates the QR token on each change (because `buildPairInfo` mints a new one). Acceptable — pairing UX isn't time-sensitive — but if it becomes annoying we can split "regen QR image" from "regen token".
