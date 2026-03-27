# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── oikos/              # OikOS — relationship operating system (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## OikOS App (`artifacts/oikos`)

OikOS is a private relationship operating system for Daniel and Sofia. It is a frontend-only React + Vite SPA with local mock data.

### Key files

- `src/App.tsx` — Router and app shell, all 7 routes wired up
- `src/data/mock.ts` — All mock data (memories, letters, goals, questions, scores, dashboard)
- `src/types/index.ts` — TypeScript types for all data
- `src/components/AppShell.tsx` — Main app shell with bottom nav
- `src/components/BottomNav.tsx` — Mobile bottom navigation (6 tabs)
- `src/pages/dashboard.tsx` — Dashboard/home page (renamed from system.tsx)
- `src/pages/saudade.tsx` — Memory timeline (vertical timeline layout with year groupings)
- `src/pages/saudade-detail.tsx` — Memory detail page
- `src/pages/letters.tsx` — Letters (locked/unlocked)
- `src/pages/build.tsx` — Shared goals with progress
- `src/pages/play.tsx` — Conversation questions game
- `src/pages/score.tsx` — Gamified score with milestones

### Routes

- `/` → redirects to `/dashboard`
- `/dashboard` — Dashboard with greeting, days counter, quote, pulse stats, upcoming events, memory of the day, ritual actions
- `/saudade` — Memory timeline with color-coded tag badges
- `/saudade/:id` — Memory detail
- `/letters` — Letters list (locked/unlocked) with author & category info
- `/letters/:id` — Letter detail page (full content for open letters, sealed state for locked)
- `/build` — Shared goals with category filters (Travel, Home, Growth, Ritual), progress percentage
- `/play` — 200-question game across 8 categories (Deep, Spicy, Playful, Memories, Future, Everyday, Would You Rather, This or That) with favorites, answered tracking, shuffle mode
- `/saudade/new` — Create new memory with cover photo upload
- `/letters/new` — Write new letter with optional time seal (lock until date)
- `/score` — Daniel vs Sofia scoreboard with milestones, palmares, score evolution graph, editable seasons

### Data model

- **Question**: id, category (8 categories), text — 200 questions total (25 per category)
- **Letter**: id, title, unlockDate, isLocked, lockedUntil (ISO date for time-locked letters), author, category (anniversary/reassurance/hard day/future), content, mood
- **Goal**: id, text, completed, category (Travel/Home/Growth/Ritual)
- **Memory**: id, title, date, location, preview, content, insideJokes, imageUrl, tags (trip/milestone/tender/funny/routine)
- **DashboardData**: daysTogether, nextEvent, randomPhrase, nextLetterUnlock, activeGoals, suggestions, memoryOfTheDay

### Where to edit content

- **Mock data** (memories, letters, goals, questions, scores): `src/data/mock.ts`
- **TypeScript types**: `src/types/index.ts`
- **Design / CSS variables**: `src/index.css`
- **Individual pages**: `src/pages/`
- **Reusable components**: `src/components/`

### Supabase integration (future)

When ready to connect Supabase:
1. Create `src/lib/supabase.ts` with the Supabase client
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables
3. Replace mock data imports in each page with Supabase queries

### Design — AzulejOS Visual Identity

- Color palette: deep cobalt `hsl(218,70%,28%)`, warm beige bg `hsl(42,28%,97%)`, card white `hsl(38,30%,99%)`, dark `hsl(222,45%,16%)`, borders `rgba(30,60,130,0.08–0.12)`
- Typography: `Cormorant Garamond` (display/serif — headers, numbers, quotes, card titles), `Inter` (sans/UI — labels, metadata, buttons)
- Layout: mobile-first (390px target), tile-based ceramic aesthetic
- Tile style: `borderRadius: 4px`, directional shadows, inset ceramic glow
- Azulejo pattern: SVG motif overlay ONLY on hero tiles (System days, quote, Build progress, Play question card, sealed Letters)
- Standard cards: clean ceramic, no pattern
- Animations: Framer Motion

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.

## GitHub Pages Deployment

The project deploys the `oikos` frontend to GitHub Pages via `.github/workflows/deploy.yml`. The workflow uses pnpm (not npm) and deploys the built output from `artifacts/oikos/dist/public`.

- **Base path**: `/AzulejOS/` for GitHub Pages, Replit's `BASE_PATH` for dev
- **Trigger**: push to `main` or manual dispatch
- **pnpm version**: declared in root `package.json` via `packageManager` field

## Supabase Sync

The app uses a key-value sync layer (`src/data/supabase-sync.ts`) that mirrors localStorage to a Supabase `kv_store` table. All `oikos-*` localStorage keys are automatically synced. On startup, data is pulled from Supabase; on every write, data is pushed in the background. Zero page-level code changes needed — the sync patches `localStorage.setItem`/`removeItem` transparently.
