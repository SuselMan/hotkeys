# 28 — Landing deploy on GitHub Pages + bind real download links

**What:** `apps/landing` is a Next.js project configured for static export (`output: "export"` in `next.config.mjs`). The code-side wiring is done — what's left is the infrastructure side that lives in the GitHub repo settings and at the domain registrar, plus a verification pass after DNS propagates. This file is a step-by-step for the human; the agent has already shipped everything in the codebase that this task needs.

## Already done in code (no further changes needed)

- ✅ Domain swap `kekkeys.app` → `kekkeys.online` in `layout.tsx`, `sitemap.ts`, `robots.ts`, `JsonLd.tsx`.
- ✅ `apps/landing/public/CNAME` contains the bare line `kekkeys.online`.
- ✅ GitHub Actions workflow at `.github/workflows/deploy-landing.yml` — runs `next build` and publishes via the official `actions/deploy-pages` flow (no `gh-pages` branch needed).
- ✅ CTA URLs in `DownloadPage.tsx` point to `github.com/SuselMan/hotkeys/releases/latest/download/{kekkeys-setup.exe, kekkeys.apk}` — the `releases/latest/download/...` URL pattern auto-redirects to the latest release's matching asset.
- ✅ `electron-builder.win.artifactName` stabilised to `kekkeys-setup.exe` (no version in filename) so the landing URLs keep working across versions.

## What the human needs to do

### 1. Enable GitHub Pages with "GitHub Actions" source

GitHub → repo → **Settings** → **Pages** → **Build and deployment** → **Source: GitHub Actions** (NOT a branch).

Without this, the workflow has nothing to deploy *to* — it'll error on the deploy step. Default for new repos is "Deploy from a branch (gh-pages)", which is the wrong mode for our workflow.

### 2. Configure DNS at the kekkeys.online registrar

Add these records on the kekkeys.online zone:

| Type  | Name  | Value                                     | TTL  |
| ----- | ----- | ----------------------------------------- | ---- |
| A     | `@`   | `185.199.108.153`                         | 3600 |
| A     | `@`   | `185.199.109.153`                         | 3600 |
| A     | `@`   | `185.199.110.153`                         | 3600 |
| A     | `@`   | `185.199.111.153`                         | 3600 |
| CNAME | `www` | `SuselMan.github.io.` (with trailing dot) | 3600 |

The four A records are GitHub Pages' anycast IPs — listing all four gives failover + load balancing. `www` → `<owner>.github.io` so `www.kekkeys.online` redirects to the apex.

If your registrar supports `ALIAS` or `ANAME` on apex, prefer one of those over four A records — those auto-update if GitHub changes their IPs. Most registrars don't, in which case A records are fine.

DNS propagation: 1–24 hours. Do this **first** so it's settling while you do everything else.

### 3. Set the custom domain in Pages settings

GitHub → Settings → Pages → **Custom domain** → enter `kekkeys.online` → Save.

GitHub will run a DNS check; if it reports green, the domain is wired up correctly. If it complains about the CAA record / DNS not pointing to GH Pages, wait for propagation (`dig kekkeys.online +short` should return one of the four 185.199.x.153 IPs).

Then check **Enforce HTTPS** — it'll be greyed out until GitHub provisions a Let's Encrypt cert (can take 15 min – a few hours after DNS resolves). Tick it as soon as the box becomes available.

### 4. Trigger the first deploy

Two options:

- **Manual:** GitHub → **Actions** tab → **Deploy landing to GitHub Pages** → **Run workflow** → branch `master` → green button. Forces a build + deploy without needing a code change.
- **Automatic:** the next push that touches `apps/landing/**`, `package.json`, `package-lock.json`, or the workflow file itself triggers it. The workflow's `paths:` filter scopes it tight so unrelated commits don't churn it.

Watch the run in the Actions tab. Build takes ~1 minute, deploy ~30 seconds.

### 5. Verify the live site

Once the workflow shows green and DNS has propagated:

- [ ] `https://kekkeys.online/` redirects to `/en/` (or `/ru/` if browser locale is ru).
- [ ] Hero, features, and steps sections render with the macropad-first copy and the audience callout.
- [ ] Both download CTAs go to `/en/download/` (or `/ru/download/`); the actual download links there 404 right now and will start working once #34 (GH Releases v1.0.0) ships the binaries.
- [ ] `https://kekkeys.online/sitemap.xml` returns six URLs (en + ru × home/download/privacy).
- [ ] `https://kekkeys.online/robots.txt` lists the sitemap URL.
- [ ] Drop the URL into a Discord / Slack / Twitter compose to verify the OG card pulls `1200x630.png` correctly.
- [ ] `https://kekkeys.online/site.webmanifest` returns the brand-filled manifest.
- [ ] HTTPS green padlock; no mixed-content warnings.

### 6. Submit to search consoles

Picks up where #29's "Deferred" list left off — only meaningful once the site is live:

- **Google Search Console:** add `kekkeys.online` as a domain property (uses the same DNS so verifies instantly), submit `https://kekkeys.online/sitemap.xml`. Then re-submit weekly for the first month so Google's crawler picks up the en/ru pair.
- **Bing Webmaster Tools:** same. Bing-specific because Yandex uses its own panel.
- **Yandex Webmaster** (optional, for ru reach): add the property, submit sitemap, set Russian as the regional preference.

## Out of scope

- Cloudflare in front of GH Pages — only if rate limits become a problem, which won't happen on day 1 traffic.
- Deploy previews / staging environment — overkill for a static landing.
- Server-side rendering or analytics — privacy policy promises neither.
- Localising the landing into es / de / ja — these locales exist in the mobile bundle (#31) but the landing's `content.ts` ships en + ru only for v1.0.

## Closing this task

Mark this file `git mv`'d to `done/` once steps 1–5 are green and the live site verifies clean. Step 6 (search consoles) lands hours-to-days later as Google indexes; not a hard blocker for closing.
