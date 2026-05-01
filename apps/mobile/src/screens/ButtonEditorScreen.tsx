import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconView } from "../components/IconView";
import { useBackHandler } from "../hooks";
import { formatCombo } from "../keys-display";
import type { BoardButton } from "../types";
import { ComboBuilderScreen } from "./ComboBuilderScreen";
import { IconPickerScreen } from "./IconPickerScreen";

interface Props {
  initial: BoardButton;
  /** True when the user opened an empty cell — show "Add" instead of "Save" + no Delete. */
  isNew: boolean;
  onCancel: () => void;
  onSave: (btn: BoardButton) => void;
  onDelete?: () => void;
}

export function ButtonEditorScreen({ initial, isNew, onCancel, onSave, onDelete }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [label, setLabel] = useState(initial.label ?? "");
  const [keys, setKeys] = useState(initial.keys);
  const [iconName, setIconName] = useState<string | undefined>(initial.iconName);
  const [building, setBuilding] = useState(false);
  const [pickingIcon, setPickingIcon] = useState(false);

  // Only handle back at the top level; nested screens have their own handlers.
  useBackHandler(building || pickingIcon ? () => undefined : onCancel);

  function confirmDelete() {
    if (!onDelete) return;
    Alert.alert(t("buttonEditor.deleteTitle"), "", [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("common.delete"), style: "destructive", onPress: onDelete },
    ]);
  }

  function save() {
    onSave({
      ...initial,
      label: label.trim() || undefined,
      iconName,
      keys,
    });
  }

  if (building) {
    return (
      <ComboBuilderScreen
        initialKeys={keys}
        onCancel={() => setBuilding(false)}
        onDone={(next) => {
          setKeys(next);
          setBuilding(false);
        }}
      />
    );
  }

  if (pickingIcon) {
    return (
      <IconPickerScreen
        initial={iconName ?? null}
        onCancel={() => setPickingIcon(false)}
        onPick={(name) => {
          setIconName(name ?? undefined);
          setPickingIcon(false);
        }}
      />
    );
  }

  const canSave = keys.length > 0;

  return (
    <View style={styles.root}>
      <View style={[styles.topbar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={onCancel} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>{t("common.cancel")}</Text>
        </Pressable>
        <Text style={styles.title}>{isNew ? t("buttonEditor.titleNew") : t("buttonEditor.titleEdit")}</Text>
        <Pressable
          onPress={save}
          style={[styles.headerBtn, !canSave && styles.disabled]}
          disabled={!canSave}
        >
          <Text style={[styles.headerBtnText, styles.doneText]}>
            {isNew ? t("buttonEditor.addBtn") : t("buttonEditor.saveBtn")}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Field label={t("buttonEditor.labelField")}>
          <TextInput
            style={styles.input}
            value={label}
            onChangeText={setLabel}
            placeholder={t("buttonEditor.labelPlaceholder")}
            placeholderTextColor="#666"
            autoCapitalize="sentences"
          />
        </Field>

        <Field label={t("buttonEditor.comboField")}>
          <Pressable style={styles.comboBox} onPress={() => setBuilding(true)}>
            <Text style={[styles.comboText, keys.length === 0 && styles.comboPlaceholder]}>
              {keys.length === 0 ? t("buttonEditor.comboTapToSet") : formatCombo(keys)}
            </Text>
          </Pressable>
        </Field>

        <Field label={t("buttonEditor.positionField")}>
          <Text style={styles.muted}>
            {t("buttonEditor.positionHint", { x: initial.x, y: initial.y })}
          </Text>
        </Field>

        <Field label={t("buttonEditor.iconField")}>
          <Pressable style={styles.iconBox} onPress={() => setPickingIcon(true)}>
            {iconName ? (
              <>
                <IconView name={iconName} size={28} color="#e8e8e8" />
                <Text style={styles.iconBoxText}>{iconName}</Text>
              </>
            ) : (
              <Text style={[styles.iconBoxText, styles.iconBoxPlaceholder]}>
                {t("buttonEditor.iconTapToPick")}
              </Text>
            )}
          </Pressable>
        </Field>

        {onDelete && (
          <Pressable style={styles.deleteBtn} onPress={confirmDelete}>
            <Text style={styles.deleteText}>{t("buttonEditor.deleteBtn")}</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
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
  headerBtn: { paddingHorizontal: 8, paddingVertical: 6, minWidth: 70 },
  headerBtnText: { color: "#bbb", fontSize: 15 },
  doneText: { color: "#fadc50", fontWeight: "700", textAlign: "right" },
  disabled: { opacity: 0.4 },
  title: { flex: 1, color: "#fadc50", fontSize: 16, fontWeight: "600", textAlign: "center" },

  body: { padding: 16, gap: 18 },
  field: { gap: 6 },
  fieldLabel: { color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  input: {
    backgroundColor: "#242424",
    color: "#e8e8e8",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#333",
    fontSize: 16,
  },
  comboBox: {
    backgroundColor: "#242424",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#333",
  },
  comboText: { color: "#e8e8e8", fontSize: 16, fontWeight: "600" },
  comboPlaceholder: { color: "#666", fontWeight: "400" },
  iconBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#242424",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#333",
  },
  iconBoxText: { color: "#e8e8e8", fontSize: 15 },
  iconBoxPlaceholder: { color: "#666" },
  muted: { color: "#888", fontSize: 13, lineHeight: 18 },

  deleteBtn: {
    backgroundColor: "#3a2222",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#5a2828",
    alignItems: "center",
    marginTop: 12,
  },
  deleteText: { color: "#e57373", fontWeight: "700" },
});
