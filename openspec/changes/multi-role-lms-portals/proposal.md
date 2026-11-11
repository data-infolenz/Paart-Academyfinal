# Proposal

## Why

PAART Academy currently relies on a single hardcoded `.env` administrator login (`PAART_ADMIN_EMAIL` / `PAART_ADMIN_PASSWORD`) with a stateless cookie and has no accounts or workspaces for teaching faculty or enrolled aspirants. Replacing this with database-backed multi-role authentication (`admin`, `faculty`, `aspirant`), SMTP credential provisioning, and dedicated Faculty and Aspirant LMS portals lets the academy manage batches, mock exams, marks, progress, notifications, and study materials end-to-end—while establishing the real `users` and RBAC foundation needed before building the full-site server-driven page publishing engine.

## What Changes

- **BREAKING**: Replace stateless `.env`-only admin authentication (`app/initializers/auth.ts`, `/admin/sign-in`) with a PostgreSQL-backed unified identity and revocable `sessions` system (`/login`, `/logout`, `/account/change-password`) supporting three roles (`admin`, `faculty`, `aspirant`), while keeping `.env` admin credentials as the bootstrap seed administrator (`database/seed.ts`) and preserving a `/admin/sign-in` -> `/login` redirect.
- Introduce typed role-based access control via `@sdxc/authz` across `/admin/*`, `/faculty/*`, and `/portal/*` routes and mutations, plus first-login mandatory password change (`must_change_password`) validated with `@sdxc/password-policy` and `@sdxc/crypto` (`scrypt`).
- Add closed Admin-only account provisioning (`/admin/users` and 1-click provisioning from `/admin/admissions`) that generates a cryptographic temporary password, normalizes recipient emails via `@sdxc/email-address`, and sends branded JSX transactional emails via `@sdxc/mail` over a Node SMTP transport (with Admin "Reset & Resend Credentials" support and `MemoryTransport` / console outbox in development & tests).
- Add LMS relational tables and models (`users`, `sessions`, `batches`, `enrollments`, `exams`, `exam_results`, `syllabus_progress`, `notifications`, plus `visibility: "public" | "enrolled"` and `course_id` scoping on `materials`).
- Introduce the **Faculty Workspace (`/faculty/*`)** enabling faculty (and admins) to schedule mock/OMR exams, record or CSV-import (`@sdxc/csv`) aspirant test marks and remarks, update batch syllabus completion progress, upload public or enrolled-only study materials, and publish targeted batch/exam notifications.
- Introduce the **Aspirant Portal (`/portal/*`)** enabling enrolled aspirants to track course syllabus progress and test-score trends (server-rendered `@sdxc/ui` charts), view upcoming exam schedules, inspect published test marks and ranks, download enrolled study materials, and read targeted notifications.
- Update public header navigation (`resources/layouts/landing.tsx`) to reflect signed-in user identity and route each role directly to its workspace (`/admin`, `/faculty`, or `/portal`).

## Capabilities

### New Capabilities

- `identity/multi-role-auth`: Unified `/login` and `/logout` flows, PostgreSQL `users` and revocable `sessions` management, `@sdxc/crypto` `scrypt` password verification, mandatory first-login password change (`/account/change-password`) with `@sdxc/password-policy`, and `@sdxc/authz` role-based route and action authorization for `admin`, `faculty`, and `aspirant`.
- `identity/account-provisioning`: Closed Admin-only creation, suspension, and credential reset of `faculty` and `aspirant` accounts (including 1-click aspirant provisioning from `/admin/admissions`), batch/course enrollment assignment, and `@sdxc/mail` SMTP welcome/reset email delivery.
- `lms/faculty-workspace`: Faculty portal (`/faculty/*`) for managing assigned batches, scheduling mock/OMR exams, entering/importing and publishing aspirant exam marks, updating syllabus topic progress, uploading visibility-scoped study materials, and posting notifications.
- `lms/aspirant-portal`: Aspirant portal (`/portal/*`) for viewing course/syllabus progress and score-trend charts, upcoming exam timetables, published exam marks and scorecards, enrolled and public study materials, and academy/batch notifications.

### Modified Capabilities

<!-- No existing specs in openspec/specs/ -->

## Impact

- **Database & Migrations**: Adds `0002_multi_role_lms` SQL migration (`up.sql` / `down.sql`), `database/schema/` tables (`users`, `sessions`, `batches`, `enrollments`, `exams`, `exam_results`, `syllabus_progress`, `notifications`, and `materials` visibility/course columns), and updates `database/seed.ts`.
- **Auth, Mail & Middleware**: Replaces `app/initializers/auth.ts` and `app/http/middleware/auth.ts`; adds `app/initializers/mail.ts` (SMTP transport + `@sdxc/mail` templates) and `app/initializers/authz.ts` (`@sdxc/authz` ability catalog & policies); adds SMTP environment config (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`) in `config/app.ts` and `.env.example`.
- **Routes, Controllers & Views**: Expands `routes/web.ts` and `app/initializers/router.ts` with `/login`, `/logout`, `/account/change-password`, `/admin/users`, `/admin/batches`, `/faculty/*`, and `/portal/*`; adds `resources/layouts/faculty.tsx`, `resources/layouts/portal.tsx`, and corresponding server-rendered views styled with `@sdxc/u` and `@sdxc/ui`.
- **Dependencies**: Adds `@sdxc/authz`, `@sdxc/crypto`, `@sdxc/password-policy`, `@sdxc/email-address`, `@sdxc/mail`, `@sdxc/result`, `@sdxc/uuid`, and `@sdxc/csv`.
