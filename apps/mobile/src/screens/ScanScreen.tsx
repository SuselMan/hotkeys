import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { UpgradeCta } from "../components/UpgradeCta";
import { activatePairing } from "../connection";
import { useBackHandler } from "../hooks";
import { staticPair } from "../net";
import {
  canPairAnother,
  getOrCreateIdentity,
  listPairings,
  setSharedSecret,
  upsertPairing,
} from "../storage";
import { loadIsPro } from "../tier";
import { UpgradeScreen } from "./UpgradeScreen";

interface Props {
  onClose: () => void;
}

export function ScanScreen({ onClose }: Props) {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [pairing, setPairing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Set when the scanned QR would push the free tier over the pairing cap.
  // Surfaces a dedicated Upgrade CTA in the overlay instead of the generic
  // error string so the user has a clear path forward.
  const [capBlocked, setCapBlocked] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const handledRef = useRef(false);
  useBackHandler(upgrading ? () => undefined : onClose);

  if (upgrading) {
    return (
      <UpgradeScreen
        onClose={() => {
          setUpgrading(false);
          // After the user comes back from Upgrade, drop the cap-blocked
          // state so they can re-scan straight away. If they upgraded the
          // next scan succeeds; if they backed out it'll re-block correctly.
          setCapBlocked(false);
          handledRef.current = false;
        }}
      />
    );
  }

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.body}>{t("boardEditor.loading")}</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.h1}>{t("scan.permissionTitle")}</Text>
        <Text style={styles.body}>{t("scan.permissionBody")}</Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>{t("scan.allow")}</Text>
        </Pressable>
        <Pressable onPress={onClose} style={styles.linkBtn}>
          <Text style={styles.linkText}>{t("common.cancel")}</Text>
        </Pressable>
      </View>
    );
  }

  async function onScanned(payload: string) {
    if (handledRef.current || pairing) return;
    handledRef.current = true;
    setError(null);
    setCapBlocked(false);
    setPairing(true);

    try {
      const parsed = parseQrPayload(payload);
      if (!parsed) throw new Error("not a kekkeys QR");
      // Free-tier gate. Re-pair of a known pcDeviceId is always allowed
      // (token rotation / secret refresh); only a truly-new device blocks.
      const [pairings, isPro] = await Promise.all([listPairings(), loadIsPro()]);
      if (!canPairAnother(pairings, isPro, parsed.pcId)) {
        setCapBlocked(true);
        setPairing(false);
        return;
      }
      const id = await getOrCreateIdentity("kekkeys phone");
      console.log(`[scan] my phoneDeviceId=${id.phoneDeviceId.slice(0, 16)}… pubKey=${id.phonePubKey.slice(0, 10)}…`);
      const res = await staticPair({
        host: parsed.host,
        port: parsed.port,
        pairingToken: parsed.token,
        phoneName: id.phoneName,
        phonePubKey: id.phonePubKey,
      });
      await upsertPairing({
        pcDeviceId: res.pcDeviceId,
        pcName: res.pcName,
        lastHost: parsed.host,
        lastPort: parsed.port,
        pairedAt: Date.now(),
      });
      await setSharedSecret(res.pcDeviceId, res.sharedSecret);
      await activatePairing(res.pcDeviceId, parsed.host, parsed.port);
      onClose();
    } catch (e) {
      setError((e as Error).message);
      handledRef.current = false;
      setPairing(false);
    }
  }

  return (
    <View style={styles.root}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={(r) => onScanned(r.data)}
      />
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.overlayTop}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
          <Text style={styles.overlayTitle}>{t("scan.title")}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.frame} />
        <View style={styles.overlayBottom}>
          {capBlocked ? (
            <>
              <Text style={styles.errorText}>{t("scan.atCapTitle")}</Text>
              <Text style={styles.hintText}>{t("scan.atCapBody")}</Text>
              <UpgradeCta onPress={() => setUpgrading(true)} style={styles.capCta} />
            </>
          ) : (
            <>
              {pairing && <Text style={styles.statusText}>{t("scan.pairing")}</Text>}
              {error && <Text style={styles.errorText}>{error}</Text>}
              {!pairing && !error && (
                <Text style={styles.hintText}>{t("scan.hint")}</Text>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
}

interface ParsedQr {
  host: string;
  port: number;
  token: string;
  pcId: string;
  pcName: string;
}

function parseQrPayload(s: string): ParsedQr | null {
  if (!s.startsWith("kekkeys://pair?")) return null;
  const q = s.slice("kekkeys://pair?".length);
  const params = new URLSearchParams(q);
  const host = params.get("host") ?? "";
  const port = parseInt(params.get("port") ?? "", 10);
  const token = params.get("token") ?? "";
  const pcId = params.get("pcId") ?? "";
  const pcName = params.get("pcName") ?? "";
  if (!host || !port || !token || !pcId) return null;
  return { host, port, token, pcId, pcName };
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: "space-between" },
  overlayTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  overlayBottom: {
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    minHeight: 80,
    justifyContent: "center",
  },
  overlayTitle: { color: "#fadc50", fontSize: 16, fontWeight: "600" },
  closeBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  closeText: { color: "#fff", fontSize: 28, lineHeight: 28 },
  frame: {
    width: 260,
    height: 260,
    alignSelf: "center",
    borderColor: "#fadc50",
    borderWidth: 3,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  statusText: { color: "#fadc50", fontSize: 15 },
  errorText: { color: "#e57373", fontSize: 14, textAlign: "center" },
  hintText: { color: "#bbb", fontSize: 13, textAlign: "center" },
  capCta: { marginTop: 8 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12, backgroundColor: "#1a1a1a" },
  h1: { color: "#fadc50", fontSize: 22, fontWeight: "700" },
  body: { color: "#bbb", fontSize: 14, textAlign: "center" },
  button: { backgroundColor: "#fadc50", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 6, marginTop: 8 },
  buttonText: { color: "#000", fontWeight: "700" },
  linkBtn: { padding: 8 },
  linkText: { color: "#888", fontSize: 14 },
});
