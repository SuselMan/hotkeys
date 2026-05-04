/**
 * WebSocket client: pair (one-time) and authenticated runtime connection.
 *
 * Lifecycle:
 *   pair(host, port, token, identity) -> { pcDeviceId, sharedSecret }
 *   connect(host, port, pairing, secret, identity) -> stays open with auto-reconnect
 *
 * Heartbeat: ping every 2s, dead if no pong in 5s. On reconnect we re-do hello.
 */
import { sha256 } from "js-sha256";
import * as Crypto from "expo-crypto";
import {
  PROTOCOL_VERSION,
  type AnyMessage,
  type ClientToServer,
  type KeyCode,
  type PairResponse,
  type ServerToClient,
} from "./protocol";

export type ConnectionStatus =
  | { kind: "idle" }
  | { kind: "connecting" }
  | { kind: "authenticating" }
  | { kind: "online"; pcName: string; sinceTs: number; lastPongMs?: number }
  | { kind: "offline"; error: string; willRetryAt?: number };

export interface ConnectionListener {
  onStatus: (s: ConnectionStatus) => void;
}

export interface ConnectionParams {
  host: string;
  port: number;
  pcDeviceId: string;
  phoneDeviceId: string;
  phoneName: string;
  /** base64-encoded shared secret. */
  sharedSecret: string;
}

const PING_INTERVAL_MS = 2000;
const PONG_TIMEOUT_MS = 5000;
const MAX_BACKOFF_MS = 5000;

export class WsConnection {
  private ws: WebSocket | null = null;
  private status: ConnectionStatus = { kind: "idle" };
  private listeners = new Set<ConnectionListener>();
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private pongWatchdog: ReturnType<typeof setTimeout> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private backoffMs = 250;
  private wantConnected = false;
  private pendingAcks = new Map<string, () => void>();

  constructor(private readonly params: ConnectionParams) {}

  subscribe(l: ConnectionListener): () => void {
    this.listeners.add(l);
    l.onStatus(this.status);
    return () => {
      this.listeners.delete(l);
    };
  }

  start(): void {
    // Idempotent: if we're already running (or a reconnect is pending),
    // a redundant start() — e.g. from a flapping AppState listener —
    // shouldn't open a duplicate socket.
    if (this.wantConnected && (this.ws || this.reconnectTimer)) return;
    this.wantConnected = true;
    this.openSocket();
  }

