/**
 * Mirror of @kekkeys/protocol kept in-tree to dodge Metro's quirks with
 * monorepo ESM packages. Sync via `node scripts/sync-protocol.mjs` from
 * apps/mobile if you change the desktop-side definitions.
 */

export type KeyCode = string;

export const PROTOCOL_VERSION = 1;
export const MDNS_SERVICE_TYPE = "kekkeys";

export const Modifiers = [
  "ControlLeft",
  "ControlRight",
  "ShiftLeft",
  "ShiftRight",
  "AltLeft",
  "AltRight",
  "MetaLeft",
  "MetaRight",
] as const;
export type Modifier = (typeof Modifiers)[number];

export interface PairRequest {
  type: "pair";
  pairingToken: string;
  phoneName: string;
  phonePubKey: string;
}

export interface PairResponse {
  type: "paired";
  pcDeviceId: string;
  pcName: string;
  sharedSecret: string;
  protocolVersion: number;
}

export interface PairFailure {
  type: "pair_error";
  reason: "token_invalid" | "token_expired" | "token_used" | "internal";
}

export interface HelloMessage {
  type: "hello";
  phoneDeviceId: string;
  phoneName: string;
  nonce: string;
  hmac: string;
}

export interface WelcomeMessage {
  type: "welcome";
  pcName: string;
  protocolVersion: number;
}

export interface AuthFailure {
  type: "auth_error";
  reason: "unknown_device" | "bad_hmac" | "version_mismatch";
}

export interface PressMessage {
  type: "press";
  evtId: string;
  buttonId: string;
  keys: KeyCode[];
}

export interface ReleaseMessage {
  type: "release";
  evtId: string;
  buttonId: string;
}

export interface AckMessage {
  type: "ack";
  evtId: string;
}

export interface PingMessage {
  type: "ping";
  ts: number;
}

export interface PongMessage {
  type: "pong";
  ts: number;
}

export interface StateMessage {
  type: "state";
  pcName: string;
  activeClientName?: string;
}

export type ClientToServer =
  | PairRequest
  | HelloMessage
  | PressMessage
  | ReleaseMessage
  | PingMessage;

export type ServerToClient =
  | PairResponse
  | PairFailure
  | WelcomeMessage
  | AuthFailure
  | AckMessage
  | PongMessage
  | StateMessage;

export type AnyMessage = ClientToServer | ServerToClient;
