# Proposal

## Why

PAART Academy requires seamless, zero-maintenance cloud hosting on Vercel Edge/Serverless infrastructure with automated preview deployments and instant rollback. By adopting Pitlane's official Vercel deployment architecture (`@pitlane/vite-plugin-remix` composed with `nitro/vite`), the platform can automatically compile into Vercel Build Output API functions while retaining local developer workflows, robust server-driven block page rendering, and institutional database operations.

## What Changes

- **Nitro Integration with Pitlane Remix**: Integrate `nitro/vite` into `vite.config.ts` so production builds automatically detect `VERCEL=1` and package Remix SSR into Vercel serverless functions with zero manual framework preset configuration.
- **Dual Runtime Support**: Maintain local development (`vp dev`) and stand-alone Node.js server execution (`bootstrap/server.ts` via `npm start`) while providing production serverless execution on Vercel.
- **Serverless PostgreSQL Resilience**: Update database pooling in `app/initializers/database.ts` with connection pooling limits, connection timeouts, and SSL parameters appropriate for serverless environments (Neon, Supabase Supavisor, or AWS RDS Proxy).
- **Static Asset Routing**: Ensure static assets emitted in `dist/client/` map cleanly to Vercel's Edge CDN (`.vercel/output/static`) with long-term immutable caching.
- **Serverless Storage Strategy**: Support external/cloud storage URLs for study material PDF downloads and gallery media rather than relying on ephemeral local container disk storage (`uploads/`).

## Capabilities

### New Capabilities

- `platform/vercel-deployment`: Defines the system requirements and build contracts for packaging and executing PAART Academy on Vercel Serverless Functions via Pitlane and Nitro, including asset caching, database connection pooling, and environment variable configuration.

### Modified Capabilities

<!-- No requirement changes to existing CMS, LMS, or Auth capabilities; all existing behavior is preserved -->

## Impact

- **Build Pipeline**: Adds `nitro` as a dev dependency; updates `vite.config.ts` to include `nitro({ ... })` alongside `remix()`.
- **Database Layer**: `app/initializers/database.ts` configures connection pooling tolerances for serverless function concurrency.
- **Deployment Files**: Adds `vercel.json` if custom headers or region routing are required; scripts in `package.json` support standard Vercel build workflows.
- **Testing & Verification**: Ensures all 50 existing tests, Vite+ checks (`npx vp check --deny-warnings`), and production build succeed in both local and serverless build modes.
