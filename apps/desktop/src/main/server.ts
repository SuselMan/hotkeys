import { createHash, createHmac, randomBytes } from "node:crypto";
import { WebSocketServer, WebSocket } from "ws";
import {
  PROTOCOL_VERSION,
  type AnyMessage,
  type ClientToServer,
  type KeyCode,
  type ServerToClient,
} from "@kekkeys/protocol";
import {
  addPaired,
  consumePairingToken,
  getPcIdentity,
  getSharedSecret,
  setServerPort,
  touchPairedSeen,
} from "./state.js";

interface AuthedClient {
  ws: WebSocket;
  phoneDeviceId: string;
  phoneName: string;
  /** Last time we received any traffic — used by the heartbeat watchdog. */
  lastSeenAt: number;
  /** Buttons currently held by this client → the W3C codes their press emitted. */
  heldButtons: Map<string, KeyCode[]>;
}

let wss: WebSocketServer | null = null;
const authed = new Set<AuthedClient>();

export interface ServerEvents {
  onPress?: (keys: KeyCode[], buttonId: string, clientId: string) => void;
  onRelease?: (keys: KeyCode[], buttonId: string, clientId: string) => void;
  onClientConnected?: (name: string) => void;
  onClientDisconnected?: (name: string) => void;
}

export async function startServer(events: ServerEvents = {}): Promise<{ port: number; pcDeviceId: string; pcName: string }> {
  const { pcDeviceId, pcName, port: preferredPort } = await getPcIdentity();
  const port = await listenWithFallback(preferredPort);
  if (port !== preferredPort) await setServerPort(port);

  // Heartbeat watchdog: if a client hasn't pinged for >5s, drop it and flush keys.
  const HEARTBEAT_TIMEOUT_MS = 5000;
  setInterval(() => {
    const now = Date.now();
    for (const c of authed) {
      if (now - c.lastSeenAt > HEARTBEAT_TIMEOUT_MS) {
        console.warn(`[ws] heartbeat timeout for ${c.phoneName}, dropping`);
        try {
          c.ws.terminate();
        } catch {
          /* ignore */
        }
      }
    }
  }, 1500).unref();

  return { port, pcDeviceId, pcName };

  async function listenWithFallback(start: number): Promise<number> {
    for (let p = start; p < start + 20; p++) {
      try {
        await new Promise<void>((resolve, reject) => {
          const server = new WebSocketServer({ port: p, host: "0.0.0.0" });
          server.once("listening", () => {
            wss = server;
            wireServer(server, events);
            resolve();
          });
          server.once("error", (err) => {
            server.close();
            reject(err);
          });
        });
        console.log(`[ws] listening on ${p}`);
        return p;
      } catch (err) {
        const code = (err as NodeJS.ErrnoException).code;
        if (code === "EADDRINUSE") continue;
        throw err;
      }
    }
    throw new Error("could not bind WS server: all candidate ports in use");
  }
}

