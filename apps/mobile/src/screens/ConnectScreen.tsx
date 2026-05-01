import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  activatePairing,
  disconnect,
  tryResume,
  useConnectionStatus,
} from "../connection";
import { staticPair } from "../net";
import {
  getOrCreateIdentity,
  listPairings,
  removePairing,
  setSharedSecret,
  upsertPairing,
  type Pairing,
} from "../storage";

interface Props {
  onScanRequest: () => void;
}

export function ConnectScreen({ onScanRequest }: Props) {
  const { t } = useTranslation();
  const status = useConnectionStatus();
  const [pairings, setPairings] = useState<Pairing[]>([]);
  const [host, setHost] = useState("");
  const [port, setPort] = useState("41234");
  const [token, setToken] = useState("");
  const [pairing, setPairing] = useState(false);
  const [pairError, setPairError] = useState<string | null>(null);

  useEffect(() => {
    void refresh();
    void tryResume();
  }, []);

  async function refresh() {
    setPairings(await listPairings());
  }

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
      await refresh();
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
    await refresh();
    if (status.kind !== "idle") disconnect();
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.h1}>{t("connect.title")}</Text>

      <View style={styles.statusBox}>
        <StatusBadge status={status} />
      </View>

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

      <View style={styles.section}>
        <Text style={styles.h2}>{t("connect.pairTitle")}</Text>
        <Pressable style={styles.button} onPress={onScanRequest}>
          <Text style={styles.buttonText}>{t("connect.pairScan")}</Text>
        </Pressable>
        <Text style={styles.muted}>{t("connect.pairScanHint")}</Text>
      </View>

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
        {pairError && <Text style={styles.error}>{pairError}</Text>}
      </View>
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
});
