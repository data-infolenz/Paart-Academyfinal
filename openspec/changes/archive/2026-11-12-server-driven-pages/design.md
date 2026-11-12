# Design

## Context

PAART Academy now runs multi-role authentication (`users`, `sessions`, `@sdxc/authz`) and LMS workspaces (`/admin`, `/faculty`, `/portal`) on PostgreSQL 17, Remix 3 (`remix/component`, `remix/data-table`, `remix/data-schema`, `remix/router`), `@sdxc/u`, `@sdxc/ui`, and Vite+ (`vp`). However, all public routes (`/`, `/about`, `/courses`, `/materials`, `/gallery`, `/blogs`, `/faq`, `/contact`, `/admissions`), `config/trust.ts`, `config/faqs.ts`, and `resources/layouts/landing.tsx` still embed copy, metrics, FAQs, navigation links, and section ordering directly in TypeScript (see `proposal.md` - Why).

Two architectural invariants constrain the approach:

1. **Institutional Aesthetic & Zero CSS Sprawl**: Every block must preserve PAART Academy's educational-trust identity (`Cormorant Garamond`, `Outfit`, `Noto Sans Tamil`, deep emerald + honour gold) and style components inline with `@sdxc/u` (`mix={[...]}`) and `@sdxc/ui` rather than custom stylesheets.
2. **Server-First Remix 3 Bundle Discipline**: Adding a 15-block registry must not bloat `dist/client/` with unused React-style editor or renderer bundles; `bootstrap/browser.ts` already wires `resolveFrame`, allowing live SSR preview without shipping client block templates.

## Goals / Non-Goals

**Goals:**

- Store 100% of public page composition, copy, metrics, FAQs, SEO metadata, entity-detail layouts, and global header/footer chrome in PostgreSQL (`pages`, `page_revisions`, `site_chrome`).
- Achieve single-query (or sub-millisecond `@sdxc/cache` hit) page manifest resolution with parallel `Promise.all` hydration only for active data-bound blocks.
- Empower Administrators in `/admin/pages` and `/admin/chrome` to edit, reorder, preview (`?preview=draft` + `<LazyFrame>`), publish, and roll back pages with `users.id` attribution and optimistic concurrency.
- Preserve offline/degraded resilience via built-in institutional seed fallback manifests.

**Non-Goals:**

