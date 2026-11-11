# Tasks

## 1. Dependencies, Configuration & Database Schema

- [ ] 1.1 Install `@sdxc/authz`, `@sdxc/crypto`, `@sdxc/password-policy`, `@sdxc/email-address`, `@sdxc/mail`, `@sdxc/result`, `@sdxc/uuid`, `@sdxc/csv`, `nodemailer`, and `@types/nodemailer` in `package.json` and verify `npm install` and `npm run typecheck` succeed.
- [ ] 1.2 Add SMTP and session configuration variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`) to `config/app.ts` and `.env.example`, and verify config parsing unit tests pass for both SMTP-enabled and local fallback modes.
- [ ] 1.3 Author SQL migration `database/migrations/0002_multi_role_lms/up.sql` and `down.sql` plus `database/schema/` definitions (`users`, `sessions`, `batches`, `enrollments`, `syllabus_topics`, `exams`, `exam_results`, `notifications`, and `materials`/`admissions` extensions), and verify `npm run db:migrate` applies cleanly and rolls back cleanly.
- [ ] 1.4 Update `database/seed.ts` to upsert the bootstrap `admin` user from `PAART_ADMIN_EMAIL` / `PAART_ADMIN_PASSWORD` alongside sample `faculty`, `aspirant`, batch, syllabus, exam, scorecard, and notification records, and verify `npm run db:seed` is idempotent across repeated runs.

## 2. Multi-Role Authentication, Sessions & RBAC (`identity/multi-role-auth`)

- [ ] 2.1 Implement `app/initializers/auth.ts` with `@sdxc/crypto` `scrypt` password hashing/verification, CSPRNG temporary password generation, `@sdxc/email-address` normalization, and PostgreSQL hashed-token session lifecycle (`createSession`, `resolveSession`, `revokeSession`, `revokeUserSessions`), and verify auth unit tests pass.
- [ ] 2.2 Implement `app/initializers/authz.ts` (`@sdxc/authz` abilities & role policies for `admin`, `faculty`, `aspirant`) and `app/http/middleware/auth.ts` (`loadSessionUser`, `requireRole`, `enforcePasswordChange`), and verify middleware tests confirm unauthenticated redirects to `/login`, cross-role `403 Forbidden` responses, and `must_change_password` redirects to `/account/change-password`.
- [ ] 2.3 Build unified `/login` (`GET`/`POST`), `/logout` (`POST`), `/admin/sign-in` -> `/login` redirect, and `/account/change-password` (`GET`/`POST` using `@sdxc/password-policy`) controllers and `@sdxc/u` + `@sdxc/ui` views, plus role-aware workspace links in `resources/layouts/landing.tsx`, and verify route tests pass for all three roles and first-login password rotation.

## 3. Admin Account Provisioning & SMTP Delivery (`identity/account-provisioning`)

- [ ] 3.1 Implement `app/initializers/mail.ts` with JSX credential/reset email templates (`@sdxc/mail`), `SmtpTransport` (`buildMimeMessage` + `nodemailer`), and `MemoryTransport` fallback when `SMTP_HOST` is unset, and verify unit tests assert multipart HTML/plain-text MIME output and graceful `Result` error handling on transport failure.
- [ ] 3.2 Implement `/admin/users` and `/admin/batches` management controllers and views (`create` faculty/aspirant with enrollment, `resend-credentials`, `suspend`/`reactivate` with immediate session revocation and self-suspension guard) and link them in `resources/layouts/admin.tsx`, and verify integration tests cover duplicate-email rejection, `MemoryTransport` email capture, credential re-issuance, and session invalidation on suspension.
- [ ] 3.3 Extend `/admin/admissions` with 1-click Aspirant provisioning (creating the `aspirant` user, active batch `enrollment`, `provisioned_user_id` link, `enrolled` status update, and SMTP credential dispatch), and verify admission-conversion tests pass.

## 4. Faculty Workspace (`lms/faculty-workspace`)

- [ ] 4.1 Create `resources/layouts/faculty.tsx` and `/faculty` dashboard plus batch syllabus topic progress routes (`/faculty/batches/:id/syllabus`) styled with `@sdxc/u` and `@sdxc/ui`, and verify tests confirm syllabus completion updates recalculate batch progress percentages accurately.
- [ ] 4.2 Implement `/faculty/exams` scheduling, draft marks entry (`/faculty/exams/:id/marks`), `@sdxc/csv` bulk marks import/template export (`/faculty/exams/:id/marks/import`), and result publication (`/faculty/exams/:id/publish`) with deterministic batch rank calculation, and verify tests cover `max_marks` bounds, CSV formula-injection/row validation, draft hiding, and rank computation.
- [ ] 4.3 Implement `/faculty/materials` (`public` vs `enrolled` visibility scoped to courses) and `/faculty/notifications` (`all`, `course`, `batch` targeting), update public `/materials` query to filter strictly to `visibility = 'public'`, and verify tests confirm `enrolled` materials never leak onto public `/materials`.

## 5. Aspirant Portal (`lms/aspirant-portal`)

- [ ] 5.1 Create `resources/layouts/portal.tsx` and `/portal` overview + `/portal/progress` views rendering enrolled batch info, syllabus module completion, KPI summary cards, and a server-rendered `@sdxc/ui` chronological score-trend `Chart` (including clean zero-exam empty states), and verify portal overview tests pass.
- [ ] 5.2 Implement `/portal/exams` (upcoming/past batch timetable) and `/portal/marks` (published scorecards, percentage, qualify badge, rank, and faculty remarks strictly scoped to session `user.id`), and verify cross-aspirant isolation tests confirm an aspirant never sees `draft` results or another aspirant's marks.
- [ ] 5.3 Implement `/portal/materials` (enrolled course + public study materials) and `/portal/notifications` (targeted `all` / enrolled `course` / enrolled `batch` feed ordered newest-first), and verify scoping tests confirm unrelated course/batch items are excluded.

## 6. End-to-End Integration Verification & Knowledge Graph Sync

- [ ] 6.1 Run full end-to-end verification across Admin provisioning -> SMTP outbox capture -> Aspirant first-login password change -> Faculty exam & marks publication -> Aspirant portal scorecard inspection, and verify `npx vp check --deny-warnings`, `npm run typecheck`, `npm run build`, and `npm test` all exit `0`.
- [ ] 6.2 Refresh the repository architecture graph by running `graphify update .` and verify `graphify-out/graph.json` updates cleanly with zero errors.

## Workflow follow-up

- Archive `multi-role-lms-portals` via `/openspec-archive-change` once implementation and review are complete.
- Propose Change 2 (`server-driven-pages` — full-site database block publishing engine leveraging real `users.id` authorship and `@sdxc/authz`) via `/openspec-propose`.

