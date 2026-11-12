# Proposal

## Why

All public pages on PAART Academy (`/`, `/about`, `/courses`, `/materials`, `/gallery`, `/blogs`, `/faq`, `/contact`, `/admissions`) plus the global institutional header, navigation, footer, impact metrics (`323+`), state rank highlights, and FAQs are currently hardcoded in TypeScript views and `config/*.ts` files, requiring code deployments whenever administrators need to update batch announcements, selection counts, page sections, or launch a new exam campaign landing page. Now that multi-role authentication (`users.id`) and `@sdxc/authz` RBAC are in place, moving every public page and site-wide chrome element into a database-backed, typed block publishing engine empowers Administrators to compose, preview, publish, and roll back pages safely without sacrificing PAART Academy's institutional design or SSR speed.

## What Changes

- Introduce PostgreSQL tables `pages`, `page_revisions`, and `site_chrome` (with SQL migration `0003_server_driven_pages` and idempotent seed migration of all hardcoded copy from `config/trust.ts`, `config/faqs.ts`, `resources/layouts/landing.tsx`, and existing public views into structured database rows).
- Build a typed, schema-validated Server-Driven Block Registry & SSR `<BlockRenderer />` styled exclusively with `@sdxc/u` and `@sdxc/ui` (zero extra client bundle weight for static blocks), covering institutional notices, academic hero, honour-roll metrics & state rank plaques, department selection tables, vision/mission/pillars cards, course catalog grids, public study materials lists, gallery grids, blog feeds, Markdown prose sections (`@sdxc/markdown`), FAQ accordions, campus contact/enquiry forms, online admission application forms, and callout bands, plus entity detail templates (`course_detail`, `blog_detail`).
- Support custom Administrator-created campaign slugs (`/:slug`, e.g., `/tnpsc-group-4-2027` or `/nmms-scholarship`) alongside all core public routes, automatically syncing published indexable pages into `/sitemap.xml`, `/llms.txt`, and JSON-LD structured data (`EducationalOrganization`, `FAQPage`, `Course`, `Article`).
- Add optional per-block visibility expressions (`@sdxc/expression`) for date-windowed announcements or session-role banners, backed by fast in-memory SSR page caching (`@sdxc/cache`) with instant cache invalidation on publish/rollback and resilient seed-document fallback if PostgreSQL is unreachable.
- Build the Administrator Page Builder & Site Chrome Studio (`/admin/pages`, `/admin/pages/:id`, `/admin/chrome`) protected by `@sdxc/authz`, featuring nested HTML form parsing (`@sdxc/bracket-params`), RFC 6902 block reordering/insert/delete/optimistic-version operations (`@sdxc/json-patch`), Draft vs. Published separation, live SSR `<Frame>` / `?preview=draft` preview (`@sdxc/lazy-frame`), real `users.id` authorship tracking, and immutable `page_revisions` snapshots with 1-click rollback.

## Capabilities

### New Capabilities

- `cms/block-page-rendering`: Database-backed public page, custom campaign slug, entity-template, and site-chrome SSR rendering with per-block schema validation, live collection hydration, safe Markdown and visibility-rule evaluation, SEO/sitemap synchronization, caching, and offline fallback.
- `cms/page-publishing`: Administrator-only block composer, site-chrome editor, draft/preview workflow (`?preview=draft` and live `<Frame>`), atomic publishing with `users.id` authorship, optimistic concurrency, cache invalidation, and revision rollback.

### Modified Capabilities

<!-- None: existing identity/* and lms/* requirement contracts remain unchanged. -->

## Impact

- **Database & Seed**: Adds `database/migrations/0003_server_driven_pages/{up,down}.sql`, `database/schema/cms.ts`, and seeds all core pages, entity templates, and `site_chrome` in `database/seed.ts`.
- **Dependencies**: Adds `@sdxc/bracket-params`, `@sdxc/json-patch`, `@sdxc/markdown`, `@sdxc/cache`, `@sdxc/expression`, `@sdxc/lazy-frame`, and `@sdxc/strings`.
- **Public Routing & Views**: Refactors `routes/web.ts`, `app/http/controllers/public/controller.tsx`, `courses/controller.tsx`, `blogs/controller.tsx`, `admissions/controller.tsx`, `sitemap.ts`, `llms.ts`, and `resources/layouts/landing.tsx` to render from `pages` and `site_chrome` via `resources/blocks/*`.
- **Admin Console**: Adds `/admin/pages`, `/admin/pages/:id`, and `/admin/chrome` routes, controllers, `@sdxc/authz` policies (`cms.manage`), and composer views in `resources/views/admin/`.
