# AGENTS.md

## Cursor Cloud specific instructions

Product: **Home Assistant Dashboard Builder** — a single Next.js 15 (App Router, React 19) full-stack PWA. There is one service (the Next.js app on port `3000`) with an embedded SQLite database via Prisma 7. Standard commands live in `package.json` scripts (`dev`, `build`, `start`, `lint`, `test`) and the README ("Build from source").

### Environment variables (important gotcha)
- Prisma 7 here uses `prisma.config.ts` with `env("DATABASE_URL")` and intentionally does **not** load `.env` (see the comment in that file). So the Prisma **CLI** (`prisma generate`, `prisma migrate deploy`) needs `DATABASE_URL` present in the actual shell environment, not just in `.env`. This affects `npm install` (its `postinstall` runs `prisma generate`), `npm run dev` (runs `prisma migrate deploy` first), and `npm run build`.
- The update script installs deps with `DATABASE_URL` set inline so `postinstall` succeeds. For interactive shells, `DATABASE_URL` and `APP_SECRET` are exported from the agent's `~/.bashrc`, so a normal login shell already has them. If you use a non-login shell and hit `PrismaConfigEnvError: Cannot resolve environment variable: DATABASE_URL`, export it: `export DATABASE_URL="file:./prisma/dev.db"`.
- `APP_SECRET` (min 32 chars) is required to encrypt the stored Home Assistant token. A dev value is in `.env` and `~/.bashrc`. The Next.js runtime (`next dev`/`next start`) does read `.env`, so the app itself picks these up at runtime.

### Database
- SQLite file at `prisma/dev.db` (from `DATABASE_URL=file:./prisma/dev.db`). It is not a separate daemon.
- Migrations are applied automatically by `npm run dev` (`prisma migrate deploy`). To apply manually: `npx prisma migrate deploy`. Migrations are intentionally NOT part of the startup update script.

### Run / lint / test / build
- Dev server: `npm run dev` → http://localhost:3000 (Turbopack; also runs pending migrations first).
- Lint: `npm run lint` (uses deprecated `next lint`; still works).
- Tests: `npm test` (Vitest, unit tests under `src/lib/*.test.ts`).
- Production build: `npm run build` then `npm run start`.

### Testing without Home Assistant
- **Home Assistant is the only hard external dependency** for smart-home features (`/`, `/dashboards`, `/rooms`, `/energy`, `/calendar`), reached server-side via a long-lived token entered during onboarding. Without a reachable HA instance those live features cannot be exercised end to end.
- The **Family** module (`/family`, backed by the `children`/`chores`/`rewards` API routes and SQLite) needs **no** Home Assistant, so it is the best way to smoke-test the full stack (UI → API route → Prisma → SQLite). Example: `curl -X POST http://localhost:3000/api/children -H 'Content-Type: application/json' -d '{"name":"Kid","emoji":"🌍"}'`.
- Optional integrations (not required): Music Assistant (`/music`), `PEXELS_API_KEY` (screensaver media), RSS feeds (news overlay).
