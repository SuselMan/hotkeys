import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { UpgradeCta } from "../components/UpgradeCta";
import {
  activatePairing,
  disconnect,
  tryResume,
  useConnectionStatus,
} from "../connection";
import { staticPair } from "../net";
import {
  canPairAnother,
  getOrCreateIdentity,
  MAX_FREE_PAIRINGS,
  removePairing,
  setSharedSecret,
  upsertPairing,
  usePairings,
  type Pairing,
} from "../storage";
import { useIsPro } from "../tier";
import { UpgradeScreen } from "./UpgradeScreen";

interface Props {
  onScanRequest: () => void;
}

export function ConnectScreen({ onScanRequest }: Props) {
  const { t, i18n } = useTranslation();
  const status = useConnectionStatus();
  const pairings = usePairings();
  const isPro = useIsPro();
  // Landing only ships en + ru content; non-ru locales fall back to en so es/de/ja
  // users still get a readable download page.
  const landingLocale = i18n.language === "ru" ? "ru" : "en";
  const desktopUrl = `https://kekkeys.online/${landingLocale}/download/`;
  const [host, setHost] = useState("");
  const [port, setPort] = useState("41234");
  const [token, setToken] = useState("");
  const [pairing, setPairing] = useState(false);
  const [pairError, setPairError] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    void tryResume();
  }, []);

  // Free-tier gate: hide "Pair a new PC" when at the cap. The reactive
  // `pairings` + `isPro` mean the section flips back the moment the user
  // forgets a PC or upgrades.
  const atCap = !isPro && pairings.length >= MAX_FREE_PAIRINGS;

  async function onPair() {
    setPairError(null);
    setPairing(true);
    try {
      const portNum = parseInt(port, 10);
      if (!host || !portNum || !token) throw new Error("fill host, port, token");
      const id = await getOrCreateIdentity("kekkeys phone");
      const res = await staticPair({
        host,
        port: portNum,
        pairingToken: token.trim(),
        phoneName: id.phoneName,
        phonePubKey: id.phonePubKey,
      });
      // Defense-in-depth: the UI hides this whole section at the cap, but
      // gate the actual write too in case state drifted between render and
      // the network round-trip.
      if (!canPairAnother(pairings, isPro, res.pcDeviceId)) {
        throw new Error(t("connect.atCapError"));
      }
      await upsertPairing({
        pcDeviceId: res.pcDeviceId,
        pcName: res.pcName,
        lastHost: host,
        lastPort: portNum,
        pairedAt: Date.now(),
      });
      await setSharedSecret(res.pcDeviceId, res.sharedSecret);
      await activatePairing(res.pcDeviceId, host, portNum);
      setToken("");
    } catch (e) {
      setPairError((e as Error).message);
    } finally {
      setPairing(false);
    }
  }

  async function onConnect(p: Pairing) {
    if (!p.lastHost || !p.lastPort) {
      setPairError(t("connect.needRepair"));
      return;
    }
    try {
      await activatePairing(p.pcDeviceId, p.lastHost, p.lastPort);
    } catch (e) {
      setPairError((e as Error).message);
    }
  }

  async function onForget(p: Pairing) {
    await removePairing(p.pcDeviceId);
    if (status.kind !== "idle") disconnect();
  }

  if (upgrading) {
    return <UpgradeScreen onClose={() => setUpgrading(false)} />;
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.h1}>{t("connect.title")}</Text>

      <View style={styles.statusBox}>
        <StatusBadge status={status} />
      </View>

      {pairError && <Text style={styles.error}>{pairError}</Text>}

      <View style={styles.section}>
        <Text style={styles.h2}>{t("connect.pairedTitle")}</Text>
        {pairings.length === 0 && (
          <Text style={styles.muted}>{t("connect.pairedEmpty")}</Text>
        )}
        {pairings.map((p) => (
          <View key={p.pcDeviceId} style={styles.pairing}>
            <View style={styles.flex1}>
              <Text style={styles.pairingName}>{p.pcName}</Text>
              <Text style={styles.pairingDetail}>
                {p.lastHost ?? "—"}:{p.lastPort ?? "—"}
              </Text>
            </View>
            <Pressable style={styles.smallBtn} onPress={() => onConnect(p)}>
              <Text style={styles.smallBtnText}>{t("connect.connect")}</Text>
            </Pressable>
            <Pressable style={[styles.smallBtn, styles.btnGhost]} onPress={() => onForget(p)}>
              <Text style={styles.smallBtnText}>{t("common.forget")}</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {atCap ? (
        <View style={styles.proHint}>
          <Text style={styles.proHintTitle}>{t("connect.proLockTitle")}</Text>
          <Text style={styles.proHintBody}>{t("connect.proLockBody")}</Text>
          <UpgradeCta onPress={() => setUpgrading(true)} style={styles.proHintCta} />
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.h2}>{t("connect.pairTitle")}</Text>
            <Pressable style={styles.button} onPress={onScanRequest}>
              <Text style={styles.buttonText}>{t("connect.pairScan")}</Text>
            </Pressable>
            <Text style={styles.muted}>{t("connect.pairScanHint")}</Text>
            <Pressable onPress={() => void Linking.openURL(desktopUrl)} style={styles.linkRow}>
              <Text style={styles.linkText}>{t("connect.getDesktopHint")}</Text>
            </Pressable>
          </View>

          {__DEV__ && (
            <View style={styles.section}>
              <Text style={styles.h2}>{t("connect.manualTitle")}</Text>
              <Text style={styles.muted}>{t("connect.manualHint")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("connect.hostPlaceholder")}
                placeholderTextColor="#666"
                autoCapitalize="none"
                value={host}
                onChangeText={setHost}
              />
              <TextInput
                style={styles.input}
                placeholder={t("connect.portPlaceholder")}
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={port}
                onChangeText={setPort}
              />
              <TextInput
                style={styles.input}
                placeholder={t("connect.tokenPlaceholder")}
                placeholderTextColor="#666"
                autoCapitalize="none"
                value={token}
                onChangeText={setToken}
              />
              <Pressable
                style={[styles.button, pairing && styles.buttonDisabled]}
                disabled={pairing}
                onPress={onPair}
              >
                {pairing ? <ActivityIndicator /> : <Text style={styles.buttonText}>{t("connect.pair")}</Text>}
              </Pressable>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

function StatusBadge({ status }: { status: ReturnType<typeof useConnectionStatus> }) {
  const { t } = useTranslation();
  let bg = "#444";
  let label = t("status.idle");
  if (status.kind === "connecting") {
    bg = "#888";
    label = t("status.connecting");
  } else if (status.kind === "authenticating") {
    bg = "#888";
    label = t("status.authenticating");
  } else if (status.kind === "online") {
    bg = "#4caf50";
    label = `${t("status.online")} · ${status.pcName}` + (status.lastPongMs !== undefined ? ` · ${status.lastPongMs} ms` : "");
  } else if (status.kind === "offline") {
    bg = "#e57373";
    label = `${t("status.offline")} · ${status.error}`;
  }
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1a1a1a" },
  content: { padding: 16, gap: 16 },
  h1: { color: "#fadc50", fontSize: 24, fontWeight: "700" },
  h2: { color: "#8a8a8a", fontSize: 12, fontWeight: "600", textTransform: "uppercase", marginBottom: 8, letterSpacing: 0.5 },
  muted: { color: "#888", fontSize: 13, lineHeight: 18 },
  statusBox: { alignItems: "flex-start" },
  section: { backgroundColor: "#242424", borderRadius: 8, padding: 12, gap: 8, borderWidth: 1, borderColor: "#333" },
  pairing: { flexDirection: "row", alignItems: "center", paddingVertical: 8, gap: 8 },
  pairingName: { color: "#e8e8e8", fontSize: 15, fontWeight: "600" },
  pairingDetail: { color: "#888", fontSize: 12, marginTop: 2 },
  flex1: { flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  badgeText: { color: "#000", fontSize: 12, fontWeight: "600" },
  input: { backgroundColor: "#1a1a1a", color: "#e8e8e8", borderRadius: 6, padding: 10, borderWidth: 1, borderColor: "#333", fontSize: 14 },
  button: { backgroundColor: "#fadc50", borderRadius: 6, padding: 12, alignItems: "center" },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#000", fontWeight: "700" },
  smallBtn: { backgroundColor: "#fadc50", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  btnGhost: { backgroundColor: "#3a3a3a" },
  smallBtnText: { color: "#000", fontWeight: "600", fontSize: 13 },
  error: { color: "#e57373", fontSize: 13 },
  linkRow: { paddingVertical: 6, marginTop: 4 },
  linkText: { color: "#fadc50", fontSize: 13, fontWeight: "600" },
  proHint: {
    backgroundColor: "#2d2820",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#5a4a20",
  },
  proHintTitle: { color: "#fadc50", fontWeight: "700", marginBottom: 4 },
  proHintBody: { color: "#bba", fontSize: 13, lineHeight: 18 },
  proHintCta: { marginTop: 10 },
});
