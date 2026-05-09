/**
 * Google Play Billing wrapper. Replaces the old debug `tier` toggle as the
 * source of PRO entitlement. Lifetime one-shot purchase model — single
 * managed product `pro_lifetime`. No subscription bookkeeping, no server.
 *
 * Lifecycle:
 *   index.tsx → initIap() once at boot
 *     → opens connection to Play Billing
 *     → registers purchase + error listeners
 *     → verifyEntitlement() reconciles stored token with Play (catches
 *       refunds without a server hook)
 *     → primePrice() pre-fetches the localised price so UpgradeScreen
 *       shows the right number on first paint
 *
 *   User taps Get PRO → purchasePro() opens the Play modal. Result lands
 *   in the global purchaseUpdatedListener, which:
 *     1. persists the purchase token to SecureStore
 *     2. flips tier to "pro" via setTier
 *     3. calls finishTransaction({ isConsumable: false }) — required by
 *        Play within 3 days or the purchase auto-refunds.
 *
 *   User taps Restore → restorePurchases() pulls the active entitlements
 *   for this Google account, sets PRO if a `pro_lifetime` purchase is
 *   present.
 *
 * Native module note: react-native-iap is not available in Expo Go. The
 * EAS dev-client / production builds pick it up via autolinking. In Expo
 * Go the import resolves but `initConnection()` will throw — caught here
 * so the rest of the app still runs.
 */
import * as SecureStore from "expo-secure-store";
import {
  endConnection,
  finishTransaction,
  getAvailablePurchases,
  getProducts,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
} from "react-native-iap";
import { setTier } from "./tier";

const SKU = "pro_lifetime";
const TOKEN_KEY = "kekkeys.iap.purchaseToken";

interface PurchaseLike {
  productId?: string;
  purchaseToken?: string;
  transactionReceipt?: string;
}

interface ProductLike {
  productId?: string;
  localizedPrice?: string;
  price?: string;
}

let initialized = false;
let cachedPriceLine: string | null = null;
let purchaseUpdateSub: { remove: () => void } | null = null;
let purchaseErrorSub: { remove: () => void } | null = null;
const priceListeners = new Set<(price: string | null) => void>();

export type IapResult = { ok: true } | { ok: false; reason: string };
export type RestoreResult =
  | { ok: true; restored: boolean }
  | { ok: false; reason: string };

export async function initIap(): Promise<void> {
  if (initialized) return;
  try {
    const ok = await initConnection();
    if (!ok) {
      console.warn("[iap] initConnection returned false");
      return;
    }
    purchaseUpdateSub = purchaseUpdatedListener((purchase: unknown) => {
      void handlePurchaseUpdate(purchase as PurchaseLike);
    });
    purchaseErrorSub = purchaseErrorListener((err: unknown) => {
      const e = err as { code?: string; message?: string };
      console.warn(`[iap] purchase error: ${e.code ?? "?"} ${e.message ?? "?"}`);
    });
    initialized = true;
    void verifyEntitlement();
    void primePrice();
  } catch (e) {
    console.warn(`[iap] init failed: ${(e as Error).message}`);
  }
}

export async function shutdownIap(): Promise<void> {
  purchaseUpdateSub?.remove();
  purchaseErrorSub?.remove();
  purchaseUpdateSub = null;
  purchaseErrorSub = null;
  if (initialized) {
    try {
      await endConnection();
    } catch {
      /* ignore */
    }
    initialized = false;
  }
}

export function getCachedPrice(): string | null {
  return cachedPriceLine;
}

export function subscribePriceUpdates(fn: (price: string | null) => void): () => void {
  priceListeners.add(fn);
  return () => {
    priceListeners.delete(fn);
  };
}

async function primePrice(): Promise<void> {
  if (!initialized) return;
  try {
    const products = (await getProducts({ skus: [SKU] })) as ProductLike[];
    const p = products[0];
    if (p) {
      cachedPriceLine = p.localizedPrice ?? p.price ?? null;
      for (const fn of priceListeners) fn(cachedPriceLine);
    }
  } catch (e) {
    console.warn(`[iap] getProducts failed: ${(e as Error).message}`);
  }
}

export async function purchasePro(): Promise<IapResult> {
  if (!initialized) return { ok: false, reason: "iap_not_initialized" };
  try {
    await requestPurchase({ skus: [SKU] });
    // The actual outcome lands in `purchaseUpdatedListener` — don't try to
    // resolve the entitlement state from here, just confirm the dispatch.
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: (e as Error).message ?? "unknown" };
  }
}

export async function restorePurchases(): Promise<RestoreResult> {
  if (!initialized) return { ok: false, reason: "iap_not_initialized" };
  try {
    const purchases = (await getAvailablePurchases()) as PurchaseLike[];
    const proPurchase = purchases.find((p) => p.productId === SKU);
    if (proPurchase) {
      await persistEntitlement(proPurchase.purchaseToken ?? "");
      await setTier("pro");
      return { ok: true, restored: true };
    }
    return { ok: true, restored: false };
  } catch (e) {
    return { ok: false, reason: (e as Error).message ?? "unknown" };
  }
}

async function handlePurchaseUpdate(purchase: PurchaseLike): Promise<void> {
  if (purchase.productId !== SKU) return;
  if (!purchase.purchaseToken) return;
  await persistEntitlement(purchase.purchaseToken);
  await setTier("pro");
  try {
    await finishTransaction({ purchase: purchase as never, isConsumable: false });
  } catch (e) {
    console.warn(`[iap] finishTransaction failed: ${(e as Error).message}`);
  }
}

async function persistEntitlement(token: string): Promise<void> {
  if (!token) return;
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

async function clearEntitlement(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Reconciles local entitlement with what Play actually reports for this
 * Google account. Run on every app boot. Catches refunds and revoked
 * purchases without needing a server-side hook. Doesn't grant PRO if no
 * stored token — that's what the Restore button is for.
 */
async function verifyEntitlement(): Promise<void> {
  if (!initialized) return;
  try {
    const stored = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!stored) return;
    const purchases = (await getAvailablePurchases()) as PurchaseLike[];
    const proPurchase = purchases.find((p) => p.productId === SKU);
    if (!proPurchase) {
      // Refund or revoked → drop entitlement.
      await clearEntitlement();
      await setTier("free");
    }
  } catch (e) {
    console.warn(`[iap] verifyEntitlement failed: ${(e as Error).message}`);
  }
}