  stop(): void {
    this.wantConnected = false;
    this.clearTimers();
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        /* ignore */
      }
      this.ws = null;
    }
    this.setStatus({ kind: "idle" });
  }

  press(buttonId: string, keys: KeyCode[]): string {
    const evtId = randomEvtId();
    this.send({ type: "press", evtId, buttonId, keys });
    return evtId;
  }

  release(buttonId: string, evtId: string): void {
    this.send({ type: "release", evtId, buttonId });
  }

  private openSocket(): void {
    this.setStatus({ kind: "connecting" });
    const url = `ws://${this.params.host}:${this.params.port}/`;
    console.warn(`[ws] connecting ${url}`);
    let ws: WebSocket;
    try {
      ws = new WebSocket(url);
    } catch (e) {
      console.warn(`[ws] ctor threw: ${(e as Error).message}`);
      this.scheduleReconnect((e as Error).message);
      return;
    }
    this.ws = ws;

    ws.onopen = () => {
      if (this.ws !== ws) return;
      console.warn(`[ws] open ${url}`);
      this.onOpen();
    };
    ws.onmessage = (e) => {
      if (this.ws !== ws) return;
      this.onMessage(typeof e.data === "string" ? e.data : "");
    };
    ws.onerror = (event: unknown) => {
      // RN does not surface a useful error object on WebSocket errors —
      // log readyState + URL so we can at least see whether the socket
      // ever opened. Reconnect scheduling is driven from onclose only;
      // onerror always precedes onclose for failing sockets, and
      // scheduling here too caused exponential socket fanout on
      // wake-from-sleep (see task 18).
      const message = (event as { message?: string } | null | undefined)?.message ?? "(no message)";
      console.warn(`[ws] error url=${url} readyState=${ws.readyState} msg=${message}`);
    };
    ws.onclose = (e) => {
      console.warn(`[ws] close url=${url} code=${e.code} reason=${e.reason ?? ""}`);
      // Ignore close events from a socket we've already replaced — otherwise
      // a flood of stale closes on resume would each spawn a fresh reconnect.
      if (this.ws !== ws) return;
      this.scheduleReconnect(`closed (${e.code})`, e.code);
    };
  }

  private async onOpen(): Promise<void> {
    this.setStatus({ kind: "authenticating" });
    const nonce = await randomNonce();
    const payload = `${this.params.phoneDeviceId}|${nonce}`;
    const secretBytes = base64ToBytes(this.params.sharedSecret);
    const hmac = hmacSha256Base64(secretBytes, payload);
    console.log(`[ws] hello phoneDeviceId=${this.params.phoneDeviceId.slice(0, 16)}…`);
    this.send({
      type: "hello",
      phoneDeviceId: this.params.phoneDeviceId,
      phoneName: this.params.phoneName,
      nonce,
      hmac,
    });
  }

  private onMessage(raw: string): void {
    let msg: ServerToClient;
    try {
      msg = JSON.parse(raw) as ServerToClient;
    } catch {
      return;
    }

    if (msg.type === "welcome") {
      if (msg.protocolVersion !== PROTOCOL_VERSION) {
        this.setStatus({ kind: "offline", error: "version mismatch" });
        this.ws?.close();
        return;
      }
      this.backoffMs = 250;
      this.setStatus({ kind: "online", pcName: msg.pcName, sinceTs: Date.now() });
      this.startHeartbeat();
      return;
    }
    if (msg.type === "auth_error") {
      this.setStatus({ kind: "offline", error: `auth: ${msg.reason}` });
      this.wantConnected = false;
      this.ws?.close();
      return;
    }
    if (msg.type === "pair_error" || msg.type === "paired") {
      // Pair flow uses a different transient connection — see staticPair() below.
      return;
    }
    if (msg.type === "pong") {
      const cur = this.status;
      if (cur.kind === "online") {
        this.setStatus({ ...cur, lastPongMs: Date.now() - msg.ts });
      }
      this.armPongWatchdog();
      return;
    }
    if (msg.type === "ack") {
      const cb = this.pendingAcks.get(msg.evtId);
      if (cb) {
        this.pendingAcks.delete(msg.evtId);
        cb();
      }
      return;
    }
  }

  private startHeartbeat(): void {
    this.clearHeartbeat();
    this.armPongWatchdog();
    this.pingTimer = setInterval(() => {
      this.send({ type: "ping", ts: Date.now() });
    }, PING_INTERVAL_MS);
  }

  private armPongWatchdog(): void {
    if (this.pongWatchdog) clearTimeout(this.pongWatchdog);
    this.pongWatchdog = setTimeout(() => {
      this.scheduleReconnect("pong timeout");
    }, PONG_TIMEOUT_MS);
  }

  private clearHeartbeat(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    if (this.pongWatchdog) {
      clearTimeout(this.pongWatchdog);
      this.pongWatchdog = null;
    }
  }

  private clearTimers(): void {
    this.clearHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private scheduleReconnect(error: string, closeCode?: number): void {
    this.clearHeartbeat();
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        /* ignore */
      }
      this.ws = null;
    }
    if (!this.wantConnected) return;
    // Idempotent: if a reconnect is already pending, do nothing. The
    // alternative — overwriting reconnectTimer — leaks the prior timeout,
    // which still fires and opens a second socket. With this guard, repeated
    // failure callbacks (or a backlog of close events flushed on resume)
    // collapse to a single reconnect.
    if (this.reconnectTimer) return;
    // Server-initiated clean close (1000) usually means our hello was
    // rejected as a duplicate of an existing connection — back off harder
    // instead of hot-looping.
    if (closeCode === 1000 && this.backoffMs < 1000) {
      this.backoffMs = 1000;
    }
    const willRetryAt = Date.now() + this.backoffMs;
    this.setStatus({ kind: "offline", error, willRetryAt });
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.openSocket();
    }, this.backoffMs);
    this.backoffMs = Math.min(this.backoffMs * 2, MAX_BACKOFF_MS);
  }

  private send(msg: ClientToServer): void {
    if (!this.ws || this.ws.readyState !== 1) return;
    this.ws.send(JSON.stringify(msg satisfies AnyMessage));
  }

  private setStatus(s: ConnectionStatus): void {
    this.status = s;
    for (const l of this.listeners) l.onStatus(s);
  }
}

