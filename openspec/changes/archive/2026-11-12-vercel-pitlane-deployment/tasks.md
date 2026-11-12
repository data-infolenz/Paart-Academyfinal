# Tasks

## 1. Dependencies & Environment Configuration

- [x] 1.1 Install `nitro` dependency and configure package scripts to support Vercel builds (`npm run build`).
- [x] 1.2 Update [config/app.ts](file:///d:/Paart-Academyfinal/config/app.ts) to gracefully parse environment variables in serverless environments (handling absence of local `.env` files).

## 2. Nitro & Pitlane Vite Integration

- [x] 2.1 Update [vite.config.ts](file:///d:/Paart-Academyfinal/vite.config.ts) to integrate `nitro/vite` with `@pitlane/vite-plugin-remix`, ensuring `VERCEL=1` outputs to `.vercel/output/` without breaking local builds.
- [x] 2.2 Add and configure `vercel.json` with appropriate build settings, edge static caching headers, and function timeouts.

## 3. Serverless Database Resilience

- [x] 3.1 Update [app/initializers/database.ts](file:///d:/Paart-Academyfinal/app/initializers/database.ts) to configure connection pool limits and timeouts optimized for serverless functions (`max: 3` when `VERCEL === "1"`).
- [x] 3.2 Add a unit test verifying serverless database pool configuration options in `test/database-serverless.test.ts`.

## 4. Verification & Build Validation

- [x] 4.1 Run standard local build (`npm run build`) and test suite (`npm test`) to ensure zero regressions in Node.js mode.
- [x] 4.2 Test simulated Vercel build (`cross-env VERCEL=1 npm run build` or environment flag) and verify `.vercel/output/` generation.
- [x] 4.3 Run `npx vp fmt`, `npx vp check --deny-warnings`, `npm run typecheck`, and `graphify update .`.

## Workflow follow-up

- Push change branch to GitHub and connect repository to Vercel project dashboard.
- Configure production environment variables on Vercel Dashboard (pooled `DATABASE_URL`, `PAART_AUTH_SECRET`, etc.).
