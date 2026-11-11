# Design: Multi-Role Identity, SMTP Provisioning & LMS Portals

## Context

PAART Academy is a pure server-rendered Remix 3 (`remix` v3.0.0-alpha.4) + PostgreSQL (`pg` + `remix/data-table`) application styled with `@sdxc/u` and `@sdxc/ui`. Today:

- Authentication (`app/initializers/auth.ts`, `app/http/middleware/auth.ts`) compares submitted credentials against a single `.env` pair (`PAART_ADMIN_EMAIL` / `PAART_ADMIN_PASSWORD`) and sets a stateless HMAC-signed cookie (`paart_admin_session`) carrying `{ id: "admin-1", role: "admin" }`.
- There is no `users` or `sessions` table, no email delivery infrastructure, and no workspace for Faculty or enrolled Aspirants.
- This change (`multi-role-lms-portals`) is **Change 1 of a 2-phase roadmap**: establishing real database-backed identity (`admin`, `faculty`, `aspirant`), SMTP credential provisioning, and the Faculty (`/faculty/*`) and Aspirant (`/portal/*`) LMS portals first, so that **Change 2 (`server-driven-pages`)** can attach page revision authorship (`updated_by -> users.id`) and `@sdxc/authz` publishing permissions directly onto real user accounts.

## Goals / Non-Goals

**Goals:**

- Replace `.env`-only stateless admin auth with PostgreSQL `users` and revocable `sessions` supporting `admin`, `faculty`, and `aspirant` roles while keeping `.env` admin credentials as the idempotent bootstrap seed admin.
- Enforce mandatory first-login password rotation (`must_change_password`) for Admin-provisioned accounts using NIST SP 800-63B-4 rules (`@sdxc/password-policy`) and `scrypt` hashing (`@sdxc/crypto`).
- Deliver formatted welcome and credential-reset emails over **SMTP** using `@sdxc/mail` JSX email components and RFC 5322 MIME generation (`buildMimeMessage`), with graceful failure handling and a zero-dependency `MemoryTransport` / console outbox fallback in local dev and automated tests.
- Provide complete server-rendered `/faculty/*` and `/portal/*` portals covering batch enrollments, exam scheduling, draft/published marks & CSV import (`@sdxc/csv`), syllabus topic progress, `public` vs `enrolled` study materials, and targeted notifications.
- Centralize role and resource authorization via `@sdxc/authz` middleware and route policies.

**Non-Goals:**

- Public self-signup or "forgot password" unauthenticated self-service reset flows (account creation and credential resets are intentionally closed Admin-only workflows per academy policy; Admin can re-issue credentials in 1 click).
- Real-time online timed MCQ exam-taking engine in the browser (Phase 1 focuses on scheduling offline/OMR & mock tests, publishing marks/ranks/remarks, tracking syllabus progress, notifications, and materials).
- Database-backed block page builder for public marketing pages (deferred cleanly to Change 2: `server-driven-pages`).

## Decisions

### 1. Server-Managed Hashed Sessions + `@sdxc/crypto` `scrypt` Passwords

- **Decision**: Store users in `users` (UUIDv7 PK via `@sdxc/uuid/v7`) with `password_hash` produced by `@sdxc/crypto` (`scrypt`, 16-byte random salt, 64-byte derived key, constant-time verification). Store sessions in `sessions` keyed by `token_hash = SHA-256(raw_cookie_token)` using `@sdxc/crypto` (`Sha256` + `Base64Url` 32-byte CSPRNG token), delivered in an `HttpOnly`, `SameSite=Lax`, `Secure` (in production) cookie `paart_session`.
- **Rationale**: Unlike stateless JWT/HMAC cookies, server-stored hashed session tokens allow immediate server-side revocation when an Admin suspends a Faculty/Aspirant account, resets a user's password, or when the user changes their temporary password on first login. Storing `SHA-256(token)` ensures a read-only database leak cannot be replayed as session cookies.
- **Alternatives considered**: Keeping stateless Remix `createCookie` sessions—rejected because suspended users or compromised temporary-password sessions could not be invalidated before cookie expiry.

### 2. Authorization Architecture with `@sdxc/authz` + Mandatory Password-Change Gate

- **Decision**: Define a typed `@sdxc/authz` ability catalog in `app/initializers/authz.ts` (`admin:access`, `users:manage`, `lms:teach`, `lms:portal`, `materials:view-enrolled`) mapped additively to user roles (`admin`, `faculty`, `aspirant`). Pair this with two focused Remix middlewares in `app/http/middleware/auth.ts`:
  1. `loadSessionUser()` (global): resolves `paart_session` -> `{ user, session }` into request context (clearing invalid/expired/suspended cookies) so public layouts (`resources/layouts/landing.tsx`) can also display a role-aware "Go to Portal / Faculty / Admin" button.
  2. `requireRole(roles)` + `enforcePasswordChange()`: redirects unauthenticated requests to `/login`, redirects any user with `must_change_password = true` to `/account/change-password` (allowing only `/account/change-password` and `/logout`), and returns HTTP `403` when an authenticated user lacks the ability for `/admin/*`, `/faculty/*`, or `/portal/*`.
