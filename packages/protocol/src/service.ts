/**
 * Constants for mDNS service discovery.
 */
export const MDNS_SERVICE_TYPE = "kekkeys";
export const MDNS_PROTOCOL = "tcp";

/**
 * TXT record fields advertised over mDNS so the phone can identify the PC
 * before connecting.
 */
export interface MdnsTxt {
  /** Stable per-install id, used as pairing key. */
  deviceId: string;
  /** Human-readable name (e.g. computer name). */
  name: string;
  /** Protocol version, decimal string. */
  v: string;
}
