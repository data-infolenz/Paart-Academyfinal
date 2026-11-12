# Graph Report - Paart-Academyfinal  (2026-11-12)

## Corpus Check
- 160 files · ~98,798 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1393 nodes · 3333 edges · 92 communities (67 shown, 25 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.59)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8b677389`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.tsx
- routes/index.ts
- cms-responder.tsx
- config/courses.ts
- app.ts
- TypeScript Path Aliases & Config
- ADDED Requirements
- schema/users.ts
- cms-schemas.ts
- devDependencies
- initializers/auth.ts
- Architecture & OpenSpec Constraints
- Browser Hydration & Frame Prefetch
- PostgreSQL Initial Migration
- Node Module Path Resolver
- models/cms.ts
- Requirements
- ADDED Requirements
- admin/controller.tsx
- Requirement: Unified Credential Sign-In and Role Workspace Routing
- ADDED Requirements
- models/lms.ts
- 0002_multi_role_lms/up.sql
- Requirements
- 0002_multi_role_lms/down.sql
- @pitlane/vite-plugin-remix
- remix
- @sdxc/assets-middleware
- schema/cms.ts
- scripts
- portal.tsx
- @sdxc/csv
- @sdxc/email-address
- @sdxc/health
- @sdxc/honeypot
- Design
- @sdxc/lazy-route
- @sdxc/logger
- @sdxc/mail
- @sdxc/password-policy
- package.json
- @sdxc/response
- @sdxc/result
- dependencies
- Proposal
- Tasks
- @sdxc/ui
- @sdxc/uuid
- mail.tsx
- SessionUser
- Requirement: Unified Credential Sign-In and Role Workspace Routing
- models/materials.ts
- middleware/auth.ts
- schema/index.ts
- listManagedUsers
- database.ts
- PaartDb
- models/admissions.ts
- models/enquiries.ts
- portal/controller.tsx
- vercel.json
- router.ts
- models/blogs.ts
- ADDED Requirements
- authMiddleware
- SmtpTransport
- ADDED Requirements
- ADDED Requirements
- Requirements
- Requirements
- Requirements
- pg
- @sdxc/lazy-frame
- cms-actions.tsx
- Design
- cms-hydrator.ts
- Proposal
- Decisions
- Tasks
- page-editor-page.tsx
- pages-index-page.tsx
- Tasks
- Proposal
- @sdxc/strings
- 0003_server_driven_pages/up.sql
- @sdxc/bracket-params
- @sdxc/expression
- @sdxc/json-patch
- @sdxc/security-headers

## God Nodes (most connected - your core abstractions)
1. `Routes` - 51 edges
2. `PaartDb` - 45 edges
3. `SessionUser` - 40 edges
4. `AdminUser` - 37 edges
5. `requireAdmin()` - 35 edges
6. `acadSerif()` - 32 edges
7. `db` - 25 edges
8. `CourseItem` - 23 edges
9. `acadCard()` - 23 edges
10. `hashUserPassword()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `Academic Institution UI Design Constraint` --semantically_similar_to--> `WCAG AA Semantic UI (@sdxc/ui + @sdxc/u)`  [INFERRED] [semantically similar]
  openspec/config.yaml → README.md
- `OpenSpec Verification & Graphify Maintenance Gate` --semantically_similar_to--> `Vite+ (vp) Build & Verification Toolchain`  [INFERRED] [semantically similar]
  openspec/config.yaml → README.md
- `PortalLayoutProps` --references--> `SessionUser`  [EXTRACTED]
  resources/layouts/portal.tsx → app/initializers/auth.ts
- `SessionUser` --references--> `UserRole`  [EXTRACTED]
  app/initializers/auth.ts → database/schema/users.ts
- `SessionUser` --references--> `UserStatus`  [EXTRACTED]
  app/initializers/auth.ts → database/schema/users.ts

## Import Cycles
- 3-file cycle: `app/http/controllers/public/cms-responder.tsx -> app/initializers/router.ts -> app/http/controllers/public/controller.tsx -> app/http/controllers/public/cms-responder.tsx`
- 3-file cycle: `app/http/controllers/public/controller.tsx -> app/http/controllers/public/llms.ts -> app/initializers/router.ts -> app/http/controllers/public/controller.tsx`
- 3-file cycle: `app/http/controllers/public/controller.tsx -> app/http/controllers/public/sitemap.ts -> app/initializers/router.ts -> app/http/controllers/public/controller.tsx`

