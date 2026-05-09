# 29 — Landing SEO polish

**Goal:** take the landing from "indexable" to "competitive" on Touch Portal / Stream Deck-alternative queries before going live. Structured data, proper hreflang, per-page descriptions, expanded keyword surface — all the things Google rewards in 2026 that the initial scaffolding skipped.

## What was delivered

### `apps/landing/app/_components/JsonLd.tsx` (new)

- `SoftwareApplication` JSON-LD emitted via `<script type="application/ld+json">`.
- Two `Offer` entries — Free `$0` and `PRO (lifetime) $9.99` — so SERP cards can surface pricing directly.
- Locale-aware: `inLanguage` and `url` per render (`/en/` vs `/ru/`). Embedded in `Home.tsx` so both home pages get an instance.
- Embedded fields: `operatingSystem: "Windows 10, Windows 11, Android 8+"`, `applicationCategory: "ProductivityApplication"`, `applicationSubCategory: "UtilitiesApplication"`, `author` + `publisher` set to the kekkeys org.
- `aggregateRating` deliberately omitted — fabricated ratings are a Google manual-action risk; will populate from Play Store data once a baseline exists.

### `apps/landing/app/layout.tsx`

- `keywords` list grown from 7 to 14 entries: `stream-deck-alternative`, `phone-as-streamdeck`, `tablet-hotkey-deck`, `hotkeys-for-davinci-resolve`, `hotkeys-for-obs`, `hotkey-deck-for-windows`, `free-stream-deck-software` joined the existing Touch-Portal-leaning set.

### `alternates.languages` per page

Every page (`/en/`, `/en/download/`, `/en/privacy/`, `/ru/`, `/ru/download/`, `/ru/privacy/`) plus `apps/landing/app/ru/layout.tsx` now declares **three** alternates: `en-US`, `ru-RU`, **`x-default` → en**. Without `x-default` Google sometimes guesses wrong on the canonical for the bare `/` redirect — the explicit declaration removes that ambiguity.

### Per-page meta descriptions

Six unique descriptions instead of one inherited root description:
- `/en/` and `/ru/` — value-prop framing referencing Touch Portal / Stream Deck.
- `/en/download/` and `/ru/download/` — what's in the box, where to get it.
- `/en/privacy/` and `/ru/privacy/` — the "no servers, no telemetry" promise condensed to ~150 chars.

Tighter SERP snippets per intent. Default `metadata.description` on the root `layout.tsx` stays as the fallback.

## Verified

- `next build` produces 12 static pages, no errors.
- Spot-check of `out/en/index.html` confirms the rendered head:
  - `<meta name="description">` carries the page-specific copy.
  - `<link rel="alternate" hrefLang="en-US|ru-RU|x-default">` all present.
  - JSON-LD `<script type="application/ld+json">` with the SoftwareApplication payload sits inside `<body>` — Google parses either location.
- `tsc --noEmit` clean.

## Deferred (depends on later tasks / post-deploy)

- **OG image** referenced from `metadata.openGraph.images` — needs the 1200×630 asset (#26 hangover).
- **Image alt audit** — needs screenshots in the page first (#30).
- **Lighthouse pass to ≥95** — meaningful only against the deployed site (#28).
- **GSC + Bing Webmaster Tools sitemap submission** — same; needs live `kekkeys.online`.
- **Per-locale meta keywords** — meta-keywords are mostly dead for Google but Yandex and a few smaller engines still parse them. Could split per-locale once we see how the ru pages rank against Russian queries.