- **Rationale**: Keeps controller handlers thin and declarative while guaranteeing no route under `/faculty/*` or `/portal/*` can accidentally bypass `must_change_password` or cross-role checks.

### 3. SMTP Email Delivery via `@sdxc/mail` + Thin Node `nodemailer` SMTP Transport

- **Decision**: Author welcome and credential-reset emails as typed JSX templates using `@sdxc/mail` (`<Email.Layout>`, `<Email.Heading>`, `<Email.CodeInline>`, `<Email.Button>`, `<Email.Footer>`), which automatically produces normalized HTML + plain-text (`htmlToText`) and RFC 5322 MIME output (`buildMimeMessage`). Implement `SmtpTransport` in `app/initializers/mail.ts` conforming to `@sdxc/mail`'s `Transport` interface (`send(message): Promise<Result<SentMessage, MailError>>`) backed by `nodemailer` (`createTransport({ host, port, secure, auth })` sending the raw MIME or normalized message).
  - When `SMTP_HOST` is configured, `Mailer` uses `SmtpTransport`.
  - When `SMTP_HOST` is empty in development/test (`NODE_ENV !== "production"`), `Mailer` falls back to `@sdxc/mail/memory` (`MemoryTransport`) plus structured dev console logging so local development and Vitest integration tests inspect sent credentials deterministically without external network calls.
  - Temporary passwords are generated with CSPRNG (`@sdxc/crypto` random bytes mapped to an unambiguous alphanumeric + symbol alphabet of 14 characters) and are **never** stored in plaintext—only passed once into the outgoing email template.
- **Rationale**: `@sdxc/mail` gives brand-consistent JSX emails, automatic plain-text alternatives, header-injection protection, and `Result`-typed error handling (`@sdxc/result`) so SMTP timeouts never crash an Admin HTTP mutation; `nodemailer` provides battle-tested STARTTLS/SMTPS connection pooling and authentication across Gmail Workspace, SES, Zoho, Postmark, and custom SMTP relays.
- **Alternatives considered**: Raw `node:tls` socket SMTP state machine—rejected due to brittle STARTTLS/AUTH LOGIN/CRAM-MD5 edge cases across real-world SMTP providers.

### 4. Relational LMS Data Model (`0002_multi_role_lms`)

- **Decision**: Extend `database/schema/` and add SQL migration `database/migrations/0002_multi_role_lms/` with the following normalized PostgreSQL tables (UUIDv7 `id` text/uuid keys matching existing `0001_initial` conventions):
  - `users`: `id`, `email` (unique lowercase normalized via `@sdxc/email-address`), `full_name`, `phone`, `role` (`admin` | `faculty` | `aspirant`), `password_hash`, `must_change_password` (`boolean`), `status` (`active` | `suspended`), `last_login_at`, `credentials_sent_at`, `credentials_delivery_error`, `created_at`, `updated_at`.
  - `sessions`: `id`, `user_id` (`FK -> users.id ON DELETE CASCADE`), `token_hash` (unique), `ip_address`, `user_agent`, `expires_at`, `created_at`.
  - `batches`: `id`, `course_id` (`FK -> courses.id`), `faculty_id` (`FK -> users.id`, nullable for shared batches), `name` (e.g., `"TNPSC Group I — 2026 Morning Batch A"`), `code` (unique), `schedule_label`, `starts_on`, `ends_on`, `is_active`, `created_at`.
  - `enrollments`: `id`, `batch_id` (`FK -> batches.id`), `aspirant_id` (`FK -> users.id`), `admission_id` (`FK -> admissions.id`, nullable), `roll_number` (unique per batch), `status` (`active` | `completed` | `dropped`), `enrolled_at` — unique `(batch_id, aspirant_id)`.
  - `syllabus_topics`: `id`, `batch_id` (`FK -> batches.id`), `unit_label`, `title`, `sort_order`, `status` (`pending` | `in_progress` | `completed`), `completed_at`, `updated_by` (`FK -> users.id`).
  - `exams`: `id`, `batch_id` (`FK -> batches.id`), `title`, `exam_type` (`weekly_mock` | `omr_revision` | `full_test`), `exam_date`, `syllabus_notes`, `max_marks`, `qualifying_marks`, `status` (`scheduled` | `published`), `published_at`, `created_by` (`FK -> users.id`), `created_at`.
  - `exam_results`: `id`, `exam_id` (`FK -> exams.id ON DELETE CASCADE`), `aspirant_id` (`FK -> users.id`), `attendance` (`present` | `absent`), `marks_obtained` (`numeric(6,2)`), `rank` (`integer`, nullable until published), `remarks`, `updated_by` (`FK -> users.id`), `updated_at` — unique `(exam_id, aspirant_id)`.
  - `notifications`: `id`, `title`, `body`, `category` (`exam` | `material` | `schedule` | `general`), `target_scope` (`all` | `course` | `batch`), `target_course_id` (`FK -> courses.id`, nullable), `target_batch_id` (`FK -> batches.id`, nullable), `published_by` (`FK -> users.id`), `published_at`.
  - Alter `materials`: add `course_id` (`FK -> courses.id`, nullable) and `visibility` (`'public' | 'enrolled'`, default `'public'`), plus `uploaded_by` (`FK -> users.id`, nullable).
  - Alter `admissions`: add `provisioned_user_id` (`FK -> users.id`, nullable) to link 1-click converted applicants.
