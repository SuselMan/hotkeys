# 13 — Landing page (Next.js, EN+RU)

**Goal:** SEO-tuned static site with downloads for Windows installer and Android APK.

## What was delivered

### Stack
- Next.js 15 with App Router, `output: "export"` — fully static, deploys to any CDN (Vercel / Cloudflare Pages / GitHub Pages / S3).
- `trailingSlash: true`, `images.unoptimized: true`.
- React 19 + plain CSS (no Tailwind / no CSS-in-JS lib).

### Layout & content
- `app/layout.tsx` — root metadata: title template, description, OG, Twitter card. `metadataBase` set to `https://kekkeys.app`.
- `app/page.tsx` — root index, client-side redirects to `/en/` or `/ru/` based on `navigator.language`.
- `app/_lib/content.ts` — single source-of-truth content map for both locales: nav, hero, features, steps, download, privacy, footer.
- `app/_components/` — shared `Header`, `Footer`, `Home`, `DownloadPage`, `PrivacyPage`. Each takes `locale` + `content` props; locale-specific `app/{en,ru}/.../page.tsx` are 5-line wrappers that pick the bundle and set `Metadata.alternates`.

### Pages (×2 locales)
- `/{en,ru}/` — hero with dual CTA (Windows / APK), 3-feature card grid, 4-step "how it works" list.
- `/{en,ru}/download/` — install instructions: Windows (SmartScreen "More info → Run anyway"), Android (unknown sources). Each section has a callout for caveats (no code-signing yet, Play Store pending).
- `/{en,ru}/privacy/` — short policy: nothing collected, no telemetry, secrets stay local, Material Symbols credit.

### SEO
- `app/sitemap.ts` — generates `/sitemap.xml` listing all 6 locale-paths with `xhtml:link rel="alternate" hreflang="..."`. `dynamic = "force-static"`.
- `app/robots.ts` — generates `/robots.txt` allowing all, points to the sitemap.
- Per-page `Metadata.alternates.canonical` and `languages` — search engines pick the right locale.

### Theme
- Dark theme matching the app brand (`#fadc50` accent, near-black background). Sticky translucent header with logo + nav + locale switch (EN | RU pill).

### Build
```
npm run build -w @kekkeys/landing
```
emits `apps/landing/out/` with `index.html`, `en/`, `ru/`, `sitemap.xml`, `robots.txt`. Deployable to any static host.

## Acceptance test (manual)

1. `npm run dev:landing` (or `npm run dev -w @kekkeys/landing`).
2. `localhost:3000/` — auto-redirects to `/en/` (Russian browsers go to `/ru/`).
3. `/en/`: hero, features, steps, two CTAs both linking to `/en/download/`.
4. Click EN ↔ RU switch in the header — URL changes, content swaps. State preserved.
5. `/en/download/`: install steps for Windows + APK with callouts.
6. `/en/privacy/`: 7-paragraph policy.
7. `/sitemap.xml` and `/robots.txt` resolve correctly. Sitemap has hreflang alternates.
8. View-source: `<title>`, `<meta description>`, `og:*`, `twitter:*` all populated.

## Open follow-ups

- Real domain + SSL (kekkeys.app or similar). `metadataBase` URL is hardcoded; update when domain lands.
- GitHub Releases links in `DownloadPage.tsx` are placeholders pointing at `github.com/kekkeys/kekkeys` — replace with actual repo + first release.
- Hero screenshot / loop GIF — currently text-only. Add a phone mockup once the UI is photogenic.
- 8 more languages from the project doc — content map is structured for it; each new locale is one new entry in `content.ts` plus one new page-route directory.
- Lighthouse pass: shouldn't have regressions vs. plain-HTML (no JS on most pages other than the root redirect), but worth a manual check before launch.
- Analytics: skipped for MVP. Plausible/Umami when we want stats.
