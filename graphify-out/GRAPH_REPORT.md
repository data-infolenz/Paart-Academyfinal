# Graph Report - Paart-Academyfinal  (2026-11-11)

## Corpus Check
- 85 files · ~29,563 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 525 nodes · 1460 edges · 17 communities
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.59)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b9df6a90`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Public Controllers & Academic Views
- Admin CMS Controller & Actions
- Admissions & Course Flows
- Router & HTTP Middleware
- Database Schema & Domain Entities
- TypeScript Path Aliases & Config
- Remix 3 & @sdxc Dependencies
- Admissions & Enquiries Models
- Blog Models & Sitemap
- Package Scripts & Vite+ Tooling
- Admin Session Authentication
- Architecture & OpenSpec Constraints
- Browser Hydration & Frame Prefetch
- PostgreSQL Initial Migration
- Node Module Path Resolver

## God Nodes (most connected - your core abstractions)
1. `AdminUser` - 46 edges
2. `Routes` - 35 edges
3. `SiteSettings` - 33 edges
4. `acadSerif()` - 33 edges
5. `acadCard()` - 27 edges
6. `getSiteSettings()` - 26 edges
7. `requireAdmin()` - 24 edges
8. `LandingLayout()` - 21 edges
9. `CourseItem` - 19 edges
10. `HomePage()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Academic Institution UI Design Constraint` --semantically_similar_to--> `WCAG AA Semantic UI (@sdxc/ui + @sdxc/u)`  [INFERRED] [semantically similar]
  openspec/config.yaml → README.md
- `OpenSpec Verification & Graphify Maintenance Gate` --semantically_similar_to--> `Vite+ (vp) Build & Verification Toolchain`  [INFERRED] [semantically similar]
  openspec/config.yaml → README.md
- `courseCreate()` --references--> `COURSE_CATEGORIES`  [EXTRACTED]
  app/http/controllers/admin/controller.tsx → config/courses.ts
- `AdminLayoutProps` --references--> `AdminUser`  [EXTRACTED]
  resources/layouts/admin.tsx → app/initializers/auth.ts
- `AdminAdmissionsPageProps` --references--> `AdminUser`  [EXTRACTED]
  resources/views/admin/admissions-page.tsx → app/initializers/auth.ts

## Import Cycles
- 3-file cycle: `app/http/controllers/public/controller.tsx -> app/http/controllers/public/llms.ts -> app/initializers/router.ts -> app/http/controllers/public/controller.tsx`
- 3-file cycle: `app/http/controllers/public/controller.tsx -> app/http/controllers/public/sitemap.ts -> app/initializers/router.ts -> app/http/controllers/public/controller.tsx`

## Hyperedges (group relationships)
- **PAART Academy Remix 3 SSR Platform Architecture** — readme_paartacademy, readme_remix3ssr, readme_middlewarepipeline, readme_postgresdatalayer, readme_seolegacyredirects [EXTRACTED 1.00]
- **PAART Academy Institutional UI & Styling Governance** — readme_wcagsemanticui, openspec_config_academicdesignconstraint, openspec_config_tsxutilitystyling [INFERRED 0.95]
- **Vite+ Build Verification & Graphify Sync Workflow** — openspec_config_specdrivenschema, openspec_config_validationgate, readme_viteplustoolchain [INFERRED 0.95]

## Communities (17 total, 0 thin omitted)

### Community 0 - "Public Controllers & Academic Views"
Cohesion: 0.10
Nodes (57): SessionPayload, DEFAULT_SETTINGS, DEPARTMENT_SELECTIONS, IMPACT_METRICS, ImpactMetric, STATE_RANK_HIGHLIGHTS, TRUST_INITIATIVES, TRUST_PILLARS (+49 more)

### Community 1 - "Admin CMS Controller & Actions"
Cohesion: 0.07
Nodes (54): admissions(), admissionStatus(), blogCreate(), blogDelete(), blogs(), blogToggle(), courseCreate(), courseDelete() (+46 more)

### Community 2 - "Admissions & Course Flows"
Cohesion: 0.07
Nodes (48): apply(), submit(), success(), show(), index(), show(), about(), contact() (+40 more)

### Community 3 - "Router & HTTP Middleware"
Cohesion: 0.06
Nodes (39): LEGACY_WP_PAGE_MAP, legacyRedirectsMiddleware(), rateLimitMiddleware(), DEFAULT_CSP_DIRECTIVES, securityHeadersMiddleware(), closeDatabase(), databaseContext, databaseMiddleware() (+31 more)

### Community 4 - "Database Schema & Domain Entities"
Cohesion: 0.08
Nodes (40): AdminUser, BlogItem, EnquiryItem, GalleryItem, MaterialItem, SiteSettings, AcademicCalloutBandProps, ThemeToggle (+32 more)

### Community 5 - "TypeScript Path Aliases & Config"
Cohesion: 0.06
Nodes (37): ./app/*, bootstrap/**/*, ./config/*, ./database/*, dist, DOM, DOM.Iterable, ES2024 (+29 more)

### Community 6 - "Remix 3 & @sdxc Dependencies"
Cohesion: 0.05
Nodes (37): dependencies, pg, @pitlane/assets, @pitlane/vite-plugin-remix, remix, @sdxc/assets-middleware, @sdxc/catch-response-middleware, @sdxc/health (+29 more)

### Community 7 - "Admissions & Enquiries Models"
Cohesion: 0.12
Nodes (23): AdmissionItem, mapAdmissionRow(), mapEnquiryRow(), AdmissionRow, admissions, AdmissionStatus, NewAdmissionRow, NewBlogRow (+15 more)

### Community 8 - "Blog Models & Sitemap"
Cohesion: 0.13
Nodes (26): index(), sitemapAction(), AppContext, findBlogBySlug(), listAllBlogs(), listPublishedBlogs(), mapBlogRow(), mapSeedBlog() (+18 more)

### Community 9 - "Package Scripts & Vite+ Tooling"
Cohesion: 0.06
Nodes (30): devDependencies, @types/node, @types/pg, typescript, vite, vite-plus, engines, node (+22 more)

### Community 10 - "Admin Session Authentication"
Cohesion: 0.19
Nodes (13): login(), logout(), signIn(), authMiddleware(), sessionUserContext, signInSchema, clearSessionCookieHeader(), createSessionCookieHeader() (+5 more)

### Community 11 - "Architecture & OpenSpec Constraints"
Cohesion: 0.26
Nodes (12): Academic Institution UI Design Constraint, OpenSpec Spec-Driven Project Configuration, Component-Scoped @sdxc/u & Theme Token Boundary, OpenSpec Verification & Graphify Maintenance Gate, Jchat/apps/store Remix 3 Architectural Conventions, Composable Router Middleware Pipeline, PAART Academy Web Application, PostgreSQL Data Layer & Seed Data Fallback (+4 more)

### Community 12 - "Browser Hydration & Frame Prefetch"
Cohesion: 0.31
Nodes (6): app, FrameOptions, PREFETCHED, prefetchKey(), takePrefetched(), PACKAGE_MODULES

### Community 13 - "PostgreSQL Initial Migration"
Cohesion: 0.25
Nodes (7): "admissions", "blogs", "courses", "enquiries", "gallery_items", "materials", "site_settings"

### Community 14 - "Node Module Path Resolver"
Cohesion: 0.67
Nodes (3): resolve(), resolveCandidate(), rootDir

## Knowledge Gaps
- **118 isolated node(s):** `sessionUserContext`, `LEGACY_WP_PAGE_MAP`, `DEFAULT_CSP_DIRECTIVES`, `phoneSchema`, `SessionPayload` (+113 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminUser` connect `Database Schema & Domain Entities` to `Public Controllers & Academic Views`, `Blog Models & Sitemap`, `Admin Session Authentication`, `Admissions & Enquiries Models`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `Routes` connect `Public Controllers & Academic Views` to `Admin CMS Controller & Actions`, `Admissions & Course Flows`, `Router & HTTP Middleware`, `Database Schema & Domain Entities`, `Admissions & Enquiries Models`, `Blog Models & Sitemap`, `Admin Session Authentication`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `getSiteSettings()` connect `Admissions & Course Flows` to `Public Controllers & Academic Views`, `Admin CMS Controller & Actions`, `Admin Session Authentication`, `Blog Models & Sitemap`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `sessionUserContext`, `LEGACY_WP_PAGE_MAP`, `DEFAULT_CSP_DIRECTIVES` to the rest of the system?**
  _118 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Public Controllers & Academic Views` be split into smaller, more focused modules?**
  _Cohesion score 0.10327022375215146 - nodes in this community are weakly interconnected._
- **Should `Admin CMS Controller & Actions` be split into smaller, more focused modules?**
  _Cohesion score 0.07138535995160314 - nodes in this community are weakly interconnected._
- **Should `Admissions & Course Flows` be split into smaller, more focused modules?**
  _Cohesion score 0.06829573934837092 - nodes in this community are weakly interconnected._