- **Rationale**: Clean relational foreign keys make aspirant scoping trivial (`WHERE enrollments.aspirant_id = $currentUserId AND enrollments.status = 'active'`), eliminate cross-tenant data leaks, and calculate batch ranks deterministically in SQL/service code (`DENSE_RANK() OVER (ORDER BY marks_obtained DESC)` among `present` aspirants) when an exam is published.

### 5. Pure SSR UI Architecture (`@sdxc/u` + `@sdxc/ui`)

- **Decision**: Build two new role shells—`resources/layouts/faculty.tsx` and `resources/layouts/portal.tsx`—alongside existing `resources/layouts/admin.tsx`, keeping zero client SPA router state:
  - Use `@sdxc/ui` server-rendered components (`Table`, `Badge`, `Card`, `Button`, `Alert`, `Progress`, and SVG `Chart` for the aspirant's chronological test-score trend) composed with `@sdxc/u` (`mix={[...]}`) tokens and PAART Academy's `Cormorant Garamond` + `Outfit` + `Noto Sans Tamil` design language.
  - All mutations use standard progressive-enhancement HTML `<form method="post">` + Remix `formData` middleware + PRG (`303 See Other`) redirects with flash/query banners.

## Risks / Trade-offs

- **[SMTP Misconfiguration or Relay Latency]** -> Synchronous SMTP handshakes can take 1–3s or fail if credentials expire. _Mitigation_: Configure explicit socket/greeting timeouts (e.g., 8s) in `SmtpTransport`, wrap `mailer.send()` in `@sdxc/result` handling so account creation still commits cleanly, record `credentials_delivery_error` on `users`, show an actionable warning banner in `/admin/users`, and provide 1-click **Reset & Resend Credentials**.
- **[Breaking Existing `.env` Admin Login Flow]** -> Operators bookmarked `/admin/sign-in` or rely on `PAART_ADMIN_EMAIL` / `PAART_ADMIN_PASSWORD`. _Mitigation_: `GET /admin/sign-in` redirects to `/login`, and `database/seed.ts` (plus startup bootstrap helper when `users` has zero admins) upserts the initial `admin` user from `PAART_ADMIN_EMAIL` / `PAART_ADMIN_PASSWORD` with `must_change_password = false`.
- **[Cross-Aspirant Data Exposure]** -> A crafted URL or form field could attempt to read another student's marks or enrolled materials. _Mitigation_: Portal repository queries accept `aspirantId` strictly from `context.get(AuthSessionContext).user.id`—never from URL params or query strings—backed by integration tests asserting cross-aspirant isolation.
- **[CSV Marks Import Formatting Errors]** -> Faculty spreadsheets may contain extra spaces, missing emails, or formula-prefixed cells (`=HYPERLINK(...)`). _Mitigation_: Parse and export marks templates with `@sdxc/csv` (RFC 4180 compliant with formula-injection neutralization) and validate every row in a single database transaction with row-numbered feedback.

## Migration Plan

1. Install `@sdxc/authz`, `@sdxc/crypto`, `@sdxc/password-policy`, `@sdxc/email-address`, `@sdxc/mail`, `@sdxc/result`, `@sdxc/uuid`, `@sdxc/csv`, and `nodemailer` (`+ @types/nodemailer`).
2. Add `database/migrations/0002_multi_role_lms/up.sql` and `down.sql` creating `users`, `sessions`, `batches`, `enrollments`, `syllabus_topics`, `exams`, `exam_results`, `notifications`, and extending `materials` and `admissions` backwards-compatibly (`visibility` defaults to `'public'`).
3. Update `database/seed.ts` to seed the bootstrap `admin` account from `PAART_ADMIN_EMAIL` / `PAART_ADMIN_PASSWORD`, demo `faculty` and `aspirant` accounts (in dev), sample batches, syllabus topics, scheduled/published exams, marks, and notifications.
4. Rollback strategy: `npm run db:migrate down` executes `0002_multi_role_lms/down.sql`, dropping the new LMS/auth tables and reverting added columns on `materials` and `admissions` cleanly.
