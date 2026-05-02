import { networkInterfaces } from "node:os";
import QRCode from "qrcode";
import { createPairingToken, getPcIdentity, getPreferredLanIp } from "./state.js";

const PAIRING_TTL_MS = 5 * 60 * 1000;

export interface PairInfo {
  host: string | null;
  port: number;
  pcName: string;
  pcDeviceId: string;
  token: string;
  tokenTtlMs: number;
  qrPayload: string;
  qrDataUrl: string;
}

export interface LanCandidate {
  iface: string;
  address: string;
  /** Higher = more likely the real LAN interface. */
  score: number;
}

export async function buildPairInfo(): Promise<PairInfo> {
  const { pcDeviceId, pcName, port } = await getPcIdentity();
  const host = await pickHost();
  const token = createPairingToken();

  const params = new URLSearchParams({
    host: host ?? "",
    port: String(port),
    token,
    pcId: pcDeviceId,
    pcName,
  });
  const qrPayload = `kekkeys://pair?${params.toString()}`;

  const qrDataUrl = await QRCode.toDataURL(qrPayload, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 320,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });

  return {
    host,
    port,
    pcName,
    pcDeviceId,
    token,
    tokenTtlMs: PAIRING_TTL_MS,
    qrPayload,
    qrDataUrl,
  };
}

/**
 * All non-internal IPv4 candidates, scored. Renderer uses this to populate
 * the "which IP to advertise" dropdown.
 */
export function listLanCandidates(): LanCandidate[] {
  const out: LanCandidate[] = [];
  const ifaces = networkInterfaces();
  for (const [iface, list] of Object.entries(ifaces)) {
    if (!list) continue;
    for (const i of list) {
      if (i.family !== "IPv4" || i.internal) continue;
      out.push({ iface, address: i.address, score: scoreCandidate(iface, i.address) });
    }
  }
  out.sort((a, b) => b.score - a.score);
  return out;
}

async function pickHost(): Promise<string | null> {
  const candidates = listLanCandidates();
  if (candidates.length === 0) return null;

  const preferred = await getPreferredLanIp();
  if (preferred && candidates.some((c) => c.address === preferred)) {
    return preferred;
  }
  return candidates[0]?.address ?? null;
}

function scoreCandidate(iface: string, address: string): number {
  let score = 0;
  // Strong penalty for known-virtual adapter names.
  if (/vEthernet|Hyper-?V|WSL|VirtualBox|VMware|TAP|Loopback|Bluetooth|VPN|Tailscale|ZeroTier|Docker/i.test(iface)) {
    score -= 100;
  }
  // Boost adapters that look like real physical NICs. Localized Windows names
  // (e.g. "Беспроводная сеть") won't match — they fall through to the RFC1918
  // boost below, which still beats vEthernet.
  if (/^(Wi-?Fi|Ethernet|en\d|wlan\d|eth\d)/i.test(iface)) {
    score += 50;
  }
  if (isRfc1918(address)) {
    score += 20;
  }
  // APIPA / link-local — never useful.
  if (/^169\.254\./.test(address)) {
    score -= 200;
  }
  return score;
}

function isRfc1918(addr: string): boolean {
  if (/^10\./.test(addr)) return true;
  if (/^192\.168\./.test(addr)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(addr)) return true;
  return false;
}
