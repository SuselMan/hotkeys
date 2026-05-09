# 29 — Landing SEO polish

**What:** the landing already has the SEO bones (metadata, sitemap, robots, openGraph, twitter card in `apps/landing/app/layout.tsx`), but it is light on the things Google actually rewards in 2026: structured data, language alternates, image SEO, and core web vitals. This task takes the landing from "indexable" to "competitive on Touch Portal alternative queries".

## Scope

1. **JSON-LD `SoftwareApplication`** injected into the home page (en + ru) — `name`, `applicationCategory: "ProductivityApplication"`, `operatingSystem: "Windows, Android"`, `offers` (Free + PRO subscription), `aggregateRating` left empty for now (Play Store data once it exists).

2. **hreflang.** Verify each page emits `<link rel="alternate" hreflang="en" href="...">`, `hreflang="ru"`, `hreflang="x-default"`. Next.js metadata `alternates.languages` is the lever — sitemap already declares the relationship; add it to the page metadata too.

3. **Keywords audit.** Current `keywords` list (layout.tsx) is decent; add: `stream-deck-alternative`, `phone-as-streamdeck`, `tablet-hotkey-deck`, `hotkeys-for-animate`, `hotkeys-for-blender`, `hotkeys-for-davinci-resolve`. Don't over-stuff — Google ignores `<meta keywords>` but social cards and OG description still benefit from natural keyword presence.

4. **Image SEO.** Once promo video + screenshots land (#27, #30): every `<img>` has descriptive `alt`, OG image is 1200×630 PNG (#26), screenshot composite on the home page has alt text mentioning the apps it controls.

5. **Core Web Vitals.** Run Lighthouse on the deployed site. Target ≥95 perf / a11y / SEO. The landing is static + minimal JS so this should be free, but check: image dimensions set, fonts preloaded, no layout shift on hero CTAs.

6. **Meta description tuning.** Current description is fine but generic. Consider rewriting per-page (home vs download vs privacy) so search snippets are tailored. Next.js per-page `metadata.description` overrides root.

7. **Submit sitemap** to Google Search Console + Bing Webmaster Tools after deploy.

## Out of scope

- Backlink campaigns, Reddit / HN seeding (separate marketing track).
- A/B testing meta-titles.
- Schema for individual screens / product variants — `SoftwareApplication` is enough for v1.
- Translating into more locales than the i18n bundle ships (#31 owns that — landing follows once those translations exist).
