import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { instantiateTemplate } from "./src/boards";
import { BoardEditorScreen } from "./src/screens/BoardEditorScreen";
import { BoardsScreen } from "./src/screens/BoardsScreen";
import { ConnectScreen } from "./src/screens/ConnectScreen";
import { RunScreen } from "./src/screens/RunScreen";
import { ScanScreen } from "./src/screens/ScanScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { TemplatePickerScreen } from "./src/screens/TemplatePickerScreen";
import type { Board } from "./src/types";

type Tab = "connect" | "boards" | "settings";

export default function App() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("connect");
  const [scanning, setScanning] = useState(false);
  const [running, setRunning] = useState<Board | null>(null);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [pickingTemplate, setPickingTemplate] = useState(false);

  async function onPickTemplate(templateId: string) {
    try {
      const board = await instantiateTemplate(templateId);
      setPickingTemplate(false);
      if (!board) {
        Alert.alert(t("templates.errorTitle"), t("templates.notFound"));
        return;
      }
      setEditingBoardId(board.id);
    } catch (e) {
      setPickingTemplate(false);
      Alert.alert(t("templates.errorTitle"), (e as Error).message);
    }
  }

  if (running) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <RunScreen board={running} onClose={() => setRunning(null)} />
      </View>
    );
  }

  if (editingBoardId) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <BoardEditorScreen
          boardId={editingBoardId}
          onClose={() => setEditingBoardId(null)}
        />
      </View>
    );
  }

  if (scanning) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <ScanScreen onClose={() => setScanning(false)} />
      </View>
    );
  }

  if (pickingTemplate) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <TemplatePickerScreen
          onCancel={() => setPickingTemplate(false)}
          onPick={onPickTemplate}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={[styles.content, { paddingTop: insets.top }]}>
        {tab === "connect" && <ConnectScreen onScanRequest={() => setScanning(true)} />}
        {tab === "boards" && (
          <BoardsScreen
            onRun={setRunning}
            onEdit={(b) => setEditingBoardId(b.id)}
            onPickTemplate={() => setPickingTemplate(true)}
          />
        )}
        {tab === "settings" && <SettingsScreen />}
      </View>
      <View style={[styles.tabbar, { paddingBottom: insets.bottom }]}>
        <TabButton label={t("tabs.connect")} active={tab === "connect"} onPress={() => setTab("connect")} />
        <TabButton label={t("tabs.boards")} active={tab === "boards"} onPress={() => setTab("boards")} />
        <TabButton label={t("tabs.settings")} active={tab === "settings"} onPress={() => setTab("settings")} />
      </View>
    </View>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1a1a1a" },
  content: { flex: 1 },
  tabbar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#333",
    backgroundColor: "#242424",
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: "center" },
  tabActive: { borderTopWidth: 2, borderTopColor: "#fadc50" },
  tabLabel: { color: "#8a8a8a", fontSize: 13, fontWeight: "500" },
  tabLabelActive: { color: "#fadc50" },
});
