/**
 * Boards store, persisted to AsyncStorage. Subscribe via `useBoards()`; mutate
 * via `createBoard` / `updateBoard` / `deleteBoard` / `upsertButton` /
 * `removeButton`. The cache is hydrated lazily on first read.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import type { Board, BoardButton } from "./types";

const KEY = "kekkeys.boards";

let cache: Board[] | null = null;
let hydrated: Promise<Board[]> | null = null;
const listeners = new Set<() => void>();

const SEED: Board[] = [
  {
    id: "seed-animate",
    name: "Adobe Animate",
    gridCols: 4,
    gridRows: 3,
    buttons: [
      { id: "save", x: 0, y: 0, label: "Save", keys: ["ControlLeft", "KeyS"] },
      { id: "undo", x: 1, y: 0, label: "Undo", keys: ["ControlLeft", "KeyZ"] },
      { id: "redo", x: 2, y: 0, label: "Redo", keys: ["ControlLeft", "KeyY"] },
      { id: "test", x: 3, y: 0, label: "Test movie", keys: ["ControlLeft", "Enter"] },
      { id: "frame", x: 0, y: 1, label: "Frame (F5)", keys: ["F5"] },
      { id: "kf", x: 1, y: 1, label: "Keyframe (F6)", keys: ["F6"] },
      { id: "blank", x: 2, y: 1, label: "Blank KF (F7)", keys: ["F7"] },
      { id: "symbol", x: 3, y: 1, label: "Symbol (F8)", keys: ["F8"] },
      { id: "select", x: 0, y: 2, label: "Select (V)", keys: ["KeyV"] },
      { id: "brush", x: 1, y: 2, label: "Brush (B)", keys: ["KeyB"] },
      { id: "pan", x: 2, y: 2, label: "Pan (hold)", keys: ["Space"] },
      { id: "play", x: 3, y: 2, label: "Play (Enter)", keys: ["Enter"] },
    ],
  },
];

export async function loadBoards(): Promise<Board[]> {
  if (cache) return cache;
  if (!hydrated) {
    hydrated = (async () => {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) {
        cache = JSON.parse(raw) as Board[];
      } else {
        cache = SEED;
        await AsyncStorage.setItem(KEY, JSON.stringify(cache));
      }
      return cache;
    })();
  }
  return hydrated;
}

async function persist(next: Board[]): Promise<void> {
  cache = next;
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  for (const fn of listeners) fn();
}

/** Replace the entire board list — used by JSON import. */
export async function replaceAllBoards(next: Board[]): Promise<void> {
  await persist(next);
}

export async function createBoard(name: string): Promise<Board> {
  const all = await loadBoards();
  const board: Board = {
    id: rid(),
    name,
    gridCols: 4,
    gridRows: 3,
    buttons: [],
  };
  await persist([...all, board]);
  return board;
}

export async function updateBoard(id: string, patch: Partial<Omit<Board, "id" | "buttons">>): Promise<void> {
  const all = await loadBoards();
  await persist(all.map((b) => (b.id === id ? { ...b, ...patch } : b)));
}

export async function deleteBoard(id: string): Promise<void> {
  const all = await loadBoards();
  await persist(all.filter((b) => b.id !== id));
}

export async function upsertButton(boardId: string, btn: BoardButton): Promise<void> {
  const all = await loadBoards();
  await persist(
    all.map((b) => {
      if (b.id !== boardId) return b;
      const idx = b.buttons.findIndex((x) => x.id === btn.id);
      const buttons = idx >= 0
        ? b.buttons.map((x, i) => (i === idx ? btn : x))
        : [...b.buttons, btn];
      return { ...b, buttons };
    }),
  );
}

export async function removeButton(boardId: string, buttonId: string): Promise<void> {
  const all = await loadBoards();
  await persist(
    all.map((b) =>
      b.id === boardId ? { ...b, buttons: b.buttons.filter((x) => x.id !== buttonId) } : b,
    ),
  );
}

export function newButtonId(): string {
  return rid();
}

export function useBoards(): Board[] {
  const [boards, setBoards] = useState<Board[]>(cache ?? []);
  useEffect(() => {
    let cancelled = false;
    void loadBoards().then((bs) => {
      if (!cancelled) setBoards(bs);
    });
    const fn = (): void => setBoards(cache ?? []);
    listeners.add(fn);
    return () => {
      cancelled = true;
      listeners.delete(fn);
    };
  }, []);
  return boards;
}

export function useBoard(id: string | null): Board | null {
  const all = useBoards();
  return id ? (all.find((b) => b.id === id) ?? null) : null;
}

function rid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
