# 18 — Reconnect storm after PC wakes from sleep

**Bug:** when the desktop goes to sleep with the phone still connected and then wakes, the mobile app enters a runaway reconnect loop — opens dozens of WebSockets per second to the desktop and never settles.

Evidence: `doc/tasks/todo/18-reconnect-storm-after-sleep-logs.txt` (dump from a real session — keep in `done/` after the fix). Pattern is unmistakable:

```
14:32:41.804  close code=1006 reason=failed to connect ... after 10000ms   ×4   ← pre-sleep sockets time out on wake
14:32:42.088  connecting ws://192.168.1.87:41234/                          ×~100 over 60ms ← avalanche
14:32:42.452  error ... + close code=1006 (Failed to connect)              ×many   ← OS rejects most
... cycle repeats ...
14:33:11      still connecting/opening/closing every ~250 ms with overlapping sockets
```

Roughly **100 WebSocket attempts in the first 60 ms after wake**, then a steady-state of 2–4 overlapping sockets cycling at ~1.5 s each for the remaining 30 s of the log. The phone never reaches a stable single connection.

## Root cause

`apps/mobile/src/net.ts` schedules reconnects from **both** `onerror` and `onclose`:

```ts
// net.ts:115
ws.onerror = () => { ...; this.scheduleReconnect("socket error"); };
// net.ts:123
ws.onclose = (e) => { ...; this.scheduleReconnect(`closed (${e.code})`); };
```

For a socket that fails to connect (the common case here), the platform fires `onerror` and then `onclose` back-to-back. Each call into `scheduleReconnect`:

```ts
// net.ts:226
private scheduleReconnect(error: string): void {
  this.clearHeartbeat();
  if (this.ws) { try { this.ws.close(); } catch {} this.ws = null; }
  if (!this.wantConnected) return;
  ...
  this.reconnectTimer = setTimeout(() => this.openSocket(), this.backoffMs); // ← overwrites without clearTimeout
  this.backoffMs = Math.min(this.backoffMs * 2, MAX_BACKOFF_MS);
}
```

Two compounding bugs:

1. **`reconnectTimer` is reassigned without clearing the prior timer.** The first scheduleReconnect (from `onerror`) sets a setTimeout, the second (from `onclose`) overwrites the field but the original setTimeout is still queued in the event loop and fires on schedule. Net effect: every failing socket spawns **2** reconnects.
2. **No deduping of failure events.** A 1006 close after our own `this.ws.close()` re-enters scheduleReconnect a third time on some platforms, and stale sockets from before sleep all flush their `close` events when JS resumes.

So one failure during sleep → 2 reconnects on wake → each fails → 4 → 8 → 16 → 32 → 64 → ~128. That matches the ~100-attempt burst in the log within ~60 ms.

The reason you don't see this in normal use is the `welcome` handler resets `backoffMs = 250` (line 159) — but only on a *successful* hello. While the network is briefly broken on wake the welcomes never arrive, so the doubling runs unchecked.

There's also a secondary issue: even after one socket succeeds, server-side dedup (it closes the older duplicate connection from the same `phoneDeviceId` with code 1000) is treated as a normal close on the client and triggers another reconnect, which keeps the cycle going.

## Fix

Three things, smallest first:

1. **Drive reconnects from `onclose` only.** `onerror` always precedes `onclose` for failing sockets — keep the warn log there, drop the `scheduleReconnect` call. (`net.ts:121`)
2. **Make `scheduleReconnect` idempotent.** Early-return if `this.reconnectTimer` is already set, OR `clearTimeout(this.reconnectTimer)` before reassigning. The early-return form is safer because it avoids restarting backoff on duplicate calls.
3. **Tag sockets with a generation counter.** When `onclose` fires, only schedule a reconnect if the closing socket is still the "current" one (`ws === this.ws` after assignment, or via a per-socket id). This makes stale-socket close events from before the most recent connect cycle harmless. Important defense against the avalanche on wake.

Optional — recommended on top of the three above:

4. **Pause WS while app is backgrounded / device idle.** Hook React Native's `AppState` listener: on `background` call `stop()`, on `active` call `start()`. This sidesteps the queued-event-flood-on-wake category of issues entirely. The desktop `WsConnection` will see a clean close and the phone will resume with a fresh single socket. (Worth it because Android Doze produces similar symptoms even without desktop sleep.)
5. **Treat server-initiated `code=1000` close as terminal-with-backoff, not instant retry.** If the server closed us cleanly, it usually means our hello was rejected as a duplicate — slow down. Cap `backoffMs` floor to e.g. 1000 ms when reconnecting after a 1000.

## Acceptance test (manual)

1. Pair phone, run a board, confirm online.
2. Sleep the desktop (Win+X → Shut down → Sleep), wait 30 s, wake it.
3. **Expected:** phone shows offline → reconnects within a few seconds → settles on a single online socket. The log shows ≤ 5 `connecting` lines from the moment of wake to steady state, *not* dozens.
4. Run a board, press a button — keypress fires on PC.
5. Repeat sleep/wake 3× to make sure backoff doesn't accumulate weirdly across cycles.
6. With phone screen off / app backgrounded for 10 minutes, bring it forward — same expectation: reconnects cleanly without a burst.

## Out of scope

- Server-side dedup logic itself — current behavior of closing older duplicate connections is fine; client just needs to handle the close gracefully.
- Switching to a heartbeat-driven explicit reconnect protocol (out of MVP scope, but if (4) above doesn't fully solve it on Android Doze, revisit).