function wireServer(server: WebSocketServer, events: ServerEvents): void {
  server.on("connection", (ws) => {
    let client: AuthedClient | null = null;

    ws.on("message", async (data) => {
      let msg: ClientToServer;
      try {
        msg = JSON.parse(data.toString());
      } catch {
        ws.close(1003, "invalid json");
        return;
      }

      if (msg.type === "pair") {
        const result = await handlePair(msg.pairingToken, msg.phoneName, msg.phonePubKey);
        sendTyped(ws, result);
        if (result.type !== "paired") ws.close(1008, "pair failed");
        return;
      }

      if (msg.type === "hello") {
        const auth = await handleHello(msg.phoneDeviceId, msg.phoneName, msg.nonce, msg.hmac);
        if (auth.ok) {
          client = {
            ws,
            phoneDeviceId: msg.phoneDeviceId,
            phoneName: msg.phoneName,
            lastSeenAt: Date.now(),
            heldButtons: new Map(),
          };
          authed.add(client);
          events.onClientConnected?.(client.phoneName);
          sendTyped(ws, { type: "welcome", pcName: auth.pcName, protocolVersion: PROTOCOL_VERSION });
          await touchPairedSeen(msg.phoneDeviceId);
        } else {
          sendTyped(ws, { type: "auth_error", reason: auth.reason });
          ws.close(1008, "auth failed");
        }
        return;
      }

      if (!client) {
        ws.close(1008, "unauthenticated");
        return;
      }

      client.lastSeenAt = Date.now();

      if (msg.type === "ping") {
        sendTyped(ws, { type: "pong", ts: msg.ts });
        return;
      }
      if (msg.type === "press") {
        client.heldButtons.set(msg.buttonId, msg.keys);
        events.onPress?.(msg.keys, msg.buttonId, client.phoneDeviceId);
        sendTyped(ws, { type: "ack", evtId: msg.evtId });
        return;
      }
      if (msg.type === "release") {
        const heldKeys = client.heldButtons.get(msg.buttonId);
        if (heldKeys) {
          client.heldButtons.delete(msg.buttonId);
          events.onRelease?.(heldKeys, msg.buttonId, client.phoneDeviceId);
        }
        sendTyped(ws, { type: "ack", evtId: msg.evtId });
        return;
      }
    });

    ws.on("close", () => {
      if (client) {
        // Flush every still-held button as a synthetic release so the injector
        // pops its ref counts and the OS sees keyup for everything.
        if (client.heldButtons.size > 0) {
          console.log(`[ws] disconnect ${client.phoneName}, flushing ${client.heldButtons.size} held buttons`);
          for (const [buttonId, keys] of client.heldButtons) {
            events.onRelease?.(keys, buttonId, client.phoneDeviceId);
          }
          client.heldButtons.clear();
        }
        events.onClientDisconnected?.(client.phoneName);
        authed.delete(client);
      }
    });

    ws.on("error", (err) => {
      console.warn("[ws] socket error", err);
    });
  });
}

async function handlePair(
  pairingToken: string,
  phoneName: string,
  phonePubKey: string,
): Promise<ServerToClient> {
  const tokenStatus = consumePairingToken(pairingToken);
  console.log(`[pair] token=${pairingToken.slice(0, 8)}… status=${tokenStatus} phoneName=${phoneName}`);
  if (tokenStatus === "unknown") return { type: "pair_error", reason: "token_invalid" };
  if (tokenStatus === "expired") return { type: "pair_error", reason: "token_expired" };

  const phoneDeviceId = phoneIdFromPubKey(phonePubKey);
  const sharedSecret = randomBytes(32);
  const { pcDeviceId, pcName } = await getPcIdentity();
  await addPaired(phoneDeviceId, phoneName, sharedSecret);
  console.log(`[pair] OK phoneDeviceId=${phoneDeviceId.slice(0, 16)}… stored, pcDeviceId=${pcDeviceId.slice(0, 8)}…`);
  return {
    type: "paired",
    pcDeviceId,
    pcName,
    sharedSecret: sharedSecret.toString("base64"),
    protocolVersion: PROTOCOL_VERSION,
  };
}

async function handleHello(
  phoneDeviceId: string,
  _phoneName: string,
  nonce: string,
  hmac: string,
): Promise<{ ok: true; pcName: string } | { ok: false; reason: "unknown_device" | "bad_hmac" }> {
  const secret = await getSharedSecret(phoneDeviceId);
  console.log(`[hello] phoneDeviceId=${phoneDeviceId.slice(0, 16)}… secret_found=${secret !== null}`);
  if (!secret) return { ok: false, reason: "unknown_device" };
  const expected = createHmac("sha256", secret).update(`${phoneDeviceId}|${nonce}`).digest("base64");
  if (!timingSafeEqualStr(expected, hmac)) return { ok: false, reason: "bad_hmac" };
  const { pcName } = await getPcIdentity();
  console.log(`[hello] OK ${phoneDeviceId.slice(0, 16)}…`);
  return { ok: true, pcName };
}

function phoneIdFromPubKey(phonePubKey: string): string {
  return createHash("sha256").update(phonePubKey).digest("hex");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function sendTyped(ws: WebSocket, msg: ServerToClient): void {
  ws.send(JSON.stringify(msg satisfies AnyMessage));
}

export function stopServer(): void {
  if (wss) {
    wss.close();
    wss = null;
  }
  authed.clear();
}

export function getActiveClientName(): string | undefined {
  const first = authed.values().next().value;
  return first?.phoneName;
}
