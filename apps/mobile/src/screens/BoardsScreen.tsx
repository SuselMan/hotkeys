import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { createBoard, deleteBoard, useBoards } from "../boards";
import type { Board } from "../types";

const FREE_TIER_BOARD_LIMIT = 1;

type CreateState = "off" | "choose" | "named";

interface Props {
  onRun: (board: Board) => void;
  onEdit: (board: Board) => void;
  onPickTemplate: () => void;
}

export function BoardsScreen({ onRun, onEdit, onPickTemplate }: Props) {
  const { t } = useTranslation();
  const boards = useBoards();
  const [creating, setCreating] = useState<CreateState>("off");
  const [newName, setNewName] = useState("");

  const canCreate = boards.length < FREE_TIER_BOARD_LIMIT;

  async function onCreate() {
    const name = newName.trim();
    if (!name) return;
    const board = await createBoard(name);
    setNewName("");
    setCreating("off");
    onEdit(board);
  }

  function startFromTemplate() {
    setCreating("off");
    onPickTemplate();
  }

  function confirmDelete(b: Board) {
    Alert.alert(
      t("boards.deleteTitle"),
      t("boards.deleteBody", { name: b.name }),
      [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("common.delete"), style: "destructive", onPress: () => deleteBoard(b.id) },
      ],
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.h1}>{t("boards.title")}</Text>

      {boards.map((b) => (
        <View key={b.id} style={styles.card}>
          <Pressable style={styles.cardLeft} onPress={() => onEdit(b)}>
            <Text style={styles.cardTitle}>{b.name}</Text>
            <Text style={styles.cardMeta}>
              {b.gridCols}×{b.gridRows} · {t("boards.buttonsCount", { count: b.buttons.length })}
            </Text>
          </Pressable>
          <Pressable style={styles.runBtn} onPress={() => onRun(b)}>
            <Text style={styles.runBtnText}>{t("boards.runBtn")}</Text>
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={() => confirmDelete(b)}>
            <Text style={styles.iconBtnText}>×</Text>
          </Pressable>
        </View>
      ))}

      {boards.length === 0 && creating === "off" && canCreate && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{t("boards.emptyTitle")}</Text>
          <Text style={styles.emptyBody}>{t("boards.emptyBody")}</Text>
        </View>
      )}

      {creating === "choose" && (
        <View style={styles.createCard}>
          <Text style={styles.chooserTitle}>{t("boards.chooserTitle")}</Text>
          <Pressable style={styles.buttonBlock} onPress={startFromTemplate}>
            <Text style={styles.buttonText}>{t("boards.fromTemplate")}</Text>
          </Pressable>
          <Pressable style={styles.buttonGhostBlock} onPress={() => setCreating("named")}>
            <Text style={styles.buttonGhostText}>{t("boards.emptyBoard")}</Text>
          </Pressable>
          <Pressable style={styles.cancelLink} onPress={() => setCreating("off")}>
            <Text style={styles.cancelLinkText}>{t("common.cancel")}</Text>
          </Pressable>
        </View>
      )}

      {creating === "named" && (
        <View style={styles.createCard}>
          <TextInput
            style={styles.input}
            placeholder={t("boards.namePlaceholder")}
            placeholderTextColor="#666"
            value={newName}
            onChangeText={setNewName}
            autoFocus
          />
          <View style={styles.row}>
            <Pressable style={styles.button} onPress={onCreate}>
              <Text style={styles.buttonText}>{t("boards.create")}</Text>
            </Pressable>
            <Pressable style={styles.buttonGhost} onPress={() => { setCreating("off"); setNewName(""); }}>
              <Text style={styles.buttonGhostText}>{t("common.cancel")}</Text>
            </Pressable>
          </View>
        </View>
      )}

      {creating === "off" && canCreate && (
        <Pressable style={styles.button} onPress={() => setCreating("choose")}>
          <Text style={styles.buttonText}>{t("boards.newBtn")}</Text>
        </Pressable>
      )}

      {!canCreate && (
        <View style={styles.proHint}>
          <Text style={styles.proHintTitle}>{t("boards.proLockTitle")}</Text>
          <Text style={styles.proHintBody}>{t("boards.proLockBody")}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, gap: 12, backgroundColor: "#1a1a1a" },
  h1: { color: "#fadc50", fontSize: 24, fontWeight: "700" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#242424",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    padding: 12,
    gap: 12,
  },
  cardLeft: { flex: 1 },
  cardTitle: { color: "#e8e8e8", fontSize: 16, fontWeight: "600" },
  cardMeta: { color: "#888", fontSize: 12, marginTop: 4 },
  runBtn: { backgroundColor: "#fadc50", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  runBtnText: { color: "#000", fontWeight: "700" },
  iconBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 6, backgroundColor: "#3a3a3a" },
  iconBtnText: { color: "#fff", fontSize: 22, lineHeight: 22 },
  createCard: { backgroundColor: "#242424", borderRadius: 8, padding: 12, gap: 8, borderWidth: 1, borderColor: "#333" },
  input: { backgroundColor: "#1a1a1a", color: "#e8e8e8", borderRadius: 6, padding: 10, borderWidth: 1, borderColor: "#333", fontSize: 14 },
  row: { flexDirection: "row", gap: 8 },
  button: { backgroundColor: "#fadc50", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 6, alignItems: "center", flex: 1 },
  buttonText: { color: "#000", fontWeight: "700" },
  buttonGhost: { backgroundColor: "#3a3a3a", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 6, alignItems: "center", flex: 1 },
  buttonGhostText: { color: "#fff", fontWeight: "600" },
  proHint: { backgroundColor: "#2d2820", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#5a4a20" },
  proHintTitle: { color: "#fadc50", fontWeight: "700", marginBottom: 4 },
  proHintBody: { color: "#bba", fontSize: 13, lineHeight: 18 },
  emptyState: { backgroundColor: "#242424", borderRadius: 8, padding: 16, borderWidth: 1, borderColor: "#333", gap: 6 },
  emptyTitle: { color: "#e8e8e8", fontSize: 15, fontWeight: "700" },
  emptyBody: { color: "#888", fontSize: 13, lineHeight: 18 },
  chooserTitle: { color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  buttonBlock: { backgroundColor: "#fadc50", paddingVertical: 14, paddingHorizontal: 16, borderRadius: 6, alignItems: "center" },
  buttonGhostBlock: { backgroundColor: "#3a3a3a", paddingVertical: 14, paddingHorizontal: 16, borderRadius: 6, alignItems: "center" },
  cancelLink: { paddingVertical: 8, alignItems: "center" },
  cancelLinkText: { color: "#888", fontSize: 13 },
});
