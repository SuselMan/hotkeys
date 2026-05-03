import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  PanResponder,
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
  moveButton,
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
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverCell, setHoverCell] = useState<{ x: number; y: number } | null>(null);

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

  function onDragStart(id: string) {
    setDraggingId(id);
    setHoverCell(null);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
  function onDragMove(originX: number, originY: number, dx: number, dy: number) {
    if (cellW <= 0 || cellH <= 0) return;
    const cx = (originX + 0.5) * cellW + dx;
    const cy = (originY + 0.5) * cellH + dy;
    if (cx < 0 || cy < 0 || cx >= gridSize.w || cy >= gridSize.h) {
      setHoverCell((prev) => (prev ? null : prev));
      return;
    }
    const tx = Math.floor(cx / cellW);
    const ty = Math.floor(cy / cellH);
    setHoverCell((prev) => (prev && prev.x === tx && prev.y === ty ? prev : { x: tx, y: ty }));
  }
  function onDragEnd(id: string, originX: number, originY: number, dx: number, dy: number) {
    setDraggingId(null);
    setHoverCell(null);
    if (cellW <= 0 || cellH <= 0) return false;
    const cx = (originX + 0.5) * cellW + dx;
    const cy = (originY + 0.5) * cellH + dy;
    if (cx < 0 || cy < 0 || cx >= gridSize.w || cy >= gridSize.h) return false;
    const tx = Math.floor(cx / cellW);
    const ty = Math.floor(cy / cellH);
    if (tx === originX && ty === originY) return false;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    void moveButton(boardId, id, tx, ty);
    return true;
  }

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

      <ScrollView contentContainerStyle={styles.body} scrollEnabled={!draggingId}>
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
              cells.map(({ x, y, btn }) => {
                if (btn) {
                  const isThisDragging = draggingId === btn.id;
                  const isOtherDragging = draggingId !== null && !isThisDragging;
                  const isHovered = !!draggingId && hoverCell?.x === x && hoverCell?.y === y;
                  return (
                    <DraggableCell
                      key={btn.id}
                      btn={btn}
                      x={x}
                      y={y}
                      cellW={cellW}
                      cellH={cellH}
                      isDragging={isThisDragging}
                      isDimmed={isOtherDragging}
                      isHovered={isHovered}
                      onTap={() => tapCell(x, y)}
                      onDragStart={onDragStart}
                      onDragMove={onDragMove}
                      onDragEnd={onDragEnd}
                    />
                  );
                }
                const isHovered = !!draggingId && hoverCell?.x === x && hoverCell?.y === y;
                const isDropMode = !!draggingId;
                return (
                  <Pressable
                    key={`${x}-${y}`}
                    onPress={() => tapCell(x, y)}
                    disabled={!!draggingId}
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
                    <View
                      style={[
                        styles.cellInner,
                        styles.cellEmpty,
                        isDropMode && styles.cellEmptyDropMode,
                        isHovered && styles.cellHovered,
                      ]}
                    >
                      <Text style={styles.cellPlus}>+</Text>
                    </View>
                  </Pressable>
                );
              })}
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

const LONG_PRESS_MS = 250;
const TAP_SLOP_PX = 8;

interface DraggableCellProps {
  btn: BoardButton;
  x: number;
  y: number;
  cellW: number;
  cellH: number;
  isDragging: boolean;
  isDimmed: boolean;
  isHovered: boolean;
  onTap: () => void;
  onDragStart: (id: string) => void;
  onDragMove: (originX: number, originY: number, dx: number, dy: number) => void;
  /** Returns true if the move was applied — caller will re-render the new layout. */
  onDragEnd: (id: string, originX: number, originY: number, dx: number, dy: number) => boolean;
}

