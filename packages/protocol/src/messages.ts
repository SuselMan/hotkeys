import type { KeyCode } from "./keycodes.js";

export const PROTOCOL_VERSION = 1;

/**
 * Pairing — first-time handshake using a one-time token from QR or mDNS.
 * Phone → Desktop.
 */
export interface PairRequest {
  type: "pair";
  pairingToken: string;
  phoneName: string;
  phonePubKey: string; // base64 ed25519 public key
}

/**
 * Desktop → Phone, response to pair.
 * sharedSecret is a base64 random key the phone stores in SecureStore.
 */
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

/**
 * Reconnect — subsequent connections after pairing.
 * Phone → Desktop. HMAC computed over phoneDeviceId || nonce using sharedSecret.
 */
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

/**
 * Runtime — press and release events.
 * Phone → Desktop. evtId allows desktop to ack and clean up if a release is missed.
 */
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

/**
 * Heartbeat — phone pings every 2s; if desktop doesn't see a ping for 5s,
 * it considers the client gone and releases all held keys.
 */
export interface PingMessage {
  type: "ping";
  ts: number;
}

export interface PongMessage {
  type: "pong";
  ts: number;
}

/**
 * State broadcast from desktop. The phone may render this in the UI.
 */
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
