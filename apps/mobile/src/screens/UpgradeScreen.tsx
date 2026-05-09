import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconView } from "../components/IconView";
import { useBackHandler } from "../hooks";
import {
  getCachedPrice,
  purchasePro,
  restorePurchases,
  subscribePriceUpdates,
} from "../iap";

interface Props {
  onClose: () => void;
}

/**
 * The single funnel for every PRO touchpoint in the app. The Get-PRO button
 * dispatches a Play Billing purchase request; the actual entitlement flip
 * happens in the global purchaseUpdatedListener registered in `iap.ts`, so
 * this screen just dismisses on dispatch and trusts the listener to set
 * tier="pro" before the user navigates to the unlocked surface. The price
 * line shows whatever Play returned for the current locale (falling back to
 * the i18n string until Play responds).
 */
export function UpgradeScreen({ onClose }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  useBackHandler(onClose);

  const [price, setPrice] = useState<string | null>(getCachedPrice());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    return subscribePriceUpdates(setPrice);
  }, []);

  async function onGetPro() {
    if (busy) return;
    setBusy(true);
    const res = await purchasePro();
    setBusy(false);
    if (!res.ok) {
      Alert.alert(
        t("upgrade.purchaseFailedTitle"),
        t("upgrade.purchaseFailedBody", { reason: res.reason }),
      );
      return;
    }
    // The purchaseUpdatedListener in iap.ts flips the tier when Play confirms;
    // close the screen so the underlying PRO surface unlocks.
    onClose();
  }

  async function onRestore() {
    if (busy) return;
    setBusy(true);
    const res = await restorePurchases();
    setBusy(false);
    if (!res.ok) {
      Alert.alert(
        t("upgrade.purchaseFailedTitle"),
        t("upgrade.purchaseFailedBody", { reason: res.reason }),
      );
      return;
    }
    if (res.restored) {
      Alert.alert(t("upgrade.restoredTitle"), t("upgrade.restoredBody"));
      onClose();
    } else {
      Alert.alert(t("upgrade.restoreNoneTitle"), t("upgrade.restoreNoneBody"));
    }
  }

  // Fall back to the localized "$9.99 — lifetime" copy until Play returns the
  // device-locale price (it auto-converts USD to local currency at the user's
  // Google account settings).
  const priceLine = price ?? t("upgrade.priceLine");

  return (
    <View style={styles.root}>
      <View style={[styles.topbar, { paddingTop: insets.top + 4 }]}>
        <Pressable onPress={onClose} style={styles.closeBtn} accessibilityRole="button">
          <Text style={styles.closeText}>×</Text>
        </Pressable>
        <Text style={styles.title}>{t("upgrade.title")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.heroBody}>{t("upgrade.heroBody")}</Text>

        <View style={styles.features}>
          <FeatureRow icon="dashboard" label={t("upgrade.featureBoards")} />
          <FeatureRow icon="palette" label={t("upgrade.featureColors")} />
          <FeatureRow icon="add_photo_alternate" label={t("upgrade.featureIcons")} />
          <FeatureRow icon="devices" label={t("upgrade.featureMultiPc")} />
        </View>

        <Text style={styles.priceLine}>{priceLine}</Text>

        <Pressable
          style={[styles.primary, busy && styles.primaryDisabled]}
          onPress={onGetPro}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.primaryText}>{t("upgrade.getProBtn")}</Text>
          )}
        </Pressable>

        <Pressable style={styles.restore} onPress={onRestore} disabled={busy}>
          <Text style={[styles.restoreText, busy && styles.restoreTextDisabled]}>
            {t("upgrade.restoreBtn")}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

interface FeatureRowProps {
  icon: string;
  label: string;
}
function FeatureRow({ icon, label }: FeatureRowProps) {
  return (
    <View style={styles.featureRow}>
      <IconView name={icon} size={22} color="#fadc50" />
      <Text style={styles.featureText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1a1a1a" },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: "#242424",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  closeBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  closeText: { color: "#fff", fontSize: 26 },
  title: { flex: 1, color: "#fadc50", fontSize: 16, fontWeight: "600", textAlign: "center" },

  body: { padding: 20, gap: 18 },
  heroBody: { color: "#e8e8e8", fontSize: 15, lineHeight: 22 },

  features: {
    backgroundColor: "#242424",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    padding: 12,
    gap: 12,
  },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  featureText: { flex: 1, color: "#e8e8e8", fontSize: 14, lineHeight: 20 },

  priceLine: { color: "#fadc50", fontSize: 18, fontWeight: "700", textAlign: "center" },

  primary: {
    backgroundColor: "#fadc50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryDisabled: { opacity: 0.6 },
  primaryText: { color: "#000", fontWeight: "700", fontSize: 16 },

  restore: { paddingVertical: 10, alignItems: "center" },
  restoreText: { color: "#bbb", fontSize: 13 },
  restoreTextDisabled: { opacity: 0.5 },
});
