import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconView } from "../components/IconView";
import { useBackHandler } from "../hooks";
import { setTier } from "../tier";

interface Props {
  onClose: () => void;
}

/**
 * The single funnel for every PRO touchpoint in the app. For v1 the Get-PRO
 * button just flips the debug tier so the conversion path can be dogfooded
 * end-to-end; the Play Billing integration replaces only the body of
 * `onGetPro` when it lands. Pricing copy lives only on this screen — never
 * on CTA buttons or lock-block bodies — so we don't re-localize three places
 * every time pricing moves.
 */
export function UpgradeScreen({ onClose }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  useBackHandler(onClose);

  async function onGetPro() {
    // Debug stub. Real Play Billing acknowledge flow replaces this body.
    await setTier("pro");
    onClose();
  }

  function onRestore() {
    // Stub: in production this acknowledges existing Play Billing entitlement.
    // For now do nothing — the caller still gets a tactile press feedback.
  }

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

        <Text style={styles.priceLine}>{t("upgrade.priceLine")}</Text>

        <Pressable style={styles.primary} onPress={onGetPro}>
          <Text style={styles.primaryText}>{t("upgrade.getProBtn")}</Text>
        </Pressable>

        <Pressable style={styles.restore} onPress={onRestore}>
          <Text style={styles.restoreText}>{t("upgrade.restoreBtn")}</Text>
        </Pressable>

        <Text style={styles.disclaimer}>{t("upgrade.debugDisclaimer")}</Text>
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
  primaryText: { color: "#000", fontWeight: "700", fontSize: 16 },

  restore: { paddingVertical: 10, alignItems: "center" },
  restoreText: { color: "#bbb", fontSize: 13 },

  disclaimer: { color: "#888", fontSize: 12, lineHeight: 16, textAlign: "center" },
});
