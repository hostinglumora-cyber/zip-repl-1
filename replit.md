# Liberty Marketplace

Liberty Marketplace is a dark-themed marketplace for Liberty County emergency-services assets such as liveries, uniforms, ELS packs, and map templates.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/testaa-preview run dev` — run the website preview manually; the managed artifact workflow supplies its own port and base path
- `pnpm --filter @workspace/mockup-sandbox run dev` — run the component preview server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string for database-backed API work

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/testaa-preview` — React + Vite website preview, served at the root preview path
- `artifacts/api-server` — Express API, including `/api/healthz`
- `artifacts/mockup-sandbox` — isolated component preview server
- `attached_assets` — imported image assets
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema` — database schema source of truth

## Architecture decisions

- Keep the imported pnpm workspace and artifact boundaries intact.
- The website is the primary user-facing preview at `/`; the API is a separate managed service.
- Vite receives its port and base path from the managed artifact workflow.

## Product

- Browse marketplace listings and filter by emergency-services department.
- View listing details and public profiles.
- Provide login, registration, dashboard, selling, documentation, status, privacy, and terms flows.

## User preferences

- Preserve the imported structure and stack unless a later request calls for a larger change.

## Gotchas

- Run `pnpm install --frozen-lockfile` after a fresh import when `node_modules` is missing.
- The current imported frontend has existing TypeScript errors in shared UI/page files, so `pnpm run typecheck` is not clean even though the Vite preview runs.
- The API health endpoint is `/api/healthz`; a request to `/` intentionally returns 404.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
