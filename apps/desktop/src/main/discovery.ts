import { Bonjour, type Service } from "bonjour-service";
import { MDNS_SERVICE_TYPE, type MdnsTxt } from "@kekkeys/protocol";

let bonjour: Bonjour | null = null;
let service: Service | null = null;

export function startMdns(opts: { name: string; port: number; deviceId: string; protocolVersion: number }): void {
  stopMdns();
  bonjour = new Bonjour();
  const txt: MdnsTxt = {
    deviceId: opts.deviceId,
    name: opts.name,
    v: String(opts.protocolVersion),
  };
  service = bonjour.publish({
    name: opts.name,
    type: MDNS_SERVICE_TYPE,
    port: opts.port,
    txt: txt as unknown as Record<string, string>,
  });
  service.on("error", (err) => {
    console.error("[mdns] error", err);
  });
  console.log(`[mdns] advertising _${MDNS_SERVICE_TYPE}._tcp on port ${opts.port}`);
}

export function stopMdns(): void {
  if (service) {
    try {
      service.stop?.(() => undefined);
    } catch (e) {
      console.warn("[mdns] stop service error", e);
    }
    service = null;
  }
  if (bonjour) {
    try {
      bonjour.destroy();
    } catch (e) {
      console.warn("[mdns] destroy error", e);
    }
    bonjour = null;
  }
}
