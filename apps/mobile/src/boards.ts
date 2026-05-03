/**
 * Boards store, persisted to AsyncStorage. Subscribe via `useBoards()`; mutate
 * via `createBoard` / `updateBoard` / `deleteBoard` / `upsertButton` /
 * `removeButton`. The cache is hydrated lazily on first read.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { loadTemplate } from "./templates";
import type { Board, BoardButton } from "./types";

const KEY = "kekkeys.boards";

let cache: Board[] | null = null;
let hydrated: Promise<Board[]> | null = null;
const listeners = new Set<() => void>();

export async function loadBoards(): Promise<Board[]> {
  if (cache) return cache;
  if (!hydrated) {
    hydrated = (async () => {
      const raw = await AsyncStorage.getItem(KEY);
      cache = raw ? (JSON.parse(raw) as Board[]) : [];
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

/**
 * Instantiate a bundled template into a real board: fresh IDs (board + every
 * button) so multiple instantiations of the same template don't collide.
 */
export async function instantiateTemplate(templateId: string): Promise<Board | null> {
  const tpl = await loadTemplate(templateId);
  if (!tpl) return null;
  const all = await loadBoards();
  const board: Board = {
    id: rid(),
    name: tpl.name,
    gridCols: tpl.gridCols,
    gridRows: tpl.gridRows,
    buttons: tpl.buttons.map((b) => ({ ...b, id: rid() })),
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

/**
 * Move a button to (toX, toY). If another button already lives there, the two
 * exchange coordinates (swap). One persist call → no intermediate state where
 * both sit on the same cell.
 */
export async function moveButton(
  boardId: string,
  buttonId: string,
  toX: number,
  toY: number,
): Promise<void> {
  const all = await loadBoards();
  await persist(
    all.map((b) => {
      if (b.id !== boardId) return b;
      const moving = b.buttons.find((x) => x.id === buttonId);
      if (!moving) return b;
      if (moving.x === toX && moving.y === toY) return b;
      const occupant = b.buttons.find((x) => x.x === toX && x.y === toY && x.id !== buttonId);
      const fromX = moving.x;
      const fromY = moving.y;
      return {
        ...b,
        buttons: b.buttons.map((x) => {
          if (x.id === buttonId) return { ...x, x: toX, y: toY };
          if (occupant && x.id === occupant.id) return { ...x, x: fromX, y: fromY };
          return x;
        }),
      };
    }),
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
