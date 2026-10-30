# Contributing

Thanks for helping improve the Home Assistant Dashboard Builder. Bug reports, feature ideas, and pull requests are welcome.

## Bugs and feature requests

Use [GitHub issues](https://github.com/hiddevanbrussel/Dashboard-Home-Assistant/issues). Search open issues first so the same report stays in one place.

For a bug, include what you expected, what happened, and how to reproduce it. Add the dashboard version from **Settings → System** (it matches `package.json`) and how you run it: Home Assistant add-on, Docker, or Unraid. The `bug` label is the right one.

For a feature, describe the problem and who it helps (often someone using a wall tablet). The `enhancement` label is the right one.

## Local development

Use Node.js 20 or newer. The Dockerfiles build on `node:20-alpine`. `package.json` has no `engines` field.

```bash
git clone https://github.com/hiddevanbrussel/Dashboard-Home-Assistant.git
cd Dashboard-Home-Assistant
cp .env.example .env
```

Set `APP_SECRET` in `.env` to a random string of at least 32 characters. Next.js reads `.env` when the app starts.

Prisma 7 reads `DATABASE_URL` through `prisma.config.ts` and does not load `.env` for the CLI. Export it before `npm install` and before any script that runs Prisma (`postinstall` runs `prisma generate`, and `npm run dev` runs `prisma migrate deploy` first):

```bash
export DATABASE_URL="file:./prisma/dev.db"
npm install
npm run dev
```

`npm run dev` applies existing migrations, then starts Next.js with Turbopack at http://localhost:3000.

| Script | Command behind it |
|---|---|
| `npm test` | `vitest run` |
| `npm run lint` | `next lint` |
| `npm run build` | wake-word model prep, `prisma generate`, `next build` |
| `npm run start` | `next start` (after a build) |

To create a new database migration while you change `prisma/schema.prisma`, run `npx prisma migrate dev` with `DATABASE_URL` exported. That is the command in the README “Build from source” section. `npm run dev` only deploys migrations that already exist.

The Family pages (`/family`) talk to SQLite and can be used for a full-stack check when Home Assistant is not reachable.

## Branches and pull requests

1. Start from the latest `main`.
2. Keep the branch focused on one change.
3. Open a pull request against `main`. Say what changed and how you checked it.
4. Run `npm test` and `npm run lint` locally. Pull requests run the test suite in GitHub Actions. Docker images are published only from version tags. See [RELEASING.md](RELEASING.md).

## Code style and tests

The code is TypeScript. ESLint is `eslint-config-next`, extending `next/core-web-vitals` in `.eslintrc.json`. Check it with `npm run lint`.

Unit tests sit beside the code as `src/**/*.test.ts` (Vitest, Node environment, see `vitest.config.ts`). `npm test` runs them once. When you change behavior under `src/lib`, add or update a test there.

## Translations

English and Dutch UI strings live in one file, `src/lib/i18n.ts`, in the `en` and `nl` objects. When you add or change a user-facing string, update the same key in both languages.

## Releases

Stable and beta image tags are described in [RELEASING.md](RELEASING.md).

A beta tag (`vX.Y.Z-beta.N`) is Docker and Unraid only. It publishes `:X.Y.Z-beta.N` and `:beta`. It does not move `:latest` or the minor tag `:X.Y`, and it does not publish the Home Assistant add-on. Create the GitHub Release with `gh release create vX.Y.Z-beta.N --prerelease --latest=false`.

## License

This project is under GPL-3.0. Contributions are licensed under GPL-3.0 as well. See [LICENSE](LICENSE).
