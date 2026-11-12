---
trigger: always_on
description: Core non-negotiable coding standards, typing rules, function ordering, and architectural boundaries.
---

## Code Standards

All code written or modified in this repository MUST strictly follow these standards:

### 1. Architecture & Design
- **SOLID Principles**: Keep modules single-purpose, extend behavior through focused abstractions, keep interfaces narrow, and depend on stable abstractions rather than concrete infrastructure.
- **Top-Down Function Ordering (Exported Functions First)**:
  - In every `.ts` / `.tsx` file, exported functions and components (`export function ...`, `export const ... = clientEntry(...)`, `export default ...`) MUST appear at the top of the file (immediately after imports, exported types/interfaces, and module-level constants).
  - Non-exported helper functions and internal sub-components (`function LoginDialog(...)`, `function helper(...)`) MUST be declared below all exported functions using hoisted `function` declarations so readers immediately see the public entry point without scrolling past private helpers.
- **Routing & API Contracts**:
  - **JChat Application Engine (`apps/chat-remix/`, `apps/store/`)**: Define routes in `app/routes.ts` (`apps/chat-remix`) or `routes/web.ts` (`apps/store`) (`remix/fetch-router`), validate payloads with `remix/data-schema` (`@sdxc/data-model` `s.*`), return RFC 9457 Problem Details (`@sdxc/problem`) for API/JSON errors, and use `@sdxc/api-client` for typed HTTP client calls.
  - **Type-Safe URL Generation via `route.href(params, { searchParams })`**: Always generate internal navigation URLs and links using the route definition's `.href(params, { searchParams })` helper (e.g. `routes.dashboard.catalog.href(undefined, { searchParams: { tab: "addons", category: "Chat" } })`). **Never** manually concatenate query strings using template literals (such as `${routes.path.href()}?tab=...`); always pass query parameters to `{ searchParams }` to guarantee canonical percent-encoding and automatic omission of `undefined` keys.
  - **Tenant Site Resolution (`apps/chat-remix/`)**: All site-scoped HTML and API routes MUST use `/(:slug/)` in `app/routes.ts` and resolve the active `Site` via `siteRoutingMiddleware` / `requireSiteForAction(ctx)` (backed by read-through Redis caching in `app/data/cache.ts`). **Never** pass or resolve target sites via `x-site-id` headers, `?site=` query parameters, or hidden `<input name="siteId">` fields.

### 2. Identifiers & Security
- **UUIDs**: All public-facing PKs must use `Bun.randomUUIDv7()`. **Never** use UUID v4 or auto-incrementing integer IDs.
- **Database Casing**: All PostgreSQL table and column names must strictly use lowercase `snake_case` (e.g. `users`, `created_at`). In TypeScript, expose `camelCase` properties. (See [`.agents/rules/database.md`](file:///d:/jchat/.agents/rules/database.md)).
- **Secrets**: Never store secrets in the `Sites` table. Use `SiteSettings`, which is fetched only on demand and never cached in the public site record.
- **Soft Deletes**: Always filter `WHERE deletedAt IS NULL` when querying tables that support soft deletion.

### 3. Types & Schemas
- **No `any`**: Strictly type all variables, parameters, and return types.
- **Database Types**: Infer types from table schemas (`app/data/db/schema.ts` in JChat Application Engine, `$inferSelect` / `$inferInsert` in Drizzle).

### 4. Frontend & Component Boundaries
- Follow [`.agents/rules/frontend.md`](file:///d:/jchat/.agents/rules/frontend.md):
  - Strictly separate server `<Document>` (`page.tsx`) from client interactive islands (`clientEntry`).
  - Keep client entries (`entry.ts`) strictly lightweight runners; keep interactivity self-contained.
  - Import exclusively from `@jchat/ui-remix` / `@jchat/ui-remix/*`; use `u.hstack` / `u.vstack` for flex layouts.
  - Enforce serializable props on `clientEntry` (no `Date` entities).
  - Never write `u.cursor("pointer")` on `<Button>`, `<button>`, `<a>`, `<Link>`, `<summary>`, or `[role="button"]`; per modern web/HIG standards, controls use `cursor: default`, while links use `cursor: pointer`.

### 5. Internationalization (i18n)
- **Core Application**: Any new user-facing translation key added to `packages/locale-remix` or `packages/locale` MUST exist across all 20 host languages (`ar`, `bg`, `de`, `el`, `en`, `es`, `fr`, `he`, `hi`, `hr`, `kn`, `ml`, `nl`, `pt`, `ro`, `ru`, `ta`, `te`, `tr`, `ur`).
- **Addons**: Base English (`en.json`) is strictly mandatory; other 19 host languages automatically fall back. Run `bun check:translations`.

### 6. Pre-Production Lifecycle & Zero Fallback Policy
- **No Backward-Compatibility Fallbacks**: This repository is strictly pre-production. Never write or retain backward-compatibility fallbacks, dual-run shims, legacy session fallbacks, or transitional bridges. Directly replace legacy mechanisms cleanly.

### 7. Environment & Execution
- Windows PowerShell: Use `;` to chain commands (never `&&`), specify `Cwd` directly (no `cd`), and use `--env-file=.env` or `$env:VAR="val"`.
- Never execute `git commit`, `bun format`, or `bun audit:changes` autonomously; run format/audit and commit only after explicit user confirmation.
