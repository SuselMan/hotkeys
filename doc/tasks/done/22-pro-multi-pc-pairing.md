# 22 — Multi-PC pairing (PRO)

**What:** today the pairing list (`apps/mobile/src/storage.ts` → `listPairings()` / `upsertPairing`) already stores multiple `Pairing` entries — there is no hard 1-PC limit in the data layer, and the Connect screen renders all of them. So the gating point is **how many pairings the user is allowed to create**, not how many can be stored. Free = 1, Pro = unlimited (or a generous cap like 10).

The actual end-user pain Pro solves: home laptop + work desktop, or main PC + streaming PC — many users have at least two. Today they have to forget one to pair the other.

## Scope

1. **Limit creation in free tier.** Add a `MAX_FREE_PAIRINGS = 1` constant. Before a successful `staticPair` / QR pair completes, check `(await listPairings()).length` against the limit when `!await loadIsPro()`. Reject with a friendly toast that points at Settings → tier toggle (and eventually the upgrade flow).
2. **Surface the limit in the UI.** ConnectScreen "Pair a new PC" section: when free user is at the cap, replace the QR/scan button with a `proLock`-style hint identical to the one in BoardsScreen — explain *why* and route the eye to the toggle. Re-enable instantly when tier flips.
3. **Per-pairing connect/forget already works.** No change to `activatePairing` / `disconnect`; the only thing the gate touches is *creating* new pairings.
4. **Active connection on tier downgrade.** If a Pro user with 3 paired PCs flips back to Free, *don't* auto-forget any of them — just block creation of new ones until they're back under the limit. Document the policy in the proLock body so it doesn't feel punitive.
5. **i18n:** `connect.proLockTitle`, `connect.proLockBody` (EN + RU).

## Implementation sketch

- New helper in `connection.ts` or a small `pairing-limits.ts`: `async function canPairAnother(): Promise<boolean>` — single source of truth so QR-pair and manual-pair both gate the same way.
- Show the lock hint reactively: re-use the `useIsPro()` + `usePairings()` (a small hook around `listPairings` with a listener pattern, mirror of `useBoards`) so the UI updates when the user forgets a PC or flips the toggle.

## Acceptance test

1. Free user pairs PC A — works, list shows one. Pair attempt on PC B is blocked, with a hint pointing to the tier toggle.
2. Flip Pro → can pair PC B. Pair PC C, both work, both appear in the list, can connect/forget either.
3. Flip back to Free with 3 paired PCs: all three remain in the list, can still connect/forget existing ones, but pair-new is blocked.
4. Forget PCs back down to 1, free user can pair again without flipping tiers.
5. QR scan and manual-dev pair both honor the same check (regression risk: only one of the two paths gates).

## Out of scope

- Concurrent connections to multiple PCs (current `connection.ts` keeps one active `WsConnection` at a time — fine, switching is fast). Multi-PC simultaneous control would be a separate task.
- Cross-device sync of pairings across phones — different feature class (cloud sync).
