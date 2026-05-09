import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  DEFAULT_BG,
  DEFAULT_BORDER,
  DEFAULT_FG,
  PRESSED_FG,
} from "../colors-palette";
import { IconView } from "../components/IconView";
import { press, release, useConnectionStatus } from "../connection";
import { useBackHandler } from "../hooks";
import type { Board, BoardButton } from "../types";

interface Props {
  board: Board;
  onClose: () => void;
}

interface LiveTouch {
  /** Button currently held by this finger; "" means the touch landed in dead space. */
  buttonId: string;
  /** Event id from the press dispatch; "" when sticky-tap or no-op. */
  evtId: string;
  /**
   * Once a live (non-sticky) touch leaves its origin cell we release the keys
   * but keep the touch tracked, so a subsequent move back into the same cell
   * does NOT re-press — only a fresh finger does.
   */
  released: boolean;
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

  // Cell -> button index for O(1) hit-test on every touch event.
  const buttonsByCell = useMemo(() => {
    const m = new Map<string, BoardButton>();
    for (const b of board.buttons) m.set(`${b.x},${b.y}`, b);
    return m;
  }, [board.buttons]);

  // Live (held) touches keyed by RN touch identifier.
  const liveTouchesRef = useRef<Map<string, LiveTouch>>(new Map());
  // Latched (sticky) buttons → press evtId. State so cells re-render on toggle.
  const [latched, setLatched] = useState<Map<string, string>>(() => new Map());
  const latchedRef = useRef(latched);
  useEffect(() => {
    latchedRef.current = latched;
  }, [latched]);
  // Live-pressed button ids, mirrors `liveTouchesRef` state for visual feedback.
  const [livePressed, setLivePressed] = useState<Set<string>>(() => new Set());

  const isOnlineRef = useRef(isOnline);
  useEffect(() => {
    isOnlineRef.current = isOnline;
  }, [isOnline]);

  // When the connection drops the desktop force-releases everything on socket
  // close (server.ts), so we drop the visuals to match — otherwise on reconnect
  // buttons would still look pressed while no key is actually held on the PC.
  useEffect(() => {
    if (isOnline) return;
    liveTouchesRef.current.clear();
    setLivePressed((prev) => (prev.size === 0 ? prev : new Set()));
    setLatched((prev) => (prev.size === 0 ? prev : new Map()));
  }, [isOnline]);

  // Defensive cleanup: if the screen unmounts mid-press release everything we
  // still think is held so the desktop refcount doesn't dangle.
  useEffect(() => {
    return () => {
      for (const [, st] of liveTouchesRef.current) {
        if (!st.released && st.evtId) release(st.buttonId, st.evtId);
      }
      liveTouchesRef.current.clear();
      for (const [buttonId, evtId] of latchedRef.current) {
        release(buttonId, evtId);
      }
    };
  }, []);

  const buttonAt = useCallback(
    (x: number, y: number): BoardButton | null => {
      if (cellW <= 0 || cellH <= 0) return null;
      const col = Math.floor(x / cellW);
      const row = Math.floor(y / cellH);
      if (col < 0 || col >= board.gridCols || row < 0 || row >= board.gridRows) return null;
      return buttonsByCell.get(`${col},${row}`) ?? null;
    },
    [cellW, cellH, board.gridCols, board.gridRows, buttonsByCell],
  );

  const haptic = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const startTouch = useCallback(
    (id: string, btn: BoardButton): void => {
      if (btn.sticky) {
        const cur = latchedRef.current;
        const existing = cur.get(btn.id);
        if (existing) {
          // Second tap — release.
          release(btn.id, existing);
          const next = new Map(cur);
          next.delete(btn.id);
          setLatched(next);
        } else {
          // First tap — press and stay down.
          const evtId = press(btn.id, btn.keys);
          if (evtId) {
            const next = new Map(cur);
            next.set(btn.id, evtId);
            setLatched(next);
          }
        }
        // Sticky finger itself holds nothing — track only so we don't re-toggle
        // mid-gesture if the user keeps the finger down.
        liveTouchesRef.current.set(id, { buttonId: btn.id, evtId: "", released: true });
        haptic();
        return;
      }

      const evtId = press(btn.id, btn.keys);
      if (!evtId) {
        liveTouchesRef.current.set(id, { buttonId: "", evtId: "", released: true });
        return;
      }
      liveTouchesRef.current.set(id, { buttonId: btn.id, evtId, released: false });
      setLivePressed((prev) => {
        const next = new Set(prev);
        next.add(btn.id);
        return next;
      });
      haptic();
    },
    [haptic],
  );

