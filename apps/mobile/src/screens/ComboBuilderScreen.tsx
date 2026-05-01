import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBackHandler } from "../hooks";
import { formatCombo, prettyKey } from "../keys-display";
import type { KeyCode } from "../protocol";

interface Props {
  initialKeys: KeyCode[];
  onCancel: () => void;
  onDone: (keys: KeyCode[]) => void;
}

const MODIFIER_TOGGLES: Array<{ label: string; code: KeyCode }> = [
  { label: "Ctrl", code: "ControlLeft" },
  { label: "Shift", code: "ShiftLeft" },
  { label: "Alt", code: "AltLeft" },
  { label: "Win", code: "MetaLeft" },
];

const LETTERS: KeyCode[] = [
  "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP",
  "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL",
  "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM",
];

const DIGITS: KeyCode[] = [
  "Digit1", "Digit2", "Digit3", "Digit4", "Digit5",
  "Digit6", "Digit7", "Digit8", "Digit9", "Digit0",
];

const FKEYS: KeyCode[] = [
  "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
];

const NAV: KeyCode[] = [
  "Escape", "Tab", "CapsLock", "Backspace", "Enter", "Space", "Delete",
  "Home", "End", "PageUp", "PageDown", "Insert",
];

const ARROWS: KeyCode[] = [
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
];

const PUNCT: KeyCode[] = [
  "Backquote", "Minus", "Equal", "BracketLeft", "BracketRight",
  "Backslash", "Semicolon", "Quote", "Comma", "Period", "Slash",
];

const ALL_MODIFIERS: KeyCode[] = [
  "ControlLeft", "ControlRight", "ShiftLeft", "ShiftRight",
  "AltLeft", "AltRight", "MetaLeft", "MetaRight",
];

