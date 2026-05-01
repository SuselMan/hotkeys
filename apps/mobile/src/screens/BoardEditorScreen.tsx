import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type LayoutChangeEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  newButtonId,
  removeButton,
  updateBoard,
  upsertButton,
  useBoard,
} from "../boards";
import { IconView } from "../components/IconView";
import { useBackHandler } from "../hooks";
import { formatCombo } from "../keys-display";
import type { BoardButton } from "../types";
import { ButtonEditorScreen } from "./ButtonEditorScreen";

const GRID_MIN_COLS = 2;
const GRID_MAX_COLS = 10;
const GRID_MIN_ROWS = 2;
const GRID_MAX_ROWS = 14;

interface Props {
  boardId: string;
  onClose: () => void;
}

interface Editing {
  button: BoardButton;
  isNew: boolean;
}

export function BoardEditorScreen({ boardId, onClose }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const board = useBoard(boardId);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [gridSize, setGridSize] = useState({ w: 0, h: 0 });

  // Only own the back press when no nested editor is up — those have their
  // own handlers and should pop themselves first.
  useBackHandler(editing ? () => undefined : onClose);

  const onGridLayout = useCallback((e: LayoutChangeEvent) => {
    setGridSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
  }, []);

  if (!board) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.muted}>{t("boardEditor.loading")}</Text>
      </View>
    );
  }

  if (editing) {
    return (
      <ButtonEditorScreen
        initial={editing.button}
        isNew={editing.isNew}
        onCancel={() => setEditing(null)}
        onSave={async (btn) => {
          await upsertButton(boardId, btn);
          setEditing(null);
        }}
        onDelete={
          editing.isNew
            ? undefined
            : async () => {
                await removeButton(boardId, editing.button.id);
                setEditing(null);
              }
        }
      />
    );
  }

  function changeName(name: string) {
    void updateBoard(boardId, { name });
  }
  function changeCols(delta: number) {
    if (!board) return;
    const next = clamp(board.gridCols + delta, GRID_MIN_COLS, GRID_MAX_COLS);
    if (next !== board.gridCols) void updateBoard(boardId, { gridCols: next });
  }
  function changeRows(delta: number) {
    if (!board) return;
    const next = clamp(board.gridRows + delta, GRID_MIN_ROWS, GRID_MAX_ROWS);
    if (next !== board.gridRows) void updateBoard(boardId, { gridRows: next });
  }

  function tapCell(x: number, y: number) {
    const existing = board!.buttons.find((b) => b.x === x && b.y === y);
    if (existing) {
      setEditing({ button: existing, isNew: false });
    } else {
      setEditing({
        button: { id: newButtonId(), x, y, label: "", keys: [] },
        isNew: true,
      });
    }
  }

  const cellW = gridSize.w / board.gridCols;
  const cellH = gridSize.h / board.gridRows;

  // Render every grid cell explicitly so empty ones can be tapped to add.
  const cells: Array<{ x: number; y: number; btn: BoardButton | null }> = [];
  for (let y = 0; y < board.gridRows; y++) {
    for (let x = 0; x < board.gridCols; x++) {
      const btn = board.buttons.find((b) => b.x === x && b.y === y) ?? null;
      cells.push({ x, y, btn });
    }
  }

  // Buttons outside grid (after a shrink) — surface in a list so they aren't lost silently.
  const orphans = board.buttons.filter((b) => b.x >= board.gridCols || b.y >= board.gridRows);

  return (
    <View style={styles.root}>
      <View style={[styles.topbar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={onClose} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>{t("common.done")}</Text>
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>{board.name}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Field label={t("boardEditor.nameLabel")}>
          <TextInput
            style={styles.input}
            value={board.name}
            onChangeText={changeName}
            placeholder={t("boardEditor.namePlaceholder")}
            placeholderTextColor="#666"
          />
        </Field>

        <Field label={t("boardEditor.gridLabel")}>
          <View style={styles.gridControls}>
            <Counter
              label={t("boardEditor.columns")}
              value={board.gridCols}
              min={GRID_MIN_COLS}
              max={GRID_MAX_COLS}
              onChange={changeCols}
            />
            <Counter
              label={t("boardEditor.rows")}
              value={board.gridRows}
              min={GRID_MIN_ROWS}
              max={GRID_MAX_ROWS}
              onChange={changeRows}
            />
          </View>
        </Field>

        <Field label={t("boardEditor.layoutLabel")}>
          <View style={styles.gridFrame} onLayout={onGridLayout}>
            {gridSize.w > 0 &&
              cells.map(({ x, y, btn }) => (
                <Pressable
                  key={`${x}-${y}`}
                  onPress={() => tapCell(x, y)}
                  style={[
                    styles.cell,
                    {
                      left: x * cellW,
                      top: y * cellH,
                      width: cellW,
                      height: cellH,
                    },
                  ]}
                >
                  <View style={[styles.cellInner, btn ? styles.cellFilled : styles.cellEmpty]}>
                    {btn ? (
                      <>
                        {btn.iconName && <IconView name={btn.iconName} size={Math.min(cellW, cellH) * 0.35} color="#e8e8e8" />}
                        {btn.label ? (
                          <Text style={styles.cellLabel} numberOfLines={2}>{btn.label}</Text>
                        ) : null}
                        <Text style={styles.cellCombo} numberOfLines={1}>
                          {formatCombo(btn.keys)}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.cellPlus}>+</Text>
                    )}
                  </View>
                </Pressable>
              ))}
          </View>
          <Text style={styles.gridHint}>{t("boardEditor.layoutHint")}</Text>
        </Field>

        {orphans.length > 0 && (
          <Field label={t("boardEditor.offGridTitle")}>
            <Text style={styles.muted}>{t("boardEditor.offGridHint")}</Text>
            {orphans.map((b) => (
              <Pressable
                key={b.id}
                style={styles.orphan}
                onPress={() => setEditing({ button: b, isNew: false })}
              >
                <Text style={styles.orphanText}>
                  ({b.x},{b.y}) {b.label ?? "—"} · {formatCombo(b.keys)}
                </Text>
              </Pressable>
            ))}
          </Field>
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
    <View style={{ gap: 8 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

interface CounterProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (delta: number) => void;
}
function Counter({ label, value, min, max, onChange }: CounterProps) {
  return (
    <View style={styles.counter}>
      <Text style={styles.counterLabel}>{label}</Text>
      <View style={styles.counterRow}>
        <Pressable
          onPress={() => onChange(-1)}
          style={[styles.counterBtn, value <= min && styles.disabled]}
          disabled={value <= min}
        >
          <Text style={styles.counterBtnText}>−</Text>
        </Pressable>
        <Text style={styles.counterValue}>{value}</Text>
        <Pressable
          onPress={() => onChange(1)}
          style={[styles.counterBtn, value >= max && styles.disabled]}
          disabled={value >= max}
        >
          <Text style={styles.counterBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1a1a1a" },
  center: { alignItems: "center", justifyContent: "center" },
  muted: { color: "#888", fontSize: 13, lineHeight: 18 },

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
  title: { flex: 1, color: "#fadc50", fontSize: 16, fontWeight: "600", textAlign: "center" },

  body: { padding: 16, gap: 18 },
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

  gridControls: { flexDirection: "row", gap: 12 },
  counter: { flex: 1, backgroundColor: "#242424", borderRadius: 8, padding: 12, borderWidth: 1, borderColor: "#333" },
  counterLabel: { color: "#888", fontSize: 11, fontWeight: "600", textTransform: "uppercase", marginBottom: 6, letterSpacing: 0.5 },
  counterRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  counterBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 6, backgroundColor: "#3a3a3a" },
  counterBtnText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  counterValue: { color: "#e8e8e8", fontSize: 18, fontWeight: "700" },
  disabled: { opacity: 0.4 },

  gridFrame: {
    aspectRatio: 1,
    width: "100%",
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    position: "relative",
  },
  cell: { position: "absolute", padding: 3 },
  cellInner: {
    flex: 1,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  cellEmpty: { borderWidth: 1, borderColor: "#333", borderStyle: "dashed" },
  cellFilled: { backgroundColor: "#2d2d2d", borderWidth: 1, borderColor: "#3d3d3d" },
  cellLabel: { color: "#e8e8e8", fontSize: 11, fontWeight: "600", textAlign: "center" },
  cellCombo: { color: "#888", fontSize: 9, marginTop: 2, textAlign: "center" },
  cellPlus: { color: "#555", fontSize: 22 },
  gridHint: { color: "#888", fontSize: 12, lineHeight: 16, marginTop: 4 },

  orphan: { padding: 10, backgroundColor: "#2a2222", borderRadius: 6, borderWidth: 1, borderColor: "#4a3030" },
  orphanText: { color: "#e8b8b8", fontSize: 13 },
});
