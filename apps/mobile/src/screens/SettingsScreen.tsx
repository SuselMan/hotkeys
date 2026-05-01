import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Constants from "expo-constants";
import { exportBoards, pickAndImport } from "../backup";
import { replaceAllBoards } from "../boards";
import { getSavedLocale, setAppLocale, type LocaleSetting } from "../i18n";

export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [savedLocale, setSavedLocale] = useState<LocaleSetting>("system");

  useEffect(() => {
    void getSavedLocale().then(setSavedLocale);
  }, [i18n.language]);

  async function setLocale(loc: LocaleSetting) {
    await setAppLocale(loc);
    setSavedLocale(loc);
  }

  async function onExport() {
    try {
      await exportBoards();
    } catch (e) {
      Alert.alert("Export failed", (e as Error).message);
    }
  }

  async function onImport() {
    Alert.alert(t("settings.importConfirmTitle"), t("settings.importConfirmBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("settings.importBtn"),
        style: "destructive",
        onPress: async () => {
          const res = await pickAndImport();
          if (!res.ok) {
            if (res.reason === "canceled") return;
            Alert.alert(t("settings.importErrorTitle"), `${t("settings.importErrorBody")} (${res.reason})`);
            return;
          }
          await replaceAllBoards(res.boards);
          const count = res.boards.length;
          Alert.alert(
            t("settings.importDoneTitle"),
            t("settings.importDoneBody", { count, plural: count === 1 ? "" : "s" }),
          );
        },
      },
    ]);
  }

  const version = (Constants.expoConfig?.version as string | undefined) ?? "0.0.1";

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.h1}>{t("settings.title")}</Text>

      <Section title={t("settings.languageLabel")}>
        <LangChoice value="system" current={savedLocale} label={t("settings.languageSystem")} onPick={setLocale} />
        <LangChoice value="en" current={savedLocale} label={t("settings.languageEn")} onPick={setLocale} />
        <LangChoice value="ru" current={savedLocale} label={t("settings.languageRu")} onPick={setLocale} />
      </Section>

      <Section title={t("settings.backupLabel")}>
        <Pressable style={styles.button} onPress={onExport}>
          <Text style={styles.buttonText}>{t("settings.exportBtn")}</Text>
        </Pressable>
        <Pressable style={styles.buttonGhost} onPress={onImport}>
          <Text style={styles.buttonGhostText}>{t("settings.importBtn")}</Text>
        </Pressable>
      </Section>

      <Section title={t("settings.aboutLabel")}>
        <Text style={styles.aboutLine}>{t("settings.aboutVersion", { version })}</Text>
        <Text style={styles.aboutLine}>{t("settings.aboutCredit")}</Text>
      </Section>
    </ScrollView>
  );
}

interface LangChoiceProps {
  value: LocaleSetting;
  current: LocaleSetting;
  label: string;
  onPick: (v: LocaleSetting) => void;
}
function LangChoice({ value, current, label, onPick }: LangChoiceProps) {
  const active = current === value;
  return (
    <Pressable style={[styles.row, active && styles.rowActive]} onPress={() => onPick(value)}>
      <Text style={[styles.rowText, active && styles.rowTextActive]}>{label}</Text>
      {active && <Text style={styles.check}>✓</Text>}
    </Pressable>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}
function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1a1a1a" },
  content: { padding: 16, gap: 16 },
  h1: { color: "#fadc50", fontSize: 24, fontWeight: "700" },
  section: {
    backgroundColor: "#242424",
    borderRadius: 8,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  sectionTitle: { color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  rowActive: { backgroundColor: "#2d2d2d" },
  rowText: { color: "#e8e8e8", fontSize: 15 },
  rowTextActive: { color: "#fadc50", fontWeight: "600" },
  check: { color: "#fadc50", fontSize: 16, fontWeight: "700" },
  button: { backgroundColor: "#fadc50", padding: 12, borderRadius: 6, alignItems: "center" },
  buttonText: { color: "#000", fontWeight: "700" },
  buttonGhost: { backgroundColor: "#3a3a3a", padding: 12, borderRadius: 6, alignItems: "center" },
  buttonGhostText: { color: "#fff", fontWeight: "600" },
  aboutLine: { color: "#bbb", fontSize: 13, lineHeight: 18 },
});
