import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ColorSwatchPicker } from "../components/ColorSwatchPicker";
import { IconView } from "../components/IconView";
import { UpgradeCta } from "../components/UpgradeCta";
import { useBackHandler } from "../hooks";
import { formatCombo } from "../keys-display";
import { useIsPro } from "../tier";
import type { BoardButton } from "../types";
import { ComboBuilderScreen } from "./ComboBuilderScreen";
import { IconPickerScreen } from "./IconPickerScreen";
import { UpgradeScreen } from "./UpgradeScreen";

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
  const isPro = useIsPro();
  const [label, setLabel] = useState(initial.label ?? "");
  const [keys, setKeys] = useState(initial.keys);
  const [iconName, setIconName] = useState<string | undefined>(initial.iconName);
  const [customIcon, setCustomIcon] = useState<string | undefined>(initial.customIcon);
  const [bgColor, setBgColor] = useState<string | undefined>(initial.bgColor);
  const [iconColor, setIconColor] = useState<string | undefined>(initial.iconColor);
  const [textColor, setTextColor] = useState<string | undefined>(initial.textColor);
  const [sticky, setSticky] = useState<boolean>(initial.sticky ?? false);
  const [building, setBuilding] = useState(false);
  const [pickingIcon, setPickingIcon] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  // Only handle back at the top level; nested screens have their own handlers.
  useBackHandler(building || pickingIcon || upgrading ? () => undefined : onCancel);

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
      customIcon,
      keys,
      bgColor,
      iconColor,
      textColor,
      sticky: sticky ? true : undefined,
    });
  }

  if (upgrading) {
    return <UpgradeScreen onClose={() => setUpgrading(false)} />;
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
        initial={{ iconName, customIcon }}
        onCancel={() => setPickingIcon(false)}
        onPick={(result) => {
          setIconName(result?.iconName);
          setCustomIcon(result?.customIcon);
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

        <View style={styles.stickyRow}>
          <View style={styles.stickyText}>
            <Text style={styles.stickyTitle}>{t("buttonEditor.stickyLabel")}</Text>
            <Text style={styles.stickyHint}>{t("buttonEditor.stickyHint")}</Text>
          </View>
          <Switch
            value={sticky}
            onValueChange={setSticky}
            trackColor={{ false: "#3a3a3a", true: "#fadc50" }}
            thumbColor={sticky ? "#1a1a1a" : "#888"}
          />
        </View>

        <Field label={t("buttonEditor.positionField")}>
          <Text style={styles.muted}>
            {t("buttonEditor.positionHint", { x: initial.x, y: initial.y })}
          </Text>
        </Field>

        <Field label={t("buttonEditor.iconField")}>
          <Pressable style={styles.iconBox} onPress={() => setPickingIcon(true)}>
            {customIcon ? (
              <>
                <IconView customIcon={customIcon} size={28} color="#e8e8e8" />
                <Text style={styles.iconBoxText}>{t("buttonEditor.iconCustom")}</Text>
              </>
            ) : iconName ? (
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

        <Field label={t("buttonEditor.colorsLabel")}>
          {isPro ? (
            <View style={styles.colorsBlock}>
              <View style={styles.colorRow}>
                <Text style={styles.colorRowLabel}>{t("buttonEditor.bgColor")}</Text>
                <ColorSwatchPicker
                  value={bgColor}
                  onChange={setBgColor}
                  resetA11yLabel={t("buttonEditor.colorReset")}
                />
              </View>
              <View style={styles.colorRow}>
                <Text style={styles.colorRowLabel}>{t("buttonEditor.iconColor")}</Text>
                <ColorSwatchPicker
                  value={iconColor}
                  onChange={setIconColor}
                  resetA11yLabel={t("buttonEditor.colorReset")}
                />
              </View>
              <View style={styles.colorRow}>
                <Text style={styles.colorRowLabel}>{t("buttonEditor.textColor")}</Text>
                <ColorSwatchPicker
                  value={textColor}
                  onChange={setTextColor}
                  resetA11yLabel={t("buttonEditor.colorReset")}
                />
              </View>
            </View>
          ) : (
            <View style={styles.proLock}>
              <Text style={styles.proLockTitle}>{t("buttonEditor.colorsProLockTitle")}</Text>
              <Text style={styles.proLockBody}>{t("buttonEditor.colorsProLockBody")}</Text>
              <UpgradeCta onPress={() => setUpgrading(true)} style={styles.proLockCta} />
            </View>
          )}
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
  stickyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#242424",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#333",
  },
  stickyText: { flex: 1, gap: 2 },
  stickyTitle: { color: "#e8e8e8", fontSize: 15, fontWeight: "600" },
  stickyHint: { color: "#888", fontSize: 12, lineHeight: 16 },
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

  colorsBlock: {
    backgroundColor: "#242424",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#333",
    gap: 14,
  },
  colorRow: { gap: 8 },
  colorRowLabel: { color: "#888", fontSize: 12, fontWeight: "600" },
  proLock: {
    backgroundColor: "#2d2820",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#5a4a20",
  },
  proLockTitle: { color: "#fadc50", fontWeight: "700", marginBottom: 4 },
  proLockBody: { color: "#bba", fontSize: 13, lineHeight: 18 },
  proLockCta: { marginTop: 10 },

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
