# 28 — Landing deploy on GitHub Pages + bind real download links

**What:** `apps/landing` is a Next.js project already configured for static export (`output: "export"` in `next.config.mjs`), but it is not deployed anywhere and its CTA buttons don't link to real binaries. The metadata still references `kekkeys.app`, but the purchased domain is **`kekkeys.online`**. This task ships the landing live on GH Pages under the real domain with working downloads.

## Scope

1. **Domain swap kekkeys.app → kekkeys.online:**
   - `apps/landing/app/layout.tsx` — `metadataBase: new URL("https://kekkeys.online")`.
   - `apps/landing/app/sitemap.ts` — `BASE` constant.
   - `apps/landing/app/robots.ts` — sitemap URL.
   - Grep for any other hardcoded `kekkeys.app` reference; replace.

2. **GH Pages:**
   - Add `apps/landing/public/CNAME` containing the bare line `kekkeys.online`.
   - GH Action that runs `next build` in `apps/landing` and publishes `apps/landing/out/` to the `gh-pages` branch on push to `master`. Use `peaceiris/actions-gh-pages@v3` or the official `actions/deploy-pages` flow.
   - Repo Settings → Pages → source `gh-pages` branch (root) → custom domain `kekkeys.online` → Enforce HTTPS.

3. **DNS at the registrar:**
   - `A` records on apex `@` → 185.199.108.153 / .109.153 / .110.153 / .111.153 (GH Pages anycast IPs).
   - `CNAME` on `www` → `<owner>.github.io`.
   - DNS propagation can take 1–24h — start early.

4. **Bind downloads:**
   - Hero `ctaWindows` and download-page Windows section → link to `https://github.com/<owner>/hotkeys/releases/latest/download/kekkeys-setup-x64.exe` (or whatever electron-builder names it; lock the artifact name).
   - Hero `ctaApk` and download-page Android section → `https://github.com/<owner>/hotkeys/releases/latest/download/kekkeys.apk` and Play Store URL once published.
   - Both i18n locales — `apps/landing/app/_lib/content.ts` exposes the labels but the URLs need to live somewhere central (a `downloads.ts` constants file makes future updates a one-line edit).

## Out of scope

- Cloudflare in front of GH Pages (only if we hit Pages rate limits — we won't on day 1).
- Deploy previews / staging environment — overkill for static landing.
- Server-side rendering or analytics — privacy policy promises none.
