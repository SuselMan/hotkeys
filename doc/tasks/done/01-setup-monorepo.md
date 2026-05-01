# 01 — Setup npm workspaces monorepo

**Goal:** initialize a multi-app TypeScript repo so desktop, mobile, landing, and shared packages live and build together.

## What was delivered

- Root `package.json` with `workspaces: ["apps/desktop", "apps/landing", "packages/*"]`. `apps/mobile` is intentionally **outside** the glob — Metro doesn't play well with hoisted `node_modules`.
- `tsconfig.base.json` with strict mode, `noUncheckedIndexedAccess`, ESM (`module: ESNext`, `moduleResolution: Bundler`).
- `.gitignore` for Node, Electron, Expo, IDE personal files.
- Root scripts: `dev:desktop`, `dev:mobile`, `dev:landing`, `build:protocol`.

## Notes

- Node ≥ 20 required (declared in `engines`).
- `pnpm` not used — npm workspaces ship out of the box.