- Arbitrary visual CSS/pixel drag-and-drop canvas or user-authored HTML/CSS/JS injection (Tier-3 AST builders break brand consistency, WCAG contrast, and CSP).
- Turning authenticated LMS workspaces (`/admin/*`, `/faculty/*`, `/portal/*`) into CMS block pages; those remain purpose-built application shells.
- Multi-tenant site hosting (this engine serves PAART Academy's single institutional domain).

## Decisions

### 1. Tier-2 Typed Block Registry over Relational Per-Block Tables or Raw AST JSON

- **Decision**: Model each page as a single `pages` row holding `draft_blocks JSONB` and `published_blocks JSONB` (an ordered array of discriminated-union `PageBlock` objects `{ id, type, enabled, visibilityRule?, data }`), validated per block via `remix/data-schema`.
- **Rationale**: A single indexed lookup by `slug` retrieves the entire page layout without 15-table SQL joins, while `remix/data-schema` discriminated unions lock down typography, spacing, and accessibility inside server `remix/component` blocks (`resources/blocks/*`).
- **Alternatives considered**:
  - _Relational table per block type_: Rejected due to N+1/multi-join overhead on every public hit and rigid migration churn when adding a single block field.
  - _Freeform HTML / WYSIWYG builder_: Rejected because arbitrary markup violates CSP, breaks dark/light academic tokens, and risks XSS.

### 2. Two Page Contracts (`static_page` and `collection_template`) + `site_chrome` Singleton

- **Decision**:
  - `pages` table (`id UUID PK`, `slug TEXT UNIQUE`, `title TEXT`, `kind TEXT` in `'static_page' | 'collection_template'`, `status TEXT` in `'draft' | 'published'`, `is_system BOOLEAN`, `draft_blocks JSONB`, `published_blocks JSONB`, `seo JSONB`, `version INT`, `published_version INT`, `updated_by TEXT REFERENCES users(id)`, `published_by TEXT REFERENCES users(id)`, `published_at TIMESTAMPTZ`, `created_at`, `updated_at`).
  - `page_revisions` table (`id UUID PK`, `page_id UUID REFERENCES pages(id) ON DELETE CASCADE`, `version INT`, `blocks JSONB`, `seo JSONB`, `diff_patch JSONB`, `note TEXT`, `created_by TEXT REFERENCES users(id)`, `created_at TIMESTAMPTZ`).
  - `site_chrome` table (`id TEXT PK` = `'default'`, `utility_bar JSONB`, `header_nav JSONB`, `header_ctas JSONB`, `footer_columns JSONB`, `trust_profile JSONB`, `version INT`, `updated_by TEXT REFERENCES users(id)`, `updated_at TIMESTAMPTZ`).
  - Core routes (`/`, `/about`, `/courses`, `/materials`, `/gallery`, `/blogs`, `/faq`, `/contact`, `/admissions`) map to `is_system = true` `static_page` rows (preventing accidental deletion or slug rename of core routes while allowing full block editing), custom campaign pages map to `is_system = false` `static_page` rows served via a catch-all `/:slug` route registered after explicit routes, and `/courses/:slug` + `/blogs/:slug` render `collection_template` rows (`template:course-detail`, `template:blog-detail`) bound to the fetched entity.
- **Rationale**: Avoids duplicating block layouts across every individual course or blog post while still letting Admins rearrange or customize `/courses/:slug` and `/blogs/:slug` page sections from `/admin/pages`.
- **Alternatives considered**:
  - _Separate `pages` row per course/blog_: Rejected because editing the course page callout banner would require updating every course manually.

### 3. Curated Institutional Block Catalog + Selective Parallel Hydration

- **Decision**: Implement 16 server-rendered institutional blocks in `resources/blocks/`:
  1. `notice_bar` (admissions/exam alert strip)
  2. `academic_hero` (masthead hero, exam stream badges, CTAs, campus photo card)
  3. `page_banner` (sub-page rubric, title, description, breadcrumbs)
  4. `honour_roll_stats` (impact KPI grid + optional state-rank plaques)
  5. `department_table` (verified selection counts by exam board/department)
  6. `pillars_grid` (2/3/4-column institutional cards for pillars, initiatives, vision/mission/values)
  7. `rich_prose` (GFM Markdown rendered via `@sdxc/markdown` AST -> safe `@sdxc/u` typography, zero `innerHTML`)
  8. `course_catalog` (live `courses` query with optional category filter, featured limit, and category filter tabs)
  9. `materials_catalog` (live `materials` query strictly filtered to `visibility = 'public'` + category filter tabs)
  10. `gallery_showcase` (live `gallery_items` query + category filter tabs)
  11. `blog_feed` (live `blogs` query with limit)
  12. `faq_accordion` (categorized `@sdxc/ui` `Accordion` items; automatically contributes `FAQPage` JSON-LD to `<Document>`)
  13. `contact_hub` (campus addresses, hours, map card, and `@sdxc/honeypot`-protected enquiry form)
  14. `admission_form` (live active-course selector, photo/document upload fields, and `@sdxc/honeypot` fields posting to `POST /admissions`)
  15. `callout_band` (institutional bottom CTA band with campus phone/WhatsApp actions)
  16. `entity_detail_main` (renders bound `CourseItem` syllabus/eligibility/highlights or `BlogItem` article body inside `collection_template` pages)
- **Hydration Pipeline**: `hydratePageBlocks(blocks, requestContext)` inspects only the enabled, visibility-matched blocks on a page and runs `Promise.all` exclusively for the data sources actually referenced (e.g., `/faq` runs zero `courses` or `gallery` queries).

### 4. Leveraging `@sdxc/*` Primitives for Publishing, Caching, and Preview

- **Decision**:
  - **`@sdxc/bracket-params`**: Parse native SSR `<form>` submissions (`blocks[0][data][title]`, `items[1][label]`) in `/admin/pages/:id` and `/admin/chrome` directly into structured objects validated by `remix/data-schema` — zero heavy client form framework.
  - **`@sdxc/json-patch`**: Execute atomic block reordering (`move`), insertion (`add`), deletion (`remove`), and version `test` checks against `draft_blocks`, and compute compact `diff(prevBlocks, nextBlocks)` stored on `page_revisions.diff_patch`.
  - **`@sdxc/expression`**: Evaluate optional JSON/expression visibility rules (`role == "aspirant"`, `now >= startAt && now <= endAt`) safely without `eval`.
  - **`@sdxc/cache`**: Cache resolved published page manifests and `site_chrome` in a server `MemoryCache` (keyed by `page:<slug>` and `chrome:default`, short TTL + explicit `delete()` on publish, rollback, or chrome save). Note: dynamic request-specific tokens like `@sdxc/honeypot` fields and `ctx.user` workspace links are always injected _after_ manifest cache lookup so cached manifests never leak session state or stale honeypot tokens!
  - **`@sdxc/lazy-frame`** + Remix `<Frame>`: Render `/about?preview=draft` inside `/admin/pages/:id` preview pane/dialog; when `?preview=draft` is requested by an `admin` (`@sdxc/authz` `cms.manage`), bypass `@sdxc/cache`, set `robots="noindex, nofollow"` and `Cache-Control: private, no-store`, and display a sticky Admin preview bar.
  - **`@sdxc/strings`**: Normalize custom campaign slugs (`slugify`) and enforce a reserved-prefix denylist (`/admin`, `/faculty`, `/portal`, `/login`, `/logout`, `/account`, `/courses`, `/blogs`, `/enquiries`, `/admissions/success`, `/healthz`, `/readyz`, `/sitemap.xml`, `/llms.txt`).

## Risks / Trade-offs

- **[Cached manifest accidentally serving user-specific HTML or stale anti-spam tokens]** → Cache only the pure database manifest (`PageRecord` + `SiteChromeRecord`) in `@sdxc/cache`, never the rendered HTML or `honeypot` tokens; run `@sdxc/expression` role checks, `ctx.user` header links, and `issueHoneypotFields()` fresh per request.
- **[Corrupt JSONB block row or schema drift breaking `/`]** → Validate blocks individually with `s.parseSafe` inside `<BlockRenderer />` so an invalid block logs via `currentLog()?.warn(...)` and skips cleanly; if the entire DB query fails, fall back to `config/default-pages.ts` seed manifests.
- **[Catch-all `/:slug` route shadowing static assets or system routes]** → Register explicit routes (`/`, `/about`, `/courses/*`, `/blogs/*`, `/admissions/*`, `/login`, `/admin/*`, `/faculty/*`, `/portal/*`, `/healthz`, `/readyz`, `/sitemap.xml`, `/llms.txt`) ahead of `/:slug` in `routes/web.ts` and enforce the reserved-slug validator on `POST /admin/pages`.
- **[Concurrent Admins overwriting each other's draft edits]** → Include hidden `version` input on all composer forms; verify `pages.version === submittedVersion` (or `@sdxc/json-patch` `test` op) inside a transaction and return HTTP `409 Conflict` if stale.

## Migration Plan

1. Install the 7 `@sdxc/*` packages (`bracket-params`, `json-patch`, `markdown`, `cache`, `expression`, `lazy-frame`, `strings`) and add `ssr.noExternal` entries in `vite.config.ts` if required by Vite SSR bundling.
2. Create `database/migrations/0003_server_driven_pages/up.sql` and `down.sql` (`pages`, `page_revisions`, `site_chrome` with indexes on `pages(slug)` and `page_revisions(page_id, version DESC)`).
3. Author `config/default-pages.ts` capturing 100% of current PAART Academy institutional content (`/` 8 sections, `/about`, `/courses`, `/materials`, `/gallery`, `/blogs`, `/faq`, `/contact`, `/admissions`, `template:course-detail`, `template:blog-detail`, and `site_chrome`), used both by `database/seed.ts` (idempotent upsert that preserves existing published edits unless missing) and as the zero-downtime offline fallback.
4. Rollback strategy: `database/migrations/0003_server_driven_pages/down.sql` cleanly drops `page_revisions`, `pages`, and `site_chrome`.
