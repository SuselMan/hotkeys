import * as DocumentPicker from "expo-document-picker";
import { useEffect, useMemo, useState } from "react";
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
import { UpgradeCta } from "../components/UpgradeCta";
import { useBackHandler } from "../hooks";
import { getSvg, getSvgSync, listAllIcons, searchIcons, type IconMeta } from "../icons";
import { useIsPro } from "../tier";
import {
  extOf,
  listUserIcons,
  saveUserIcon,
  UserIconError,
  type UserIconExt,
} from "../user-icons";
import { UpgradeScreen } from "./UpgradeScreen";

export interface IconPickerInitial {
  iconName?: string;
  customIcon?: string;
}

export interface IconPickerResult {
  iconName?: string;
  customIcon?: string;
}

interface Props {
  initial: IconPickerInitial;
  onCancel: () => void;
  /** `null` means clear, otherwise exactly one of `iconName` / `customIcon` is set. */
  onPick: (result: IconPickerResult | null) => void;
}

const COLS = 5;
const SEARCH_LIMIT = 120;

export function IconPickerScreen({ initial, onCancel, onPick }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const isPro = useIsPro();
  const [query, setQuery] = useState("");
  // Name of the icon whose SVG we're currently awaiting before closing the
  // picker. Disables the rest of the grid + shows a spinner on the cell.
  const [resolving, setResolving] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [userIcons, setUserIcons] = useState<string[] | null>(null);
  const results = useMemo(() => searchIcons(query, SEARCH_LIMIT), [query]);
  const totalIcons = useMemo(() => listAllIcons().length, []);
  useBackHandler(() => {
    if (resolving || uploading || upgrading) return;
    onCancel();
  });

  useEffect(() => {
    void listUserIcons().then(setUserIcons);
  }, []);

  // Pad results so FlatList rows align in a fixed grid.
  const padded: Array<IconMeta | null> = useMemo(() => {
    const r: Array<IconMeta | null> = [...results];
    while (r.length % COLS !== 0) r.push(null);
    return r;
  }, [results]);

  async function handlePickMaterial(name: string) {
    if (resolving || uploading) return;
    if (getSvgSync(name) !== null) {
      onPick({ iconName: name });
      return;
    }
    setResolving(name);
    try {
      const svg = await getSvg(name);
      if (svg !== null) {
        onPick({ iconName: name });
        return;
      }
      Alert.alert(t("iconPicker.loadFailedTitle"), t("iconPicker.loadFailedBody"));
    } finally {
      setResolving(null);
    }
  }

  function handlePickCustom(basename: string) {
    if (resolving || uploading) return;
    onPick({ customIcon: basename });
  }

  function openUpgrade() {
    setUpgrading(true);
  }

  async function handleUpload() {
    if (uploading || resolving) return;
    if (!isPro) {
      openUpgrade();
      return;
    }
    setUploading(true);
    try {
      // `*/*` because Android's picker often hides files whose MIME the
      // system didn't pre-register — SVG is a common casualty. We re-check
      // the type ourselves below via mimeType + filename.
      const picked = await DocumentPicker.getDocumentAsync({
        type: ["image/png", "image/svg+xml", "*/*"],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (picked.canceled) return;
      const asset = picked.assets[0];
      if (!asset) return;
      const ext = inferExt(asset.mimeType, asset.name);
      if (!ext) {
        Alert.alert(t("iconPicker.uploadErrorTitle"), t("iconPicker.errUnsupportedType"));
        return;
      }
      try {
        const basename = await saveUserIcon(asset.uri, asset.size ?? 0, ext);
        const next = await listUserIcons();
        setUserIcons(next);
        onPick({ customIcon: basename });
      } catch (e) {
        const reason = e instanceof UserIconError ? e.reason : "writeFailed";
        Alert.alert(
          t("iconPicker.uploadErrorTitle"),
          reason === "tooLarge"
            ? t("iconPicker.errTooLarge")
            : reason === "unsupportedType"
              ? t("iconPicker.errUnsupportedType")
              : t("iconPicker.errReadFailed"),
        );
      }
    } finally {
      setUploading(false);
    }
  }

  if (upgrading) {
    return <UpgradeScreen onClose={() => setUpgrading(false)} />;
  }

  return (
    <View style={styles.root}>
      <View style={[styles.topbar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={onCancel} style={styles.headerBtn} disabled={!!resolving || uploading}>
          <Text style={[styles.headerBtnText, (!!resolving || uploading) && styles.disabled]}>
            {t("common.cancel")}
          </Text>
        </Pressable>
        <Text style={styles.title}>{t("iconPicker.title")}</Text>
        <Pressable onPress={() => onPick(null)} style={styles.headerBtn} disabled={!!resolving || uploading}>
          <Text style={[styles.headerBtnText, (!!resolving || uploading) && styles.disabled]}>
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
          editable={!resolving && !uploading}
        />
      </View>

      <FlatList
        data={padded}
        numColumns={COLS}
        keyExtractor={(it, i) => (it ? it.name : `pad-${i}`)}
        contentContainerStyle={styles.gridContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <YourIconsHeader
            isPro={isPro}
            userIcons={userIcons}
            currentCustom={initial.customIcon}
            uploading={uploading}
            onUpload={handleUpload}
            onPickCustom={handlePickCustom}
            onOpenUpgrade={openUpgrade}
          />
        }
        renderItem={({ item }) => {
          if (!item) return <View style={styles.cell} />;
          const active = item.name === initial.iconName && !initial.customIcon;
          const isResolving = resolving === item.name;
          return (
            <Pressable
              style={[styles.cell, styles.cellTouch, active && styles.cellActive]}
              onPress={() => void handlePickMaterial(item.name)}
              disabled={(!!resolving && !isResolving) || uploading}
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

interface HeaderProps {
  isPro: boolean;
  userIcons: string[] | null;
  currentCustom?: string;
  uploading: boolean;
  onUpload: () => void;
  onPickCustom: (basename: string) => void;
  onOpenUpgrade: () => void;
}

function YourIconsHeader({
  isPro,
  userIcons,
  currentCustom,
  uploading,
  onUpload,
  onPickCustom,
  onOpenUpgrade,
}: HeaderProps) {
  const { t } = useTranslation();
  const hasIcons = (userIcons?.length ?? 0) > 0;
  return (
    <View style={styles.headerBlock}>
      <Text style={styles.sectionLabel}>{t("iconPicker.yourIconsHeader")}</Text>
      <View style={styles.userRow}>
        <Pressable
          style={[styles.uploadCell, !isPro && styles.uploadCellLocked]}
          onPress={onUpload}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#fadc50" />
          ) : (
            <>
              <Text style={[styles.uploadPlus, !isPro && styles.uploadPlusLocked]}>＋</Text>
              <Text style={[styles.uploadLabel, !isPro && styles.uploadLabelLocked]}>
                {isPro ? t("iconPicker.uploadBtn") : t("iconPicker.uploadLocked")}
              </Text>
            </>
          )}
        </Pressable>
        {(userIcons ?? []).map((basename) => {
          const active = basename === currentCustom;
          return (
            <Pressable
              key={basename}
              style={[styles.userCell, active && styles.userCellActive]}
              onPress={() => onPickCustom(basename)}
            >
              <IconView customIcon={basename} size={32} color={active ? "#1a1a1a" : "#e8e8e8"} />
            </Pressable>
          );
        })}
      </View>
      {!hasIcons && (
        <Text style={styles.userHint}>
          {isPro ? t("iconPicker.uploadHint") : t("iconPicker.proLockBody")}
        </Text>
      )}
      {!isPro && (
        <UpgradeCta onPress={onOpenUpgrade} style={styles.userCta} />
      )}
      <Text style={styles.sectionLabel}>{t("iconPicker.materialHeader")}</Text>
    </View>
  );
}

function inferExt(mimeType: string | undefined, name: string | undefined): UserIconExt | null {
  if (mimeType === "image/svg+xml") return "svg";
  if (mimeType === "image/png") return "png";
  if (name) {
    const lower = name.toLowerCase();
    const e = extOf(lower);
    if (e) return e;
  }
  return null;
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

  headerBlock: { paddingHorizontal: 4, paddingTop: 8, gap: 6 },
  sectionLabel: {
    color: "#888",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 4,
    marginLeft: 4,
  },
  userRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingVertical: 4 },
  userHint: { color: "#888", fontSize: 12, lineHeight: 16, marginLeft: 4, marginBottom: 4 },
  userCta: { alignSelf: "flex-start", marginLeft: 4, marginBottom: 8 },
  uploadCell: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#5a4a20",
    borderStyle: "dashed",
    backgroundColor: "#2d2820",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  uploadCellLocked: { borderColor: "#3a3a3a", backgroundColor: "#242424" },
  uploadPlus: { color: "#fadc50", fontSize: 20, fontWeight: "700", lineHeight: 22 },
  uploadPlusLocked: { color: "#666" },
  uploadLabel: { color: "#fadc50", fontSize: 9, fontWeight: "600" },
  uploadLabelLocked: { color: "#888" },
  userCell: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#242424",
    alignItems: "center",
    justifyContent: "center",
  },
  userCellActive: { backgroundColor: "#fadc50", borderColor: "#fadc50" },

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
