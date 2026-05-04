import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconView } from "../components/IconView";
import { useBackHandler } from "../hooks";
import { getSvg, getSvgSync, listAllIcons, searchIcons, type IconMeta } from "../icons";

interface Props {
  initial: string | null;
  onCancel: () => void;
  onPick: (name: string | null) => void;
}

const COLS = 5;
const SEARCH_LIMIT = 120;

export function IconPickerScreen({ initial, onCancel, onPick }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  // Name of the icon whose SVG we're currently awaiting before closing the
  // picker. Disables the rest of the grid + shows a spinner on the cell.
  const [resolving, setResolving] = useState<string | null>(null);
  const results = useMemo(() => searchIcons(query, SEARCH_LIMIT), [query]);
  const totalIcons = useMemo(() => listAllIcons().length, []);
  useBackHandler(() => {
    if (resolving) return;
    onCancel();
  });

  // Pad results so FlatList rows align in a fixed grid.
  const padded: Array<IconMeta | null> = useMemo(() => {
    const r: Array<IconMeta | null> = [...results];
    while (r.length % COLS !== 0) r.push(null);
    return r;
  }, [results]);

  async function handlePick(name: string) {
    if (resolving) return;
    // Bundled icons resolve synchronously — close immediately, no spinner.
    if (getSvgSync(name) !== null) {
      onPick(name);
      return;
    }
    setResolving(name);
    try {
      const svg = await getSvg(name);
      if (svg !== null) {
        onPick(name);
        return;
      }
      Alert.alert(t("iconPicker.loadFailedTitle"), t("iconPicker.loadFailedBody"));
    } finally {
      setResolving(null);
    }
  }

  return (
    <View style={styles.root}>
      <View style={[styles.topbar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={onCancel} style={styles.headerBtn} disabled={!!resolving}>
          <Text style={[styles.headerBtnText, !!resolving && styles.disabled]}>
            {t("common.cancel")}
          </Text>
        </Pressable>
        <Text style={styles.title}>{t("iconPicker.title")}</Text>
        <Pressable onPress={() => onPick(null)} style={styles.headerBtn} disabled={!!resolving}>
          <Text style={[styles.headerBtnText, !!resolving && styles.disabled]}>
            {t("common.none")}
          </Text>
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          placeholder={t("iconPicker.searchPlaceholder", { count: totalIcons })}
          placeholderTextColor="#666"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
          editable={!resolving}
        />
      </View>

      <FlatList
        data={padded}
        numColumns={COLS}
        keyExtractor={(it, i) => (it ? it.name : `pad-${i}`)}
        contentContainerStyle={styles.gridContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          if (!item) return <View style={styles.cell} />;
          const active = item.name === initial;
          const isResolving = resolving === item.name;
          return (
            <Pressable
              style={[styles.cell, styles.cellTouch, active && styles.cellActive]}
              onPress={() => void handlePick(item.name)}
              disabled={!!resolving && !isResolving}
            >
              <IconView name={item.name} size={28} color={active ? "#1a1a1a" : "#e8e8e8"} />
              <Text
                style={[styles.cellLabel, active && styles.cellLabelActive]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              {isResolving && (
                <View style={styles.spinnerOverlay}>
                  <ActivityIndicator size="small" color="#fadc50" />
                </View>
              )}
            </Pressable>
          );
        }}
      />
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
  headerBtn: { paddingHorizontal: 8, paddingVertical: 6, minWidth: 60 },
  headerBtnText: { color: "#fadc50", fontSize: 15, fontWeight: "700" },
  disabled: { opacity: 0.4 },
  title: { flex: 1, color: "#fadc50", fontSize: 16, fontWeight: "600", textAlign: "center" },

  searchRow: { padding: 12, backgroundColor: "#242424", borderBottomWidth: 1, borderBottomColor: "#333" },
  search: {
    backgroundColor: "#1a1a1a",
    color: "#e8e8e8",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#333",
    fontSize: 15,
  },

  gridContent: { padding: 8, paddingBottom: 40 },
  cell: {
    flex: 1 / COLS,
    aspectRatio: 0.85,
    margin: 4,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    padding: 6,
    borderRadius: 8,
  },
  cellTouch: { backgroundColor: "#242424", borderWidth: 1, borderColor: "#333" },
  cellActive: { backgroundColor: "#fadc50", borderColor: "#fadc50" },
  cellLabel: { color: "#bbb", fontSize: 9, textAlign: "center" },
  cellLabelActive: { color: "#1a1a1a", fontWeight: "600" },
  spinnerOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(36,36,36,0.7)",
    borderRadius: 8,
  },
});