## Hyperedges (group relationships)
- **PAART Academy Remix 3 SSR Platform Architecture** — readme_paartacademy, readme_remix3ssr, readme_middlewarepipeline, readme_postgresdatalayer, readme_seolegacyredirects [EXTRACTED 1.00]
- **PAART Academy Institutional UI & Styling Governance** — readme_wcagsemanticui, openspec_config_academicdesignconstraint, openspec_config_tsxutilitystyling [INFERRED 0.95]
- **Vite+ Build Verification & Graphify Sync Workflow** — openspec_config_specdrivenschema, openspec_config_validationgate, readme_viteplustoolchain [INFERRED 0.95]

## Communities (92 total, 25 thin omitted)

### Community 0 - "index.tsx"
Cohesion: 0.06
Nodes (84): evaluateBlockVisibility(), renderSafeMarkdown(), aspirantUser, SiteChromeConfig, DEFAULT_SETTINGS, mapSettingsRow(), SiteSettings, DEFAULT_SITE_CHROME (+76 more)

### Community 1 - "routes/index.ts"
Cohesion: 0.11
Nodes (27): AdminUser, AdmissionItem, EnquiryItem, ADMIN_SHELL_LABELS, AdminLayout(), AdminLayoutProps, NAV_GROUPS, AdminAdmissionsPage() (+19 more)

### Community 2 - "cms-responder.tsx"
Cohesion: 0.07
Nodes (57): apply(), submit(), success(), index(), show(), show(), index(), show() (+49 more)

### Community 3 - "config/courses.ts"
Cohesion: 0.14
Nodes (16): gallery(), listGalleryItems(), mapGalleryRow(), mapSeedGallery(), CourseCategory, CourseDetailSpec, SEED_GALLERY, SEED_MATERIALS (+8 more)

### Community 4 - "app.ts"
Cohesion: 0.09
Nodes (23): rateLimitMiddleware(), closeDatabase(), getDatabase(), transaction(), paartLogger, clientDir, rootDir, RouterLike (+15 more)

