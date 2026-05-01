import { networkInterfaces } from "node:os";
import QRCode from "qrcode";
import { createPairingToken, getPcIdentity } from "./state.js";

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

export async function buildPairInfo(): Promise<PairInfo> {
  const { pcDeviceId, pcName, port } = await getPcIdentity();
  const host = pickLanIp();
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

function pickLanIp(): string | null {
  const ifaces = networkInterfaces();
  for (const list of Object.values(ifaces)) {
    if (!list) continue;
    for (const i of list) {
      if (i.family === "IPv4" && !i.internal) return i.address;
    }
  }
  return null;
}
