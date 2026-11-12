---
trigger: always_on
description: Core non-negotiable coding standards, typing rules, function ordering, and architectural boundaries for PAART Academy.
---

## Code Standards

All code written or modified in this repository MUST strictly follow these standards:

### 1. Architecture & Design

- **SOLID Principles**: Keep modules single-purpose, extend behavior through focused abstractions, keep interfaces narrow, and depend on stable abstractions rather than concrete infrastructure.
- **Top-Down Function Ordering (Exported Functions First)**:
  - In every `.ts` / `.tsx` file, exported functions and components (`export function ...`, `export const ... = clientEntry(...)`, `export default ...`) MUST appear at the top of the file (immediately after imports, exported types/interfaces, and module-level constants).
  - Non-exported helper functions and internal sub-components (`function helper(...)`, `function CardItem(...)`) MUST be declared below all exported functions using hoisted `function` declarations so readers immediately see the public entry point without scrolling past private helpers.
- **Routing & API Contracts**:
  - **PAART Academy Application Engine**: Define routes in `app/routes.ts` (`remix/fetch-router`), validate payloads with `remix/data-schema` (`s.*`), return RFC 9457 Problem Details (`@sdxc/problem`) for API/JSON errors, and use `@sdxc/api-client` for typed HTTP client calls.
  - **Type-Safe URL Generation via `route.href(params, { searchParams })`**: Always generate internal navigation URLs and links using the route definition's `.href(params, { searchParams })` helper (e.g. `routes.courses.detail.href({ slug })`, `routes.portal.admin.users.href(undefined, { searchParams: { role: "faculty" } })`). **Never** manually concatenate query strings using template literals (such as `${routes.path.href()}?role=...`); always pass query parameters to `{ searchParams }` to guarantee canonical percent-encoding and automatic omission of `undefined` keys.
  - **Public vs Multi-Role LMS Portals**:
    - **Public Academy Portal**: Publicly accessible routes (`/`, `/about`, `/courses`, `/gallery`, `/blogs`, `/contact`, `/admissions`, `/page/:slug`).
    - **LMS Portals**: Role-scoped portals (`/portal/admin`, `/portal/faculty`, `/portal/aspirant`) guarded by authentication and role-checking middleware (`requireAuthSession`, `requireRole`).

### 2. Identifiers & Security

- **UUIDs**: All public-facing primary keys must use UUIDv7 via `@sdxc/uuid/v7` (`generateUUID()`). **Never** use UUID v4 or auto-incrementing integer IDs.
- **Database Casing**: All PostgreSQL table and column names must strictly use lowercase `snake_case` (e.g. `users`, `created_at`, `admission_number`). In TypeScript, expose standard `camelCase` properties. (See [`.agents/rules/database.md`](file:///.agents/rules/database.md)).
- **Secrets & Credentials**: Never hardcode secrets in source code, client bundles, or public repository files. Secrets (`PAART_AUTH_SECRET`, `PAART_ADMIN_PASSWORD`, `DATABASE_URL`, `SMTP_PASS`) must be loaded via environment variables and validated through `config/app.ts`.
- **Soft Deletes**: Always filter `WHERE deleted_at IS NULL` or equivalent soft-delete helpers when querying tables that support soft deletion.

### 3. Types & Schemas

- **No `any`**: Strictly type all variables, parameters, and return types.
- **Database Types**: Infer types from table schemas (`database/schema/index.ts` using `$inferSelect` / `$inferInsert` or schema types).
- **Validation**: Use `remix/data-schema` (`s.*`) for all input payloads, form submissions, and configuration parsing.

### 4. Frontend & Component Boundaries

- Follow [`.agents/rules/frontend.md`](file:///.agents/rules/frontend.md):
  - Strictly separate server `<Document>` (`app/components/Document.tsx`) from client interactive islands (`clientEntry`).
  - Keep client entries (`bootstrap/browser.ts`) strictly lightweight runners; keep interactivity self-contained.
  - Import UI components, layout utilities, and icons exclusively from `@sdxc/ui`, `@sdxc/u`, and `@sdxc/icons`. Use `u.hstack` / `u.vstack` for flex layouts.
  - Enforce serializable props on `clientEntry` (no `Date` entities or circular structures).
  - Never write `u.cursor("pointer")` on `<Button>`, `<button>`, `<summary>`, or `[role="button"]`; per modern web/HIG standards, controls use `cursor: default`, while links use `cursor: pointer`.

### 5. Pre-Production Lifecycle & Zero Fallback Policy

- **No Backward-Compatibility Fallbacks**: This repository is strictly modern and clean. Never write or retain backward-compatibility fallbacks, dual-run shims, legacy session fallbacks, or transitional bridges. Directly replace legacy mechanisms cleanly.

### 6. Environment & Execution

- **Toolchain**: Use Vite+ (`vp`, `vpx`) and Node.js (`npm`).
- **Verification Commands**: Run `npm run typecheck` for type checking, `npx vp fmt` for formatting, `npx vp check --deny-warnings` for linting/formatting checks, and `npm test` or `npx vitest run` for testing.
- **Windows PowerShell**: Use `;` to chain commands (never `&&`), specify `Cwd` directly (no `cd`), and use `--env-file=.env` or `$env:VAR="val"`.
- **Autonomous Commit & Push Guard**: Strictly forbidden from creating git commits autonomously (commit ONLY on explicit user instruction, e.g. "commit it"). Strictly forbidden from executing `git push` under any circumstances — pushing to origin or remotes is handled exclusively by the user. Keep changes in the working tree for the user to review first. (See [`.agents/rules/git-workflow.md`](file:///.agents/rules/git-workflow.md)).