function DraggableCell({
  btn,
  x,
  y,
  cellW,
  cellH,
  isDragging,
  isDimmed,
  isHovered,
  onTap,
  onDragStart,
  onDragMove,
  onDragEnd,
}: DraggableCellProps) {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragActive = useRef(false);
  const movedPastSlop = useRef(false);

  // Reset translation whenever the cell remounts at a new (x, y) — covers the
  // case where a successful drop re-renders with new coords; the spring-back
  // path resets explicitly.
  useEffect(() => {
    pan.setValue({ x: 0, y: 0 });
  }, [x, y, pan]);

  function clearLongPress() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => false,
        // We claim on start, so onMove only matters after yielding to ScrollView —
        // and we don't want to steal the touch back in that case.
        onMoveShouldSetPanResponder: () => false,
        // Yield to the parent ScrollView until the long-press has actually
        // entered drag mode — that way a vertical swipe over a button still
        // scrolls the page like the user expects.
        onPanResponderTerminationRequest: () => !dragActive.current,
        onPanResponderGrant: () => {
          movedPastSlop.current = false;
          dragActive.current = false;
          pan.setValue({ x: 0, y: 0 });
          longPressTimer.current = setTimeout(() => {
            longPressTimer.current = null;
            dragActive.current = true;
            onDragStart(btn.id);
          }, LONG_PRESS_MS);
        },
        onPanResponderMove: (_e, gs) => {
          if (!dragActive.current) {
            if (Math.abs(gs.dx) > TAP_SLOP_PX || Math.abs(gs.dy) > TAP_SLOP_PX) {
              movedPastSlop.current = true;
              clearLongPress();
            }
            return;
          }
          pan.setValue({ x: gs.dx, y: gs.dy });
          onDragMove(x, y, gs.dx, gs.dy);
        },
        onPanResponderRelease: (_e, gs) => {
          clearLongPress();
          if (dragActive.current) {
            const moved = onDragEnd(btn.id, x, y, gs.dx, gs.dy);
            dragActive.current = false;
            if (moved) {
              // Layout will re-render with the new coords; reset transform so
              // the cell snaps onto the new position without a stale offset.
              pan.setValue({ x: 0, y: 0 });
            } else {
              Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false,
                friction: 7,
              }).start();
            }
            return;
          }
          if (!movedPastSlop.current) onTap();
        },
        onPanResponderTerminate: () => {
          clearLongPress();
          if (dragActive.current) {
            dragActive.current = false;
            onDragEnd(btn.id, x, y, 0, 0);
          }
          pan.setValue({ x: 0, y: 0 });
        },
      }),
    // Recreate when the origin cell changes so the closure captures the right (x, y).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [btn.id, x, y, cellW, cellH],
  );

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[
        styles.cell,
        {
          left: x * cellW,
          top: y * cellH,
          width: cellW,
          height: cellH,
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: isDragging ? 1.05 : 1 },
          ],
          zIndex: isDragging ? 10 : 1,
          opacity: isDimmed ? 0.6 : 1,
        },
        isDragging && styles.cellLifted,
      ]}
    >
      <View
        style={[
          styles.cellInner,
          styles.cellFilled,
          isHovered && styles.cellHovered,
        ]}
      >
        {btn.iconName && (
          <IconView name={btn.iconName} size={Math.min(cellW, cellH) * 0.35} color="#e8e8e8" />
        )}
        {btn.label ? (
          <Text style={styles.cellLabel} numberOfLines={2}>
            {btn.label}
          </Text>
        ) : null}
        <Text style={styles.cellCombo} numberOfLines={1}>
          {formatCombo(btn.keys)}
        </Text>
      </View>
    </Animated.View>
  );
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
  cellEmptyDropMode: { borderColor: "#5a5a5a" },
  cellFilled: { backgroundColor: "#2d2d2d", borderWidth: 1, borderColor: "#3d3d3d" },
  cellHovered: { borderColor: "#fadc50", borderWidth: 2 },
  cellLifted: {
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  cellLabel: { color: "#e8e8e8", fontSize: 11, fontWeight: "600", textAlign: "center" },
  cellCombo: { color: "#888", fontSize: 9, marginTop: 2, textAlign: "center" },
  cellPlus: { color: "#555", fontSize: 22 },
  gridHint: { color: "#888", fontSize: 12, lineHeight: 16, marginTop: 4 },

  orphan: { padding: 10, backgroundColor: "#2a2222", borderRadius: 6, borderWidth: 1, borderColor: "#4a3030" },
  orphanText: { color: "#e8b8b8", fontSize: 13 },
});