/**
 * One-shot pairing: open WS, send `pair`, wait for `paired` or `pair_error`.
 * No reconnect, no heartbeat — short-lived.
 */
export function staticPair(opts: {
  host: string;
  port: number;
  pairingToken: string;
  phoneName: string;
  phonePubKey: string;
  timeoutMs?: number;
}): Promise<PairResponse> {
  const url = `ws://${opts.host}:${opts.port}/`;
  console.warn(`[pair] connecting ${url} token=${opts.pairingToken.slice(0, 8)}…`);
  return new Promise<PairResponse>((resolve, reject) => {
    const ws = new WebSocket(url);
    const timeout = setTimeout(() => {
      console.warn(`[pair] timeout url=${url} readyState=${ws.readyState}`);
      try {
        ws.close();
      } catch {
        /* ignore */
      }
      reject(new Error("pair timeout"));
    }, opts.timeoutMs ?? 8000);

    ws.onopen = () => {
      console.warn(`[pair] open ${url}`);
      const msg: ClientToServer = {
        type: "pair",
        pairingToken: opts.pairingToken,
        phoneName: opts.phoneName,
        phonePubKey: opts.phonePubKey,
      };
      ws.send(JSON.stringify(msg));
    };
    ws.onmessage = (e) => {
      const data = typeof e.data === "string" ? e.data : "";
      try {
        const m = JSON.parse(data) as ServerToClient;
        if (m.type === "paired") {
          console.warn(`[pair] paired pcDeviceId=${m.pcDeviceId.slice(0, 8)}… pcName=${m.pcName}`);
          clearTimeout(timeout);
          ws.close();
          resolve(m);
        } else if (m.type === "pair_error") {
          console.warn(`[pair] pair_error reason=${m.reason}`);
          clearTimeout(timeout);
          ws.close();
          reject(new Error(`pair_error: ${m.reason}`));
        }
      } catch {
        /* ignore */
      }
    };
    ws.onerror = (event: unknown) => {
      const message = (event as { message?: string } | null | undefined)?.message ?? "(no message)";
      console.warn(`[pair] error url=${url} readyState=${ws.readyState} msg=${message}`);
      clearTimeout(timeout);
      reject(new Error("socket error"));
    };
    ws.onclose = (e) => {
      console.warn(`[pair] close url=${url} code=${e.code} reason=${e.reason ?? ""}`);
      clearTimeout(timeout);
      reject(new Error(`closed (${e.code})`));
    };
  });
}

function randomEvtId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

async function randomNonce(): Promise<string> {
  const b = await Crypto.getRandomBytesAsync(12);
  let hex = "";
  for (let i = 0; i < b.length; i++) hex += b[i]!.toString(16).padStart(2, "0");
  return hex;
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = globalThis.atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function hmacSha256Base64(key: Uint8Array, msg: string): string {
  const digestHex = sha256.hmac(key, msg);
  // sha256.hmac returns hex; convert hex -> bytes -> base64.
  const bytes = new Uint8Array(digestHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(digestHex.slice(i * 2, i * 2 + 2), 16);
  }
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return globalThis.btoa(bin);
}
