# Design

## Context

See [proposal.md](file:///d:/Paart-Academyfinal/openspec/changes/vercel-pitlane-deployment/proposal.md) for motivation. PAART Academy is built on Remix 3 with Vite+ (`vp`), `@pitlane/vite-plugin-remix`, `@sdxc/ui`, and PostgreSQL. The application is currently served via `bootstrap/server.ts` as a long-running Node.js process. In Vercel environments, Nitro acts as the zero-configuration packager, automatically targeting Vercel Functions and Vercel Edge static delivery when `VERCEL=1` is detected.

## Goals / Non-Goals

**Goals:**

- Enable zero-config Vercel deployments via Pitlane's official Nitro integration (`nitro/vite`).
- Produce `.vercel/output/static` (CDN cached) and `.vercel/output/functions` (serverless functions) when building under `VERCEL=1`.
- Preserve existing local developer experience (`vp dev`) and Node.js production server (`bootstrap/server.ts`) without regressions.
- Configure serverless-resilient database connection pooling in `app/initializers/database.ts` with connection bounds and aggressive timeout thresholds.
- Maintain strict validation: 0 errors/warnings on `npx vp check --deny-warnings`, `npm run typecheck`, and 100% test passes.

**Non-Goals:**

- Migrating the local development database away from PostgreSQL.
- Rewriting route controllers or business logic into microservices.
- Implementing an external object storage client in this change (study material downloads will support standard HTTP URLs, and asset files remain edge-served).

## Decisions

### 1. Integrate `nitro/vite` with Conditional Output

- **Decision**: Add `nitro` to `devDependencies` and configure `nitro/vite` inside `vite.config.ts`.
- **Rationale**: Pitlane's Remix plugin is designed to compose directly with Nitro. Nitro detects `VERCEL=1` in Vercel's build environment, activates the `vercel` preset automatically, and emits Vercel's Build Output API v3 structure. When `VERCEL=1` is not set, standard build artifacts are emitted for local/Docker production.
- **Alternatives Considered**: Writing custom Vercel Serverless Function entrypoints by hand (rejected: fragile, difficult to keep in sync with Vite+ asset manifests).

### 2. Database Pooling Tolerances for Serverless Functions

- **Decision**: Update `getDatabase()` in `app/initializers/database.ts` to detect serverless contexts (e.g. `process.env.VERCEL === "1"`) and adjust pool size:
  - Local/Node server: `max: 10-20` connections.
  - Serverless environment: `max: 2-3` connections per function instance with `connectionTimeoutMillis: 3000` and `idleTimeoutMillis: 10000`.
- **Rationale**: Serverless instances scale horizontally. If 50 lambdas spawn and each holds 20 connections, the database will exhaust connection pools instantly. Lower pool bounds per lambda protect managed databases (Neon / Supabase PgBouncer).
- **Alternatives Considered**: Global single connection per invocation (rejected: causes serial connection thrashing when multiple queries run in parallel).

### 3. Edge Static Routing Configuration

- **Decision**: Configure `vercel.json` to route `/assets/*`, `/images/*`, `/favicon.ico`, and `/fonts/*` directly with immutable cache controls.
- **Rationale**: Edge CDN caching offloads static asset requests entirely from serverless execution, minimizing cold starts and latency for visitors.

## Risks / Trade-offs

- **[Risk] Long cold starts with heavy dependency imports**: Serverless lambdas bundling large packages might experience 1-2s cold starts on initial spin-up.
  → _Mitigation_: Rolldown/Vite code splitting separates `paart-ui` and `paart-remix` chunks, and Nitro bundles only required server entry graphs.
- **[Risk] Direct TCP PostgreSQL connection limits**: Connecting serverless lambdas to a non-pooled PostgreSQL server can cause `timeout exceeded when trying to connect` during traffic spikes.
  → _Mitigation_: Require pooled connection strings (PgBouncer, Neon pooled port `5432` with pooling or Supavisor `6543`) in production `.env`.
- **[Risk] Ephemeral uploads storage**: Uploaded files saved directly to `uploads/` disk will disappear in serverless instances.
  → _Mitigation_: Study materials and gallery seeds store public static paths or external URLs rather than local temp files.

## Migration Plan

1. Install `nitro` in `package.json`.
2. Update `vite.config.ts` to compose `nitro/vite` with `remix()`.
3. Update `app/initializers/database.ts` with serverless connection pooling defaults.
4. Add `vercel.json` for edge caching headers and regional routing.
5. Verify build locally with `VERCEL=1 npm run build` to confirm `.vercel/output` is generated.
6. Push to git and import repository into Vercel dashboard.