  const endTouch = useCallback((id: string): void => {
    const st = liveTouchesRef.current.get(id);
    if (!st) return;
    liveTouchesRef.current.delete(id);
    if (st.released || !st.evtId) return;
    release(st.buttonId, st.evtId);
    setLivePressed((prev) => {
      // Multiple fingers on the same button are unlikely but possible; only
      // drop from livePressed when no other tracked touch still owns it.
      let stillHeld = false;
      for (const [, other] of liveTouchesRef.current) {
        if (!other.released && other.buttonId === st.buttonId) {
          stillHeld = true;
          break;
        }
      }
      if (stillHeld) return prev;
      const next = new Set(prev);
      next.delete(st.buttonId);
      return next;
    });
  }, []);

  const handleEvent = useCallback(
    (e: GestureResponderEvent): void => {
      const touches = e.nativeEvent.touches;
      const live = liveTouchesRef.current;
      const seen = new Set<string>();

      for (const t of touches) {
        seen.add(t.identifier);
        const known = live.get(t.identifier);
        if (!known) {
          if (!isOnlineRef.current) {
            live.set(t.identifier, { buttonId: "", evtId: "", released: true });
            continue;
          }
          const btn = buttonAt(t.locationX, t.locationY);
          if (!btn) {
            live.set(t.identifier, { buttonId: "", evtId: "", released: true });
            continue;
          }
          startTouch(t.identifier, btn);
          continue;
        }
        // Continuation: live-held finger that may have slid out of its cell.
        if (!known.released && known.evtId) {
          const btn = buttonAt(t.locationX, t.locationY);
          if (!btn || btn.id !== known.buttonId) {
            release(known.buttonId, known.evtId);
            known.released = true;
            const releasedId = known.buttonId;
            setLivePressed((prev) => {
              let stillHeld = false;
              for (const [otherId, other] of live) {
                if (otherId === t.identifier) continue;
                if (!other.released && other.buttonId === releasedId) {
                  stillHeld = true;
                  break;
                }
              }
              if (stillHeld) return prev;
              const next = new Set(prev);
              next.delete(releasedId);
              return next;
            });
          }
        }
      }

      // Fingers that vanished from `touches` lifted off.
      for (const id of Array.from(live.keys())) {
        if (!seen.has(id)) endTouch(id);
      }
    },
    [buttonAt, startTouch, endTouch],
  );

  const handleTerminate = useCallback((): void => {
    // The system stole the responder (e.g. parent ScrollView, system back
    // gesture). Drop everything live so the PC doesn't think keys are held.
    for (const [, st] of liveTouchesRef.current) {
      if (!st.released && st.evtId) release(st.buttonId, st.evtId);
    }
    liveTouchesRef.current.clear();
    setLivePressed((prev) => (prev.size === 0 ? prev : new Set()));
    // Latched state stays — terminate isn't a user-initiated release.
  }, []);

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

      <View
        style={styles.grid}
        onLayout={onLayout}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleEvent}
        onResponderMove={handleEvent}
        onResponderRelease={handleEvent}
        onResponderTerminate={handleTerminate}
      >
        {size.w > 0 &&
          board.buttons.map((b) => (
            <BoardCell
              key={b.id}
              button={b}
              left={b.x * cellW}
              top={b.y * cellH}
              width={cellW}
              height={cellH}
              pressed={livePressed.has(b.id) || latched.has(b.id)}
              dimmed={!isOnline}
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
  pressed: boolean;
  dimmed: boolean;
}

function BoardCell({ button, left, top, width, height, pressed, dimmed }: CellProps) {
  const iconSize = Math.min(width, height) * 0.4;

  // Custom colors apply only in the rest state — pressed flips to brand
  // yellow regardless, so the press feedback stays legible no matter what
  // base color the user picked.
  const bg = button.bgColor ?? DEFAULT_BG;
  const border = button.bgColor ?? DEFAULT_BORDER;
  const iconCol = pressed ? PRESSED_FG : (button.iconColor ?? DEFAULT_FG);
  const labelCol = pressed ? PRESSED_FG : (button.textColor ?? DEFAULT_FG);

  return (
    <View style={[styles.cell, { left, top, width, height }]} pointerEvents="none">
      <View
        style={[
          styles.btn,
          { backgroundColor: bg, borderColor: border },
          pressed && styles.btnPressed,
          dimmed && styles.btnDisabled,
        ]}
      >
        {(button.customIcon || button.iconName) && (
          <IconView
            name={button.iconName}
            customIcon={button.customIcon}
            size={iconSize}
            color={iconCol}
          />
        )}
        {button.label && (
          <Text style={[styles.btnLabel, { color: labelCol }]} numberOfLines={2}>
            {button.label}
          </Text>
        )}
      </View>
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