### Community 5 - "TypeScript Path Aliases & Config"
Cohesion: 0.06
Nodes (37): ./app/*, bootstrap/**/*, ./config/*, ./database/*, dist, DOM, DOM.Iterable, ES2024 (+29 more)

### Community 6 - "ADDED Requirements"
Cohesion: 0.09
Nodes (22): ADDED Requirements, Block Page Rendering Specification, Purpose, Requirement: Database-Backed Site Chrome Rendering, Requirement: Database-Driven Public Page and Campaign Slug Resolution, Requirement: Entity Detail Template Rendering, Requirement: Live Collection Hydration and Interactive Form Blocks, Requirement: Per-Block Schema Validation and Fault Isolation (+14 more)

### Community 7 - "schema/users.ts"
Cohesion: 0.15
Nodes (17): NewBlogRow, NewEnquiryRow, NewGalleryRow, col, InferInsert, InferSelect, MATERIAL_VISIBILITIES, MaterialRow (+9 more)

### Community 8 - "cms-schemas.ts"
Cohesion: 0.06
Nodes (38): academicHeroBlockSchema, admissionFormBlockSchema, baseEnvelope, BLOCK_TYPES, BlockValidationSummary, blogFeedBlockSchema, boolField(), calloutBandBlockSchema (+30 more)

### Community 9 - "devDependencies"
Cohesion: 0.15
Nodes (13): nitro, devDependencies, nitro, @types/node, @types/pg, typescript, vite, vite-plus (+5 more)

### Community 10 - "initializers/auth.ts"
Cohesion: 0.15
Nodes (26): changePassword(), changePasswordPage(), formatPasswordPolicyIssue(), getClientMeta(), legacyLogout(), login(), loginPage(), logout() (+18 more)

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

### Community 17 - "models/cms.ts"
Cohesion: 0.21
Nodes (21): cmsPageKey(), getCmsCache(), purgeChromeCache(), purgePageCache(), deleteCampaignPage(), findPageById(), hasDraftDiff(), listAllPagesForAdmin() (+13 more)

### Community 18 - "Requirements"
Cohesion: 0.09
Nodes (22): Block Page Rendering Specification, Purpose, Requirement: Database-Backed Site Chrome Rendering, Requirement: Database-Driven Public Page and Campaign Slug Resolution, Requirement: Entity Detail Template Rendering, Requirement: Live Collection Hydration and Interactive Form Blocks, Requirement: Per-Block Schema Validation and Fault Isolation, Requirement: Safe Rich Text and Conditional Block Visibility (+14 more)

### Community 19 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Purpose, Requirement: Edge CDN Static Asset Delivery, Requirement: Nitro-Driven Vercel Build Output Generation, Requirement: Serverless Environment Variable and Secret Integration, Requirement: Serverless PostgreSQL Pool Configuration, Scenario: Connection pool limit respected in serverless runtime, Scenario: Local production build preserves standard output (+5 more)

### Community 20 - "admin/controller.tsx"
Cohesion: 0.08
Nodes (48): admissionProvision(), admissions(), batchCreate(), batchToggle(), blogCreate(), blogToggle(), courseCreate(), courseDelete() (+40 more)

### Community 21 - "Requirement: Unified Credential Sign-In and Role Workspace Routing"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Multi-Role Authentication Specification, Purpose, Requirement: Mandatory First-Login Password Change, Requirement: Revocable Server-Managed Sessions and Sign-Out, Requirement: Role-Based Workspace and Action Isolation, Requirement: Unified Credential Sign-In and Role Workspace Routing, Scenario: Administrator signs in and reaches admin console (+12 more)

### Community 22 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Page Publishing Specification, Purpose, Requirement: Administrator-Only Page and Chrome Studio Access, Requirement: Atomic Publication, Authorship Audit, and Cache Invalidation, Requirement: Campaign Page Creation and Reserved Route Guard, Requirement: Draft Block Composition, Reordering, and Optimistic Concurrency, Requirement: Live Draft Preview with Search Indexing Protection (+12 more)

### Community 23 - "models/lms.ts"
Cohesion: 0.05
Nodes (82): batches(), batchSyllabus(), batchSyllabusCreate(), batchSyllabusStatus(), examCreate(), examMarks(), examMarksImport(), examMarksSave() (+74 more)

### Community 24 - "0002_multi_role_lms/up.sql"
Cohesion: 0.42
Nodes (10): "admissions", "batches", "enrollments", "exam_results", "exams", "materials", "notifications", "sessions" (+2 more)

### Community 25 - "Requirements"
Cohesion: 0.10
Nodes (20): Page Publishing Specification, Purpose, Requirement: Administrator-Only Page and Chrome Studio Access, Requirement: Atomic Publication, Authorship Audit, and Cache Invalidation, Requirement: Campaign Page Creation and Reserved Route Guard, Requirement: Draft Block Composition, Reordering, and Optimistic Concurrency, Requirement: Live Draft Preview with Search Indexing Protection, Requirement: Revision History and One-Click Rollback (+12 more)

### Community 30 - "schema/cms.ts"
Cohesion: 0.17
Nodes (10): NewPageRevisionRow, NewPageRow, NewSiteChromeRow, PAGE_KINDS, PAGE_STATUSES, PageRevisionRow, pageRevisions, PageRow (+2 more)

### Community 31 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, check, db:migrate, db:seed, dev, format, lint (+3 more)

### Community 32 - "portal.tsx"
Cohesion: 0.20
Nodes (8): ThemeToggle, ThemeToggleProps, PORTAL_NAV_ITEMS, PORTAL_SHELL_LABELS, PortalLayoutProps, EXAM_TYPE_LABELS, PortalExamsPage(), PortalExamsPageProps

### Community 37 - "Design"
Cohesion: 0.20
Nodes (9): 1. Integrate `nitro/vite` with Conditional Output, 2. Database Pooling Tolerances for Serverless Functions, 3. Edge Static Routing Configuration, Context, Decisions, Design, Goals / Non-Goals, Migration Plan (+1 more)

### Community 42 - "package.json"
Cohesion: 0.20
Nodes (9): engines, node, name, overrides, vite, vitest, private, type (+1 more)

### Community 45 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @pitlane/assets, @sdxc/authz, @sdxc/cache, @sdxc/catch-response-middleware, @sdxc/crypto, @sdxc/icons, @sdxc/markdown (+15 more)

### Community 46 - "Proposal"
Cohesion: 0.25
Nodes (7): Capabilities, Impact, Modified Capabilities, New Capabilities, Proposal, What Changes, Why

### Community 47 - "Tasks"
Cohesion: 0.29
Nodes (6): 1. Dependencies & Environment Configuration, 2. Nitro & Pitlane Vite Integration, 3. Serverless Database Resilience, 4. Verification & Build Validation, Tasks, Workflow follow-up

### Community 50 - "mail.tsx"
Cohesion: 0.08
Nodes (22): connectSocket(), createPaartMailer(), CredentialEmailProps, credentialEmailSchema, dotStuffMime(), formatRoleLabel(), getMailer(), LocalDevFallbackTransport (+14 more)

### Community 51 - "SessionUser"
Cohesion: 0.18
Nodes (18): SessionUser, VisibilityEvalContext, BatchSummaryItem, ExamItem, NotificationItem, FACULTY_NAV_ITEMS, FACULTY_SHELL_LABELS, FacultyLayout() (+10 more)

### Community 52 - "Requirement: Unified Credential Sign-In and Role Workspace Routing"
Cohesion: 0.10
Nodes (20): Multi-Role Authentication Specification, Purpose, Requirement: Mandatory First-Login Password Change, Requirement: Revocable Server-Managed Sessions and Sign-Out, Requirement: Role-Based Workspace and Action Isolation, Requirement: Unified Credential Sign-In and Role Workspace Routing, Requirements, Scenario: Administrator signs in and reaches admin console (+12 more)

### Community 53 - "models/materials.ts"
Cohesion: 0.46
Nodes (7): materials(), createMaterial(), listAllMaterials(), listMaterialsForAspirant(), listPublishedMaterials(), mapMaterialRow(), mapSeedMaterial()

### Community 54 - "middleware/auth.ts"
Cohesion: 0.17
Nodes (22): authSessionContext, enforcePasswordChange(), forbiddenResponse(), isPasswordChangeExempt(), loadSessionUser(), PASSWORD_CHANGE_EXEMPT_PATHS, redirectToLogin(), requestSessionMap (+14 more)

### Community 55 - "schema/index.ts"
Cohesion: 0.11
Nodes (29): createAdminSession(), createdPageIds, createdUserIds, seedAdminSession(), createdPageIds, createdUserIds, createdBatchIds, createdMaterialIds (+21 more)

### Community 56 - "listManagedUsers"
Cohesion: 0.33
Nodes (7): users(), userStatus(), listManagedUsers(), mapUserRow(), toIsoOrNull(), updateUserAccountStatus(), USER_STATUSES

### Community 57 - "database.ts"
Cohesion: 0.12
Nodes (13): createdAdmissionIds, createdBatchIds, createdUserIds, memoryOutbox, createdBatchIds, createdUserIds, outbox, databaseContext (+5 more)

### Community 58 - "PaartDb"
Cohesion: 0.26
Nodes (14): generateTemporaryPassword(), normalizeUserEmail(), PaartDb, generateRollNumber(), listActiveFacultyUsers(), ManagedUserItem, provisionAdmissionApplicant(), provisionUserAccount() (+6 more)

### Community 59 - "models/admissions.ts"
Cohesion: 0.27
Nodes (8): admissionStatus(), mapAdmissionRow(), updateAdmissionStatus(), ADMISSION_STATUSES, AdmissionRow, admissions, AdmissionStatus, NewAdmissionRow

### Community 60 - "models/enquiries.ts"
Cohesion: 0.20
Nodes (9): enquiries(), enquiryStatus(), listEnquiries(), mapEnquiryRow(), updateEnquiryStatus(), enquiries, ENQUIRY_STATUSES, EnquiryRow (+1 more)

### Community 61 - "portal/controller.tsx"
Cohesion: 0.15
Nodes (20): exams(), index(), marks(), materials(), notifications(), progress(), requireAspirant(), AspirantPortalSnapshot (+12 more)

### Community 62 - "vercel.json"
Cohesion: 0.40
Nodes (4): cleanUrls, headers, $schema, trailingSlash

### Community 63 - "router.ts"
Cohesion: 0.13
Nodes (10): createdUserIds, seedRoleUser(), LEGACY_WP_PAGE_MAP, legacyRedirectsMiddleware(), DEFAULT_CSP_DIRECTIVES, securityHeadersMiddleware(), databaseMiddleware(), remix/router (+2 more)

### Community 64 - "models/blogs.ts"
Cohesion: 0.27
Nodes (11): blogDelete(), blogs(), deleteBlog(), findBlogBySlug(), listAllBlogs(), listPublishedBlogs(), mapBlogRow(), mapSeedBlog() (+3 more)

### Community 65 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): Account Provisioning Specification, ADDED Requirements, Purpose, Requirement: Account Suspension and Reactivation, Requirement: Closed Administrator-Only Account Creation, Requirement: One-Click Aspirant Provisioning from Admissions, Requirement: SMTP Welcome Email and Credential Re-Issuance, Scenario: Administrator prevented from self-suspension (+8 more)

### Community 68 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Aspirant Portal Specification, Purpose, Requirement: Aspirant Progress and Performance Overview, Requirement: Enrolled and Public Study Materials Access, Requirement: Published Test Marks and Scorecard History, Requirement: Targeted Notifications Feed, Requirement: Upcoming Exam Schedule View (+8 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Faculty Workspace Specification, Purpose, Requirement: Aspirant Exam Marks Entry, CSV Import, and Result Publication, Requirement: Batch Syllabus Progress Tracking, Requirement: Mock and OMR Exam Scheduling, Requirement: Targeted Academic Notifications, Requirement: Visibility-Scoped Study Material Publishing (+8 more)

### Community 70 - "Requirements"
Cohesion: 0.12
Nodes (16): Account Provisioning Specification, Purpose, Requirement: Account Suspension and Reactivation, Requirement: Closed Administrator-Only Account Creation, Requirement: One-Click Aspirant Provisioning from Admissions, Requirement: SMTP Welcome Email and Credential Re-Issuance, Requirements, Scenario: Administrator prevented from self-suspension (+8 more)

### Community 71 - "Requirements"
Cohesion: 0.12
Nodes (16): Aspirant Portal Specification, Purpose, Requirement: Aspirant Progress and Performance Overview, Requirement: Enrolled and Public Study Materials Access, Requirement: Published Test Marks and Scorecard History, Requirement: Targeted Notifications Feed, Requirement: Upcoming Exam Schedule View, Requirements (+8 more)

### Community 72 - "Requirements"
Cohesion: 0.12
Nodes (16): Faculty Workspace Specification, Purpose, Requirement: Aspirant Exam Marks Entry, CSV Import, and Result Publication, Requirement: Batch Syllabus Progress Tracking, Requirement: Mock and OMR Exam Scheduling, Requirement: Targeted Academic Notifications, Requirement: Visibility-Scoped Study Material Publishing, Requirements (+8 more)

### Community 75 - "cms-actions.tsx"
Cohesion: 0.15
Nodes (16): cmsAdminActions, computePreviewHref(), IdRouteContext, pageDraftBracketSchema, readFormInt(), readFormString(), renderEditorState(), resolveSampleEntitySlugs() (+8 more)

### Community 76 - "Design"
Cohesion: 0.18
Nodes (10): 1. Tier-2 Typed Block Registry over Relational Per-Block Tables or Raw AST JSON, 2. Two Page Contracts (`static_page` and `collection_template`) + `site_chrome` Singleton, 3. Curated Institutional Block Catalog + Selective Parallel Hydration, 4. Leveraging `@sdxc/*` Primitives for Publishing, Caching, and Preview, Context, Decisions, Design, Goals / Non-Goals (+2 more)

### Community 77 - "cms-hydrator.ts"
Cohesion: 0.20
Nodes (17): BlogItem, HydrateBlocksOptions, HydratedCollections, HydratedPageResult, HydratorLoaders, CourseItem, GalleryItem, MaterialItem (+9 more)

### Community 78 - "Proposal"
Cohesion: 0.25
Nodes (7): Capabilities, Impact, Modified Capabilities, New Capabilities, Proposal, What Changes, Why

### Community 79 - "Decisions"
Cohesion: 0.17
Nodes (11): 1. Server-Managed Hashed Sessions + `@sdxc/crypto` `scrypt` Passwords, 2. Authorization Architecture with `@sdxc/authz` + Mandatory Password-Change Gate, 3. SMTP Email Delivery via `@sdxc/mail` + Zero-Dependency Node `node:net` / `node:tls` Transport, 4. Relational LMS Data Model (`0002_multi_role_lms`), 5. Pure SSR UI Architecture (`@sdxc/u` + `@sdxc/ui`), Context, Decisions, Design: Multi-Role Identity, SMTP Provisioning & LMS Portals (+3 more)

### Community 80 - "Tasks"
Cohesion: 0.25
Nodes (7): 1. Dependencies, Database Schema & Seed Manifests, 2. CMS Data Layer, Caching, Markdown & Visibility Engine (`cms/block-page-rendering`), 3. Institutional Block Catalog & Public SSR Routing (`cms/block-page-rendering`), 4. Admin Page Builder & Site Chrome Studio (`cms/page-publishing`), 5. End-to-End Publishing Verification & Knowledge Graph Sync, Tasks, Workflow follow-up

### Community 81 - "page-editor-page.tsx"
Cohesion: 0.22
Nodes (11): AdminPageDetail, PageRevisionSummary, BLOCK_TYPE_LABELS, BlockType, PageBlock, DefaultPageSeed, AdminPageEditorPage(), AdminPageEditorPageProps (+3 more)

### Community 82 - "pages-index-page.tsx"
Cohesion: 0.31
Nodes (9): AdminPageSummary, ResolvedCmsPage, PageSeo, PageKind, PageStatus, AdminPagesIndexPage(), AdminPagesIndexPageProps, buildPreviewHref() (+1 more)

### Community 83 - "Tasks"
Cohesion: 0.22
Nodes (8): 1. Dependencies, Configuration & Database Schema, 2. Multi-Role Authentication, Sessions & RBAC (`identity/multi-role-auth`), 3. Admin Account Provisioning & SMTP Delivery (`identity/account-provisioning`), 4. Faculty Workspace (`lms/faculty-workspace`), 5. Aspirant Portal (`lms/aspirant-portal`), 6. End-to-End Integration Verification & Knowledge Graph Sync, Tasks, Workflow follow-up

### Community 84 - "Proposal"
Cohesion: 0.25
Nodes (7): Capabilities, Impact, Modified Capabilities, New Capabilities, Proposal, What Changes, Why

### Community 87 - "0003_server_driven_pages/up.sql"
Cohesion: 0.67
Nodes (3): "page_revisions", "pages", "site_chrome"

## Knowledge Gaps
- **439 isolated node(s):** `IdRouteContext`, `RevisionRouteContext`, `pageDraftBracketSchema`, `siteChromeBracketSchema`, `createdUserIds` (+434 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Routes` connect `routes/index.ts` to `index.tsx`, `portal.tsx`, `cms-responder.tsx`, `initializers/auth.ts`, `cms-actions.tsx`, `cms-hydrator.ts`, `page-editor-page.tsx`, `pages-index-page.tsx`, `SessionUser`, `admin/controller.tsx`, `models/lms.ts`, `portal/controller.tsx`, `router.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `PaartDb` connect `PaartDb` to `app.ts`, `initializers/auth.ts`, `models/cms.ts`, `models/lms.ts`, `admin/controller.tsx`, `middleware/auth.ts`, `schema/index.ts`, `models/materials.ts`, `database.ts`, `listManagedUsers`, `portal/controller.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `IdRouteContext`, `RevisionRouteContext`, `pageDraftBracketSchema` to the rest of the system?**
  _439 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.057318894697535476 - nodes in this community are weakly interconnected._
- **Should `routes/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11463414634146342 - nodes in this community are weakly interconnected._
- **Should `cms-responder.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06915113871635611 - nodes in this community are weakly interconnected._
- **Should `config/courses.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14035087719298245 - nodes in this community are weakly interconnected._