# Tasks

## 1. Dependencies, Database Schema & Seed Manifests

- [x] 1.1 Install `@sdxc/bracket-params`, `@sdxc/json-patch`, `@sdxc/markdown`, `@sdxc/cache`, `@sdxc/expression`, `@sdxc/lazy-frame`, and `@sdxc/strings` in `package.json` (configuring `vite.config.ts` SSR bundling if needed) and verify `npm install` and `npm run typecheck` exit `0`.
- [x] 1.2 Create SQL migration `database/migrations/0003_server_driven_pages/up.sql` and `down.sql` plus `database/schema/cms.ts` (`pages`, `page_revisions`, `site_chrome`) registered in `database/migrate.ts` and `database/schema/index.ts`, and verify `npm run db:migrate` applies and rolls back cleanly.
- [x] 1.3 Define typed block discriminated-union schemas, site-chrome schemas, and reserved-slug validators in `app/models/cms-schemas.ts` (`remix/data-schema` + `@sdxc/strings`), and verify unit tests cover valid block parsing, malformed block rejection, and reserved-route slug guards.
- [x] 1.4 Author default institutional manifests in `config/default-pages.ts` (migrating all copy, metrics, FAQs, nav, and footer columns from `config/trust.ts`, `config/faqs.ts`, `landing.tsx`, and existing public views across `/`, `/about`, `/courses`, `/materials`, `/gallery`, `/blogs`, `/faq`, `/contact`, `/admissions`, `template:course-detail`, `template:blog-detail`, and `site_chrome`) and update `database/seed.ts`, verifying `npm run db:seed` is idempotent across repeated runs.

## 2. CMS Data Layer, Caching, Markdown & Visibility Engine (`cms/block-page-rendering`)

- [x] 2.1 Implement `app/models/cms.ts` and `app/initializers/cms-cache.ts` (`@sdxc/cache` `MemoryCache` for published manifests & `site_chrome`, cache purge helpers, `@sdxc/json-patch` draft operations + diff generation, atomic publish with `users.id` authorship, revision history, 1-click restore, and offline fallback to `config/default-pages.ts`), and verify model unit tests cover draft isolation, optimistic version conflict (`409`), publish, rollback, cache invalidation, and offline fallback.
- [x] 2.2 Implement safe Markdown AST rendering (`@sdxc/markdown` without raw HTML/script execution) and server-side block visibility evaluation (`@sdxc/expression` for date windows and session roles) in `app/initializers/cms-render.tsx`, and verify unit tests confirm `<script>` / `javascript:` neutralization and role/date visibility filtering.
- [x] 2.3 Implement selective parallel block data hydration (`hydratePageBlocks` in `app/models/cms-hydrator.ts`) fetching only referenced live collections (`courses`, `public`-only `materials`, `blogs`, `gallery`, and fresh per-request `@sdxc/honeypot` fields), and verify hydrator tests confirm zero unnecessary queries, `enrolled` material exclusion, and fresh honeypot issuance per request.

## 3. Institutional Block Catalog & Public SSR Routing (`cms/block-page-rendering`)

- [x] 3.1 Build the 16 institutional server block components and fault-isolating `<BlockRenderer />` in `resources/blocks/` (`notice_bar`, `academic_hero`, `page_banner`, `honour_roll_stats`, `department_table`, `pillars_grid`, `rich_prose`, `course_catalog`, `materials_catalog`, `gallery_showcase`, `blog_feed`, `faq_accordion`, `contact_hub`, `admission_form`, `callout_band`, `entity_detail_main`) plus database-driven `LandingLayout` chrome (`utility_bar`, `header_nav`, `footer_columns`, Admin draft-preview banner) styled strictly with `@sdxc/u` and `@sdxc/ui`, and verify component/renderer tests confirm malformed single blocks are skipped without crashing the page.
- [x] 3.2 Refactor public controllers (`public/controller.tsx`, `courses/controller.tsx`, `blogs/controller.tsx`, `admissions/controller.tsx`), `routes/web.ts` (adding custom campaign `/:slug` after explicit routes), `sitemap.ts`, and `llms.ts` to render from `pages` and `site_chrome` with automatic `FAQPage` / `EducationalOrganization` / `Course` / `Article` JSON-LD and `?preview=draft` support (`noindex, nofollow`, `private, no-store`), and verify route integration tests cover core pages, custom campaign slugs, unpublished `404`s, entity templates, and sitemap/llms inclusion.

## 4. Admin Page Builder & Site Chrome Studio (`cms/page-publishing`)

- [x] 4.1 Extend `app/initializers/authz.ts` with `cms.manage` abilities restricted to `admin`, add `/admin/pages*` and `/admin/chrome*` routes in `routes/web.ts` and navigation links in `resources/layouts/admin.tsx`, and verify RBAC tests confirm `faculty` and `aspirant` receive `403 Forbidden` and non-admins cannot activate `?preview=draft`.
- [x] 4.2 Implement the Admin Page Studio controller and views (`/admin/pages` index + create campaign dialog, `/admin/pages/:id` block composer using `@sdxc/bracket-params` nested forms, `@sdxc/json-patch` reorder/add/duplicate/toggle/delete actions, live `<LazyFrame>` / `<Frame>` `?preview=draft` pane, atomic publish, and revision rollback drawer), and verify controller tests cover campaign creation, draft edits leaving live pages unchanged, stale version conflict rejection, publish with `users.id` attribution, and 1-click revision restore.
- [x] 4.3 Implement the Admin Site Chrome Studio (`/admin/chrome` GET/POST) using `@sdxc/bracket-params` to edit utility bar announcements, header navigation links, trust profile contact/hours details, and footer link columns with instant cache purge, and verify integration tests confirm saved chrome changes immediately appear across public pages.

## 5. End-to-End Publishing Verification & Knowledge Graph Sync

- [x] 5.1 Run an end-to-end integration test covering Admin creating a campaign page -> adding/reordering blocks in draft -> verifying public `404` while Admin `?preview=draft` renders `noindex` draft -> publishing -> verifying public `200` + `/sitemap.xml` + `/llms.txt` -> editing & rolling back to revision 1, and verify `npx vp check --deny-warnings`, `npm run typecheck`, `npm run build`, and `npm test` all exit `0`.
- [x] 5.2 Refresh the repository architecture graph by running `graphify update .` and verify `graphify-out/graph.json` updates cleanly with zero errors.

## Workflow follow-up

- Archive `server-driven-pages` via `/openspec-archive-change` after implementation and review are complete.
