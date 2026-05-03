import { useTranslation } from "react-i18next";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconView } from "../components/IconView";
import { useBackHandler } from "../hooks";
import { TEMPLATES, type TemplateMeta } from "../templates";

interface Props {
  onCancel: () => void;
  onPick: (templateId: string) => void;
}

export function TemplatePickerScreen({ onCancel, onPick }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  useBackHandler(onCancel);

  return (
    <View style={styles.root}>
      <View style={[styles.topbar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={onCancel} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>{t("common.cancel")}</Text>
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>{t("templates.pickerTitle")}</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={TEMPLATES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => <Card meta={item} onPick={onPick} t={t} />}
        ListEmptyComponent={
          <Text style={styles.empty}>{t("templates.empty")}</Text>
        }
      />
    </View>
  );
}

interface CardProps {
  meta: TemplateMeta;
  onPick: (id: string) => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
}
function Card({ meta, onPick, t }: CardProps) {
  return (
    <Pressable style={styles.card} onPress={() => onPick(meta.id)}>
      <View style={styles.iconWrap}>
        <IconView name={meta.iconName} size={42} color="#fadc50" />
      </View>
      <Text style={styles.cardName} numberOfLines={1}>{meta.name}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>{meta.description}</Text>
      <Text style={styles.cardMeta}>
        {t("templates.cardMeta", {
          buttons: meta.buttonCount,
          cols: meta.gridCols,
          rows: meta.gridRows,
        })}
      </Text>
    </Pressable>
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
  headerBtnText: { color: "#fadc50", fontSize: 15, fontWeight: "600" },
  title: { flex: 1, color: "#fadc50", fontSize: 16, fontWeight: "700", textAlign: "center" },

  gridContent: { padding: 12, gap: 12 },
  gridRow: { gap: 12 },
  empty: { color: "#888", textAlign: "center", padding: 24, fontSize: 13 },

  card: {
    flex: 1,
    backgroundColor: "#242424",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#333",
    minHeight: 168,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardName: { color: "#e8e8e8", fontSize: 15, fontWeight: "700" },
  cardDesc: { color: "#bbb", fontSize: 12, marginTop: 4, lineHeight: 16 },
  cardMeta: { color: "#888", fontSize: 11, marginTop: 8 },
});
