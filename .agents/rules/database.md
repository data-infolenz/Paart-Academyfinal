---
trigger: always_on
description: Drizzle database schema definitions, migrations, and querying patterns.
---

## Database & Schema Guidelines

### 1. Schema Locations & ORM Layers
- **Remix 3 Apps (`@sdxc/data-model`)**:
  - `apps/chat-remix/app/data/db/schema.ts`: Chat PostgreSQL table definitions (`createTable`) and relations.
  - `apps/store/database/schema/`: Store PostgreSQL table definitions (`createTable`) and `apps/store/database/relations.ts`.
  - Query via `getDatabase()` from `@sdxc/database-middleware` (`db.query(table)...`, `db.create(...)`, `db.update(...)`, `db.deleteMany(...)`) or `ctx.models` from `@sdxc/data-model/router`.
- **Shared Drizzle Package (`packages/db/src/schema/`)**:
  - Used by `apps/chat` and shared utilities. Every table schema must export inferred types:
    ```ts
    export type User = typeof users.$inferSelect
    export type NewUser = typeof users.$inferInsert
    ```

### 2. Migrations Workflow
Whenever modifying or adding any table schema:
1. **In `apps/chat-remix` or `apps/store`**:
   - Update `apps/chat-remix/app/data/db/schema.ts` (or `apps/store/database/schema/`) and corresponding migration scripts in `apps/chat-remix/app/data/db/migrate.ts` (or `apps/store/database/migrate.ts` & `apps/store/database/migrations/`).
   - Run `bun run --cwd apps/chat-remix db:migrate` or `bun run --cwd apps/store db:migrate`.
2. **In `packages/db`**:
   - Update or create table definitions in `packages/db/src/schema/`.
   - Generate migration SQL: `bun db:generate`. *(Never commit schema changes without the generated migration SQL. If `bun db:generate` prompts for column renames/conflicts requiring a TTY, delegate the command to the user to run directly)*.
   - Apply migration to local DB: `bun db:migrate`.
   - Commit both the updated schema TypeScript files and the generated migration folder (`packages/db/migrations/`).

### 3. Data Conventions
- **Naming Conventions (`snake_case`)**:
  - **SQL Tables**: Always lowercase `snake_case` (e.g. `users`, `site_settings`, `messages`, `store_orders`). **Never** use `PascalCase` or uppercase letters for database table names.
  - **SQL Columns**: Always lowercase `snake_case` in PostgreSQL (e.g. `created_at`, `is_owner`, `sender_id`, `site_id`). In TypeScript, expose standard `camelCase` properties (`isOwner`, `createdAt`, `senderId`). **Never** define SQL column names using `camelCase` or un-underscored capitals.
- **Primary Keys**: Always `Bun.randomUUIDv7()`.
- **Soft Deletes**: Tables with `deletedAt` must be queried with `.where(isNull(table.deletedAt))` or equivalent soft-delete helper.
- **Rich Text**: Store rich text as Slate JSON structures, never raw HTML strings.
- **Multi-Site Isolation**: All site-scoped data queries must filter by `siteId`.
