import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconView } from "../components/IconView";
import { press, release, useConnectionStatus } from "../connection";
import { useBackHandler } from "../hooks";
import type { Board, BoardButton } from "../types";

interface Props {
  board: Board;
  onClose: () => void;
}

export function RunScreen({ board, onClose }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const status = useConnectionStatus();
  const [size, setSize] = useState({ w: 0, h: 0 });
  useBackHandler(onClose);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
  }, []);

  const cellW = size.w / board.gridCols;
  const cellH = size.h / board.gridRows;

  const isOnline = status.kind === "online";

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <View style={[styles.topbar, { paddingTop: insets.top + 4 }]}>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>{board.name}</Text>
        <Text style={[styles.statusDot, isOnline ? styles.dotOk : styles.dotErr]}>
          {isOnline ? "●" : "○"}
        </Text>
      </View>

      <View style={styles.grid} onLayout={onLayout}>
        {size.w > 0 &&
          board.buttons.map((b) => (
            <BoardCell
              key={b.id}
              button={b}
              left={b.x * cellW}
              top={b.y * cellH}
              width={cellW}
              height={cellH}
              disabled={!isOnline}
            />
          ))}
      </View>

      {!isOnline && (
        <View style={styles.disconnectedOverlay} pointerEvents="none">
          <Text style={styles.disconnectedText}>
            {status.kind === "offline" ? t("run.offline", { error: status.error }) : t("run.connecting")}
          </Text>
        </View>
      )}
    </View>
  );
}

interface CellProps {
  button: BoardButton;
  left: number;
  top: number;
  width: number;
  height: number;
  disabled: boolean;
}

function BoardCell({ button, left, top, width, height, disabled }: CellProps) {
  const [pressed, setPressed] = useState(false);
  const evtIdRef = useRef<string | null>(null);

  // Defensive: if the component unmounts mid-press, release the keys so we
  // don't leave the desktop-side ref count hanging.
  useEffect(() => {
    return () => {
      if (evtIdRef.current) {
        release(button.id, evtIdRef.current);
        evtIdRef.current = null;
      }
    };
  }, [button.id]);

  const onPressIn = useCallback(
    (_e: GestureResponderEvent) => {
      if (disabled || evtIdRef.current) return;
      const evtId = press(button.id, button.keys);
      evtIdRef.current = evtId;
      setPressed(true);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [button.id, button.keys, disabled],
  );

  const onPressOut = useCallback(() => {
    if (!evtIdRef.current) return;
    release(button.id, evtIdRef.current);
    evtIdRef.current = null;
    setPressed(false);
  }, [button.id]);

  const iconSize = Math.min(width, height) * 0.4;

  return (
    <View style={[styles.cell, { left, top, width, height }]}>
      <Pressable
        style={[styles.btn, pressed && styles.btnPressed, disabled && styles.btnDisabled]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        // Don't use the default 130 ms long-press grace period — we want
        // touchstart and touchend to map 1:1 onto press/release.
        delayLongPress={0}
        unstable_pressDelay={0}
      >
        {button.iconName && (
          <IconView name={button.iconName} size={iconSize} color={pressed ? "#1a1a1a" : "#e8e8e8"} />
        )}
        {button.label && (
          <Text style={[styles.btnLabel, pressed && styles.btnLabelPressed]} numberOfLines={2}>
            {button.label}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1a1a1a" },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "#242424",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  closeBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  closeText: { color: "#fff", fontSize: 26 },
  title: { flex: 1, color: "#fadc50", fontSize: 16, fontWeight: "600", textAlign: "center" },
  statusDot: { width: 40, textAlign: "center", fontSize: 18 },
  dotOk: { color: "#4caf50" },
  dotErr: { color: "#e57373" },

  grid: { flex: 1, position: "relative" },
  cell: { position: "absolute", padding: 4 },
  btn: {
    flex: 1,
    backgroundColor: "#2d2d2d",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3d3d3d",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  btnPressed: {
    backgroundColor: "#fadc50",
    borderColor: "#fadc50",
  },
  btnDisabled: { opacity: 0.4 },
  btnLabel: { color: "#e8e8e8", fontSize: 14, fontWeight: "600", textAlign: "center" },
  btnLabelPressed: { color: "#1a1a1a" },

  disconnectedOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "rgba(229, 115, 115, 0.85)",
    alignItems: "center",
  },
  disconnectedText: { color: "#1a1a1a", fontWeight: "600", fontSize: 14 },
});
