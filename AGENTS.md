# Base44 Dev Environment

## Stack
pnpm monorepo (workspace root). Node 22 runtime, pnpm 10. TypeScript 5.9.
- `artifacts/testaa-preview` — React 19 + Vite 7 frontend, the primary preview (host port 3000).
- `artifacts/api-server` — Express 5 API, bundled with esbuild (host port 5000). Health: `GET /api/healthz`.
- `artifacts/mockup-sandbox` — isolated component preview (not run by default).
- `lib/db` — Drizzle ORM + Postgres schema. **Throws if `DATABASE_URL` is unset**, but is NOT imported by the API server entry, so neither service needs a database to boot.
- `lib/api-client-react`, `lib/api-zod`, `lib/api-spec` — shared API client / Zod / OpenAPI codegen.

## Running
```
docker compose -f docker-compose.base44.yml up -d
```
A one-shot `setup` service runs `pnpm install --frozen-lockfile` first; `web` and `api` depend on it completing. node_modules is bind-mounted, so the install persists.

## How the frontend renders without a backend
Pages read from a stub `db` object (`globalThis.__B44_DB__` fallback in `base44Client.tsx`) that returns empty arrays — the marketplace renders with empty states. `AuthContext` short-circuits to an unauthenticated state. No external services are required for the preview to render.

## Env vars
- `web` needs `PORT` (set to 3000) and `BASE_PATH` (set to `/`) — Vite throws without them (see `vite.config.ts`).
- `api` needs `PORT` (set to 5000).
- No external secrets are required at boot.

## Vite / preview host
`vite.config.ts` already sets `server.host: '0.0.0.0'` and `allowedHosts: true`, so the preview's external hostname works out of the box.

## Gotchas
- Use `pnpm`, never npm/yarn — the root `preinstall` script aborts otherwise.
- `pnpm-workspace.yaml` sets `minimumReleaseAge: 1440` (pnpm 10+ feature); harmless with `--frozen-lockfile`.
- Replit-only Vite plugins (`cartographer`, `dev-banner`) are conditionally loaded only when `REPL_ID` is set, so they don't run here.
- `pnpm run typecheck` is NOT clean (pre-existing TS errors in shared UI/page files), but the Vite preview runs fine regardless.
- `App.tsx` is a leftover placeholder; the real entry is `src/main.jsx` → `src/App.jsx` (react-router-dom).
