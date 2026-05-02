# 14 — APK pairing blocked by Android network security policy

**Goal:** APK release build pairs over LAN; in-app diagnostics for future field issues.

**Bug:** APK pairing failed immediately with `Error: socket error`. Same phone on Expo Go dev build paired fine — only the APK release build broke.

## Root cause

Confirmed by the in-app log shipped earlier this task — `kekkeys-logs-2026-05-02T06-00-08-310Z.txt` (kept in `done/` as evidence) shows:

```
[pair] connecting ws://192.168.1.70:41234/ token=18fea4d6…
[pair] error url=ws://192.168.1.70:41234/ readyState=3 msg=(no message)
[pair] close url=ws://192.168.1.70:41234/ code=1006
        reason=CLEARTEXT communication to 192.168.1.70 not permitted by network security policy
```

So Android was blocking cleartext to a private IP **despite** `android.usesCleartextTraffic: true` in `app.json`. That manifest attribute was being overridden by a `network_security_config.xml` shipped inside the EAS-built APK (the NSC always wins over the manifest flag). Most likely the default RN/Expo NSC for SDK 54 + `newArchEnabled: true`, which permits cleartext only to localhost.

## What was delivered

### In-app logger (`apps/mobile/src/logger.ts`)

- Patches `console.{log,warn,error,info}` and mirrors every call into `${cacheDirectory}/kekkeys.log`.
- Rotating, 256 KB cap. Loads previous-session history on start so logs span restarts.
- `installLogger()` is the first import in `apps/mobile/index.tsx` so it captures i18n init and any module-load warnings.
- Public surface: `getLogPath()`, `getLogSize()`, `clearLogs()`.

### Export from Settings

- `apps/mobile/src/backup.ts` — new `exportLogs()` copies the log to `kekkeys-logs-<ISO>.txt` and shells out to the system share sheet via `expo-sharing`. If the file is empty, throws `"no logs yet"` so the UI can show a friendly "No logs" alert.
- `apps/mobile/src/screens/SettingsScreen.tsx` — new **Diagnostics** section with **Export logs** + **Clear logs** (Clear is confirm-gated).
- i18n keys (`diagnosticsLabel`, `exportLogsBtn`, `clearLogsBtn`, `logsEmptyTitle/Body`, `clearLogsConfirmTitle/Body`) in both `en.ts` and `ru.ts`.

### Diagnostic logging in the WS code

`apps/mobile/src/net.ts` — `console.warn` lines in `staticPair` and `WsConnection.openSocket`:
- `[pair] connecting <url> token=<8 chars>`
- `[pair] open <url>` on socket open
- `[pair] paired pcDeviceId=…` on success
- `[pair] error url=<url> readyState=<n>` on `onerror`
- `[pair] close url=<url> code=<n> reason=<…>` on `onclose`
- `[pair] timeout url=<url> readyState=<n>` on the 8 s timeout

The `readyState` distinction is what tells "platform refused" (3) from "stuck connecting" (0) and from "connected but no response" (1).

### The actual fix — `expo-build-properties` with cleartext

`apps/mobile/package.json` — added `expo-build-properties` (~1.0.10).

`apps/mobile/app.json` — registered the plugin with `android.usesCleartextTraffic: true`:

```json
[
  "expo-build-properties",
  { "android": { "usesCleartextTraffic": true } }
]
```

This plugin emits its own `network_security_config.xml` and wires it into the manifest, overriding the RN default:

```xml
<network-security-config>
  <base-config cleartextTrafficPermitted="true">
    <trust-anchors>
      <certificates src="system" />
    </trust-anchors>
  </base-config>
</network-security-config>
```

`<base-config>` applies to all destinations including raw IPs. The top-level `android.usesCleartextTraffic: true` in `app.json` is now redundant but kept as belt-and-suspenders.

## Acceptance

- Built fresh APK via `eas build --profile preview --platform android`, installed, paired. ✅ confirmed by user.
- Diagnostics infra stays in tree — useful for the next field issue.

## Notes / follow-ups

- Future TLS-over-WS migration would let us drop `usesCleartextTraffic` entirely. Not in MVP scope.
- The kept log file (`kekkeys-logs-2026-05-02T06-00-08-310Z.txt`) is ~50 KB; if the `done/` directory grows, we can trim or move evidence files elsewhere.
- `transform-remove-console` is not enabled in our babel config, so `console.warn` survives in release builds. If we ever turn it on, switch the diagnostic lines to a non-console log API.
