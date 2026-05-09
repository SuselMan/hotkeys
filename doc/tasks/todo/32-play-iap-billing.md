# 32 — Real Google Play Billing (replace debug tier toggle)

**What:** `apps/mobile/src/tier.ts` currently exposes a debug toggle that flips the user between Free and PRO with no money changing hands. The Settings screen surfaces it openly, and `UpgradeScreen` says "Play Billing is on the way" via `i18n upgrade.debugDisclaimer`. This task swaps that stub for a real Google Play subscription purchase + entitlement check, so v1.0 ships with monetisation working end-to-end.

## Scope

1. **SDK choice.** `react-native-iap` is the de-facto pick for Expo bare/RN apps. With Expo SDK 54, install via `expo install react-native-iap` and run a development build (Expo Go does not include native IAP code).

2. **Product configuration in Play Console.**
   - **Lifetime one-shot decided.** Single managed in-app product (NOT subscription) — `pro_lifetime`.
   - **Launch price $9.99 USD.** Play Console auto-converts regionals (€9.99 / ¥1500 / etc). Plan to raise to $14.99 after 3–6 months once reviews/install volume justify a premium anchor; early buyers stay grandfathered.
   - Managed product means no recurring billing logic, no acknowledge-within-3-days deadline panic, no subscription state machine. Cleaner v1.

3. **Purchase flow** wired into `UpgradeScreen.tsx`:
   - On screen mount, call `getProducts({ skus: ['pro_lifetime'] })` and display the real localised price returned by Play (replaces the hardcoded `priceLine` in i18n — Play returns the proper currency for the user's locale).
   - "Get PRO" button → `requestPurchase({ sku: 'pro_lifetime' })`.
   - Purchase listener (`purchaseUpdatedListener`) on app boot — verifies the purchase token and calls `setTier("pro")` on success.
   - **Acknowledge the purchase** within 3 days or Play auto-refunds. `finishTransaction({ purchase, isConsumable: false })` after entitlement is recorded — `isConsumable: false` is critical so the entitlement persists across reinstalls.

4. **Restore purchases.** `getAvailablePurchases()` on the "Restore" button (already in i18n as `upgrade.restoreBtn`, currently a stub). For a non-consumable lifetime product, this returns the past purchase forever — set tier to PRO on any match.

5. **Entitlement persistence.** Store the purchase token in `expo-secure-store`. On app boot, re-query Play (`getAvailablePurchases`) so a refunded purchase drops the user back to Free without server-side hooks. Local-first stays local-first. With lifetime one-shot, refunds are the only way to lose entitlement (no recurring cancellation).

6. **Server-side validation — punted.** For v1.0 we trust the client-side acknowledge + Play's own anti-piracy. A server validating receipts is the only durable defence against rooted-device replay, but it breaks the "no servers" promise on the privacy page. Acceptable for v1, revisit if abuse appears.

7. **Drop the debug toggle.** Remove the Tier section from `SettingsScreen` (or gate it behind `__DEV__` only). Remove `upgrade.debugDisclaimer` from i18n. Update `UpgradeScreen` to display the real price returned by `getProducts`.

8. **License testing accounts.** Set up Play Console license testers so we can sandbox-purchase without real charges. Document the test flow in this file once we have it working — first-time license testing setup eats half a day.

## Out of scope

- iOS / App Store IAP — v1.0 is Android only.
- Promo codes / offer codes / referral pricing.
- Granular feature flags (e.g. "PRO without custom icons" SKU) — single PRO entitlement gates everything currently locked.
- Server-side receipt validation.

## Notes

- Pricing decision rationale: $9.99 sits above the "trial-quality" perception threshold ($4.99 reads as low-confidence) and below the "premium app" anchor ($14.99 — Procreate tier). Touch Portal Pro is $14.99 lifetime; positioning kekkeys at $9.99 frames it as a value pick vs the dominant alternative without looking cheap.