export function ComboBuilderScreen({ initialKeys, onCancel, onDone }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const initial = useMemo(() => splitInitial(initialKeys), [initialKeys]);
  const [modifiers, setModifiers] = useState<Set<KeyCode>>(initial.modifiers);
  const [mainKey, setMainKey] = useState<KeyCode | null>(initial.mainKey);
  useBackHandler(onCancel);

  const combo: KeyCode[] = [...modifiers, ...(mainKey ? [mainKey] : [])];

  function toggleModifier(code: KeyCode) {
    setModifiers((cur) => {
      const next = new Set(cur);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  function pickMain(code: KeyCode) {
    setMainKey((cur) => (cur === code ? null : code));
  }

  function clearAll() {
    setModifiers(new Set());
    setMainKey(null);
  }

  return (
    <View style={styles.root}>
      <View style={[styles.topbar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={onCancel} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>{t("common.cancel")}</Text>
        </Pressable>
        <Text style={styles.title}>{t("combo.title")}</Text>
        <Pressable
          onPress={() => onDone(combo)}
          style={[styles.headerBtn, styles.doneBtn, combo.length === 0 && styles.disabled]}
          disabled={combo.length === 0}
        >
          <Text style={[styles.headerBtnText, styles.doneText]}>{t("common.done")}</Text>
        </Pressable>
      </View>

      <View style={styles.preview}>
        <Text style={styles.previewText}>{formatCombo(combo)}</Text>
        {combo.length > 0 && (
          <Pressable onPress={clearAll}>
            <Text style={styles.clearText}>{t("combo.clear")}</Text>
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Section title={t("combo.modifiers")}>
          <View style={styles.modRow}>
            {MODIFIER_TOGGLES.map((m) => (
              <Pressable
                key={m.code}
                onPress={() => toggleModifier(m.code)}
                style={[styles.modBtn, modifiers.has(m.code) && styles.modBtnActive]}
              >
                <Text style={[styles.modText, modifiers.has(m.code) && styles.modTextActive]}>
                  {m.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Section>

        <Section title={t("combo.letters")}>
          <KeyGrid keys={LETTERS} mainKey={mainKey} onPick={pickMain} cols={10} />
        </Section>

        <Section title={t("combo.digits")}>
          <KeyGrid keys={DIGITS} mainKey={mainKey} onPick={pickMain} cols={10} />
        </Section>

        <Section title={t("combo.fkeys")}>
          <KeyGrid keys={FKEYS} mainKey={mainKey} onPick={pickMain} cols={6} />
        </Section>

        <Section title={t("combo.editingNav")}>
          <KeyGrid keys={NAV} mainKey={mainKey} onPick={pickMain} cols={4} />
        </Section>

        <Section title={t("combo.arrows")}>
          <KeyGrid keys={ARROWS} mainKey={mainKey} onPick={pickMain} cols={4} />
        </Section>

        <Section title={t("combo.punctuation")}>
          <KeyGrid keys={PUNCT} mainKey={mainKey} onPick={pickMain} cols={6} />
        </Section>
      </ScrollView>
    </View>
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

interface KeyGridProps {
  keys: KeyCode[];
  mainKey: KeyCode | null;
  onPick: (k: KeyCode) => void;
  cols: number;
}

function KeyGrid({ keys, mainKey, onPick, cols }: KeyGridProps) {
  return (
    <View style={[styles.grid, { gap: 6 }]}>
      {keys.map((k) => {
        const active = mainKey === k;
        return (
          <Pressable
            key={k}
            onPress={() => onPick(k)}
            style={[styles.keyBtn, { flexBasis: `${100 / cols - 2}%` }, active && styles.keyBtnActive]}
          >
            <Text style={[styles.keyText, active && styles.keyTextActive]}>{prettyKey(k)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function splitInitial(keys: KeyCode[]): { modifiers: Set<KeyCode>; mainKey: KeyCode | null } {
  const mods = new Set<KeyCode>();
  let main: KeyCode | null = null;
  for (const k of keys) {
    if (ALL_MODIFIERS.includes(k)) {
      // Normalize R-side modifiers to L-side for the simplified UI.
      mods.add(k.replace("Right", "Left") as KeyCode);
    } else if (!main) {
      main = k;
    }
  }
  return { modifiers: mods, mainKey: main };
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
  headerBtn: { paddingHorizontal: 8, paddingVertical: 6 },
  headerBtnText: { color: "#bbb", fontSize: 15 },
  doneBtn: {},
  doneText: { color: "#fadc50", fontWeight: "700" },
  disabled: { opacity: 0.4 },
  title: { flex: 1, color: "#fadc50", fontSize: 16, fontWeight: "600", textAlign: "center" },

  preview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: "#242424",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  previewText: { color: "#e8e8e8", fontSize: 18, fontWeight: "600", flex: 1 },
  clearText: { color: "#fadc50", fontSize: 14 },

  body: { padding: 12, gap: 14, paddingBottom: 48 },
  section: { gap: 8 },
  sectionTitle: { color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },

  modRow: { flexDirection: "row", gap: 8 },
  modBtn: { flex: 1, paddingVertical: 14, borderRadius: 8, backgroundColor: "#2d2d2d", borderWidth: 1, borderColor: "#3d3d3d", alignItems: "center" },
  modBtnActive: { backgroundColor: "#fadc50", borderColor: "#fadc50" },
  modText: { color: "#e8e8e8", fontWeight: "600", fontSize: 14 },
  modTextActive: { color: "#1a1a1a" },

  grid: { flexDirection: "row", flexWrap: "wrap" },
  keyBtn: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    backgroundColor: "#2d2d2d",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#3d3d3d",
    alignItems: "center",
    minWidth: 32,
  },
  keyBtnActive: { backgroundColor: "#fadc50", borderColor: "#fadc50" },
  keyText: { color: "#e8e8e8", fontSize: 13, fontWeight: "600" },
  keyTextActive: { color: "#1a1a1a" },
});
