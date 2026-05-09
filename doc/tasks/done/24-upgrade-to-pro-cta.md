# 24 — Upgrade-to-PRO CTAs

**What:** today every PRO touchpoint in the mobile app dead-ends. `BoardsScreen` shows a hint card, `ButtonEditorScreen` shows a locked Colors block, `IconPickerScreen` fires an `Alert.alert` on the locked Upload tile. None of them tell the user *how* to actually become PRO — they just explain what's locked, which is conversion-zero. This task introduces a single funnel: every PRO surface gets an "Upgrade to PRO →" button that opens a real `UpgradeScreen`, which becomes the future home of the Google Play purchase flow.

## Scope

1. **New `UpgradeScreen`.** Push-stack screen (matches the app's existing nav style — `ButtonEditorScreen`, `IconPickerScreen`, `ScanScreen` are all local-state push screens, no router yet).
   - Hero: title + one-paragraph value prop.
   - Feature list with `IconView` per row: multiple boards, custom button colors, custom uploaded icons, multi-PC pairing (the latter forthcoming via #22).
   - Price line + primary "Get PRO" button. **For v1 the button just calls `setTier("pro")` and pops the screen** so we can dogfood the conversion end-to-end. A debug-disclaimer line on the screen body explains "Play Billing coming soon — for now this toggles the debug tier" so testers don't think they got billed.
   - **Pricing copy lives only on this screen** — never on CTA buttons or lock-block bodies. Avoids re-localizing copy every time pricing changes.
   - Restore-purchases row at the bottom — stub button, no-op for now (placeholder for the future Play Billing acknowledge flow).

2. **CTA placement — inline, not alerts (pattern 2a).** Keep existing locked-state UIs, add a yellow "Upgrade to PRO →" button to each:
   - `BoardsScreen` — bottom of the `proHint` card.
   - `ButtonEditorScreen` — bottom of the Colors `proLock` block.
   - `IconPickerScreen` — two changes:
     - Existing `Alert.alert` on locked Upload tap → **replaced** with navigation to `UpgradeScreen` (no intermediate alert; alerts kill conversion).
     - Add a small "Upgrade to PRO →" link below the bottom hint for free users.

3. **Shared component.** `apps/mobile/src/components/UpgradeCta.tsx` — yellow primary button (brand `#fadc50`), single copy via `common.upgradeBtn`. All three call-sites use it. Centralized so future copy/styling changes touch one file.

4. **Navigation plumbing.** Same pattern as `pickingIcon` / `building` in `ButtonEditorScreen` — each call-site adds `const [upgrading, setUpgrading] = useState(false)` and renders `<UpgradeScreen onClose={...} />` when set. **Do not** introduce a router for one screen reachable from three places.

5. **Future Play Billing swap.** The `setTier("pro")` call inside the Get-PRO handler is the only thing that changes when real purchases land. `tier.ts` already comments that production will swap `useIsPro` / `loadIsPro` for entitlement checks — same module owns the swap; `UpgradeScreen` keeps calling whatever it calls.

6. **No proactive promo.** No banner in Settings, no sticky card on Boards for users who haven't hit a lock. CTAs render only where the user has actually bumped against PRO. Standalone promo placements can ship in a later task if these CTAs underperform.

7. **i18n** (en + ru):
   - `common.upgradeBtn` — "Upgrade to PRO →" / "Получить PRO →"
   - `upgrade.title`, `upgrade.heroBody`
   - `upgrade.featureBoards`, `upgrade.featureColors`, `upgrade.featureIcons`, `upgrade.featureMultiPc`
   - `upgrade.priceLine`, `upgrade.getProBtn`, `upgrade.restoreBtn`, `upgrade.debugDisclaimer`

## Implementation sketch

- `apps/mobile/src/screens/UpgradeScreen.tsx` — push screen, brand styling, uses `IconView` for feature rows. Calls `setTier("pro")` and `onClose()` from the Get-PRO button.
- `apps/mobile/src/components/UpgradeCta.tsx` — small component, just a styled `Pressable` + label + onPress prop.
- Wire the three call-sites with `[upgrading, setUpgrading]` state + a ternary render.
- Drop the locked-tile `Alert.alert` in `IconPickerScreen` — the picker stays open while `UpgradeScreen` is on top, since the picker itself is already a push screen above `ButtonEditorScreen`. Closing `UpgradeScreen` returns to the picker.

## Acceptance test

1. Free → BoardsScreen, attempt to create a 2nd board → hint card shows with CTA → tap "Upgrade to PRO →" → `UpgradeScreen` opens. Back → returns to Boards untouched.
2. Free → open ButtonEditor, scroll to Colors → CTA visible inside the lock block → tap → `UpgradeScreen`.
3. Free → open IconPicker → tap locked Upload tile → goes **straight to** `UpgradeScreen` (no alert in between).
4. Pro → none of the CTAs render anywhere.
5. Free → on `UpgradeScreen` tap "Get PRO" → screen closes, tier flips to pro, the originating lock is gone, the underlying PRO surface (color picker / Upload tile / second board) works immediately.
6. Pricing copy is **only** on `UpgradeScreen`, never on a CTA button or lock-block body.
7. The Settings → Tier debug toggle still works as before (regression).
8. Restore-purchases stub renders but no-ops cleanly (no error, no crash).

## Out of scope

- Real Google Play / Play Billing integration — separate task once we're on the Play track. This task lays the funnel; Play Billing replaces the body of the Get-PRO handler.
- Real restore-purchases logic — stub only.
- A/B testing of CTA copy or pricing.
- Promotional placements not tied to a lock event (Settings banner, Boards sticky card, push notifications, "PRO trial" onboarding).
- Multi-PC pairing UI — feature-list row for it is just copy referencing #22; the actual functionality is delivered in that task.
