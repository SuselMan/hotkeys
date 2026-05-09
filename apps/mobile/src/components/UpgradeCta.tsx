import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, type ViewStyle } from "react-native";

interface Props {
  onPress: () => void;
  style?: ViewStyle;
}

/**
 * The single yellow "Upgrade to PRO →" button reused by every PRO touchpoint
 * (BoardsScreen proHint, ButtonEditorScreen Colors lock, IconPickerScreen
 * user-icons hint). Centralizing here means future copy / styling tweaks live
 * in one place. Pricing copy is intentionally absent — it lives only on
 * UpgradeScreen so it doesn't have to be re-localized in three CTAs.
 */
export function UpgradeCta({ onPress, style }: Props) {
  const { t } = useTranslation();
  return (
    <Pressable style={[styles.btn, style]} onPress={onPress} accessibilityRole="button">
      <Text style={styles.label}>{t("common.upgradeBtn")}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#fadc50",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  label: { color: "#000", fontWeight: "700", fontSize: 14 },
});
