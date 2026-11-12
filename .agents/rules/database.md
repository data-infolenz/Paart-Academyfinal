---
trigger: always_on
description: PostgreSQL database schema definitions, migrations, and querying patterns for PAART Academy.
---

## Database & Schema Guidelines

### 1. Schema Locations & ORM Layers
- **PostgreSQL Schemas (`database/schema/`)**:
  - `database/schema/users.ts`: Users, authentication, roles (`admin`, `faculty`, `aspirant`), sessions.
  - `database/schema/courses.ts`: Courses, departments, curricula, prerequisites.
  - `database/schema/lms.ts`: Batches, enrollments, attendance, fees, marks, student notices.
  - `database/schema/admissions.ts`: Online applications, application numbers, statuses (`submitted`, `under_review`, `approved`, `rejected`).
  - `database/schema/cms.ts`: Server-driven block pages, sections, blocks, Page Builder Studio revisions.
  - `database/schema/blogs.ts`, `enquiries.ts`, `gallery.ts`, `materials.ts`, `settings.ts`.
  - `database/schema/index.ts`: Central re-export of all schema tables, enums, and inferred types.
- **Connection & Query Layer (`app/initializers/database.ts`)**:
  - Pool connection via `pg` `Pool` initialized with `DATABASE_URL` from `config/app.ts`.
  - Query via `@remix-run/data-table` / `remix/data-table/postgres` or parameterized SQL queries using `db.query(table)...`.

### 2. Migrations Workflow
Whenever modifying or adding any table schema:
1. **Schema Updates (`database/schema/`)**:
   - Update or create the schema files in `database/schema/*.ts`.
   - Re-export the table definitions and types in `database/schema/index.ts`.
2. **Migration SQL Files (`database/migrations/`)**:
   - Create the next sequentially numbered migration directory under `database/migrations/` (e.g. `0004_your_migration_name/`).
   - Write idempotent forward migration SQL in `up.sql`.
   - Write safe rollback SQL in `down.sql`.
3. **Execute Migration**:
   - Apply migrations to the local database: `npm run db:migrate` (or `node --env-file=.env database/migrate.ts`).
4. **Seeding (`database/seed.ts`)**:
   - If initial seed data or bootstrap users are required, update `database/seed.ts` and apply with `npm run db:seed`.

### 3. Data Conventions
- **Naming Conventions (`snake_case`)**:
  - **SQL Tables**: Always lowercase `snake_case` (e.g. `users`, `admissions`, `courses`, `batches`, `enrollments`, `cms_pages`). **Never** use `PascalCase` or uppercase letters for database table names.
  - **SQL Columns**: Always lowercase `snake_case` in PostgreSQL (e.g. `created_at`, `full_name`, `user_id`, `batch_id`, `admission_number`). In TypeScript, expose standard `camelCase` properties (`createdAt`, `fullName`, `userId`, `batchId`, `admissionNumber`). **Never** define SQL column names using `camelCase`.
- **Primary Keys**: Always UUIDv7 generated via `@sdxc/uuid/v7` (`generateUUID()`). **Never** use UUID v4 or auto-incrementing integer IDs.
- **Soft Deletes**: Tables with `deleted_at` must be queried with `WHERE deleted_at IS NULL` or equivalent soft-delete helper.
- **Rich Text & Block Content**: Store CMS blocks, syllabus outlines, and structured payloads as `JSONB`, never raw unchecked HTML strings.
