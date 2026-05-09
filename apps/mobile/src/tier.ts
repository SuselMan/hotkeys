/**
 * Single source of truth for "is the user on PRO?" — every feature gate in the
 * app must funnel through `useIsPro()` (React) or `loadIsPro()` (non-React).
 * Today both just read the debug toggle the Settings screen writes; production
 * will swap their bodies for a real entitlement check (StoreKit / Play Billing
 * / server) without touching call sites.
 *
 * `useTier` / `setTier` exist only so the Settings toggle can render and flip
 * the underlying value — feature code should not import them.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export type Tier = "free" | "pro";

const KEY = "kekkeys.tier";

let cache: Tier = "free";
let hydrated: Promise<Tier> | null = null;
const listeners = new Set<() => void>();

export async function loadTier(): Promise<Tier> {
  if (hydrated) return hydrated;
  hydrated = (async () => {
    const raw = await AsyncStorage.getItem(KEY);
    cache = raw === "pro" ? "pro" : "free";
    return cache;
  })();
  return hydrated;
}

export async function setTier(next: Tier): Promise<void> {
  cache = next;
  await AsyncStorage.setItem(KEY, next);
  for (const fn of listeners) fn();
}

export function useTier(): Tier {
  const [tier, setT] = useState<Tier>(cache);
  useEffect(() => {
    let cancelled = false;
    void loadTier().then(() => {
      if (!cancelled) setT(cache);
    });
    const fn = (): void => setT(cache);
    listeners.add(fn);
    return () => {
      cancelled = true;
      listeners.delete(fn);
    };
  }, []);
  return tier;
}

export function useIsPro(): boolean {
  return useTier() === "pro";
}

export async function loadIsPro(): Promise<boolean> {
  return (await loadTier()) === "pro";
}
