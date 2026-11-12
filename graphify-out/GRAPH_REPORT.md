# Graph Report - Paart-Academyfinal  (2026-11-12)

## Corpus Check
- 159 files · ~99,236 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1410 nodes · 3325 edges · 95 communities (61 shown, 30 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3b339a2f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.tsx
- AdminUser
- cms-responder.tsx
- models/courses.ts
- routes/index.ts
- compilerOptions
- ADDED Requirements
- schema/index.ts
- cms-schemas.ts
- scripts
- models/materials.ts
- OpenSpec Spec-Driven Project Configuration
- ui-modules.ts
- .send
- register-paths.mjs
- models/cms.ts
- Requirements
- faculty/controller.tsx
- admin/controller.tsx
- Requirement: Unified Credential Sign-In and Role Workspace Routing
- ADDED Requirements
- models/lms.ts
- "users"
- Requirements
- @pitlane/vite-plugin-remix
- schema/users.ts
- @sdxc/assets-middleware
- seed.ts
- mail.tsx
- ADDED Requirements
- @sdxc/csv
- @sdxc/email-address
- @sdxc/health
- @sdxc/honeypot
- Requirements
- @sdxc/lazy-route
- @sdxc/logger
- @sdxc/mail
- @sdxc/password-policy
- db
- @sdxc/response
- @sdxc/result
- dependencies
- provisioning.test.ts
- portal/controller.tsx
- @sdxc/ui
- @sdxc/uuid
- faculty.tsx
- database.ts
- Requirement: Unified Credential Sign-In and Role Workspace Routing
- cms-schemas.test.ts
- initializers/auth.ts
- schema/cms.ts
- PAART Academy — Clean & Standard Remix 3 Web Application
- cleanSubmittedBlockArrays
- normalizeVisibilityExpression
- models/admissions.ts
- remix
- router.ts
- @sdxc/authz
- @sdxc/cache
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- Requirements
- Requirements
- @sdxc/catch-response-middleware
- @sdxc/crypto
- Design
- @sdxc/expression
- Proposal
- Decisions
- Tasks
- page-editor-page.tsx
- Design
- Tasks
- Proposal
- @sdxc/icons
- Proposal
- Tasks
- models/blogs.ts
- @sdxc/bracket-params
- @sdxc/markdown
- @sdxc/rate-limit
- @sdxc/json-patch
- @sdxc/security-headers
- models/gallery.ts
- @pitlane/assets
- @sdxc/sitemap
- @sdxc/u

## God Nodes (most connected - your core abstractions)
1. `Routes` - 51 edges
2. `SessionUser` - 40 edges
3. `AdminUser` - 37 edges
4. `requireAdmin()` - 35 edges
5. `acadSerif()` - 32 edges
6. `db` - 25 edges
7. `CourseItem` - 23 edges
8. `acadCard()` - 23 edges
9. `hashUserPassword()` - 22 edges
10. `renderStaticCmsSlug()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `FacultyLayoutProps` --references--> `SessionUser`  [EXTRACTED]
  resources/layouts/faculty.tsx → app/initializers/auth.ts
- `SessionUser` --references--> `UserRole`  [EXTRACTED]
  app/initializers/auth.ts → database/schema/users.ts
- `SessionUser` --references--> `UserStatus`  [EXTRACTED]
  app/initializers/auth.ts → database/schema/users.ts
- `PortalLayoutProps` --references--> `SessionUser`  [EXTRACTED]
  resources/layouts/portal.tsx → app/initializers/auth.ts
- `ChangePasswordPageProps` --references--> `SessionUser`  [EXTRACTED]
  resources/views/auth/change-password.tsx → app/initializers/auth.ts

## Import Cycles
- None detected.

## Communities (95 total, 30 thin omitted)

### Community 0 - "index.tsx"
Cohesion: 0.07
Nodes (74): renderSafeMarkdown(), aspirantUser, HydratedCollections, HydratedPageResult, PageBlock, SiteChromeConfig, DEFAULT_SETTINGS, SiteSettings (+66 more)

### Community 1 - "AdminUser"
Cohesion: 0.11
Nodes (22): AdminUser, BlogItem, HydrateBlocksOptions, ADMIN_SHELL_LABELS, AdminLayout(), AdminLayoutProps, NAV_GROUPS, AdminAdmissionsPage() (+14 more)

### Community 2 - "cms-responder.tsx"
Cohesion: 0.06
Nodes (51): apply(), submit(), success(), index(), show(), show(), index(), show() (+43 more)

### Community 3 - "models/courses.ts"
Cohesion: 0.14
Nodes (20): courses(), materials(), CourseItem, findCourseBySlug(), listAllCourses(), mapCourseRow(), mapSeedCourse(), COURSE_CATEGORIES (+12 more)

### Community 4 - "routes/index.ts"
Cohesion: 0.18
Nodes (18): SessionUser, VisibilityEvalContext, AspirantPortalSnapshot, NotificationItem, PORTAL_NAV_ITEMS, PORTAL_SHELL_LABELS, PortalLayout(), PortalLayoutProps (+10 more)

### Community 5 - "compilerOptions"
Cohesion: 0.06
Nodes (37): ./app/*, bootstrap/**/*, ./config/*, ./database/*, dist, DOM, DOM.Iterable, ES2024 (+29 more)

### Community 6 - "ADDED Requirements"
Cohesion: 0.09
Nodes (22): ADDED Requirements, Block Page Rendering Specification, Purpose, Requirement: Database-Backed Site Chrome Rendering, Requirement: Database-Driven Public Page and Campaign Slug Resolution, Requirement: Entity Detail Template Rendering, Requirement: Live Collection Hydration and Interactive Form Blocks, Requirement: Per-Block Schema Validation and Fault Isolation (+14 more)

### Community 7 - "schema/index.ts"
Cohesion: 0.17
Nodes (16): ADMISSION_STATUSES, AdmissionRow, admissions, NewAdmissionRow, BlogRow, NewBlogRow, NewCourseRow, NewEnquiryRow (+8 more)

### Community 8 - "cms-schemas.ts"
Cohesion: 0.06
Nodes (29): academicHeroBlockSchema, admissionFormBlockSchema, baseEnvelope, BlockValidationSummary, blogFeedBlockSchema, boolField(), calloutBandBlockSchema, contactHubBlockSchema (+21 more)

### Community 9 - "scripts"
Cohesion: 0.06
Nodes (33): nitro, devDependencies, nitro, @types/node, @types/pg, typescript, vite, vite-plus (+25 more)

### Community 10 - "models/materials.ts"
Cohesion: 0.20
Nodes (14): createMaterial(), listAllMaterials(), listMaterialsForAspirant(), listPublishedMaterials(), mapMaterialRow(), mapSeedMaterial(), MaterialItem, SEED_MATERIALS (+6 more)

### Community 11 - "OpenSpec Spec-Driven Project Configuration"
Cohesion: 0.50
Nodes (4): Academic Institution UI Design Constraint, OpenSpec Spec-Driven Project Configuration, Component-Scoped @sdxc/u & Theme Token Boundary, OpenSpec Verification & Graphify Maintenance Gate

### Community 12 - "ui-modules.ts"
Cohesion: 0.13
Nodes (6): app, FrameOptions, PREFETCHED, prefetchKey(), takePrefetched(), PACKAGE_MODULES

### Community 14 - "register-paths.mjs"
Cohesion: 0.67
Nodes (3): resolve(), resolveCandidate(), rootDir

### Community 17 - "models/cms.ts"
Cohesion: 0.14
Nodes (34): computePreviewHref(), IdRouteContext, pageDraftBracketSchema, readFormInt(), readFormString(), renderEditorState(), RevisionRouteContext, siteChromeBracketSchema (+26 more)

### Community 18 - "Requirements"
Cohesion: 0.09
Nodes (22): Block Page Rendering Specification, Purpose, Requirement: Database-Backed Site Chrome Rendering, Requirement: Database-Driven Public Page and Campaign Slug Resolution, Requirement: Entity Detail Template Rendering, Requirement: Live Collection Hydration and Interactive Form Blocks, Requirement: Per-Block Schema Validation and Fault Isolation, Requirement: Safe Rich Text and Conditional Block Visibility (+14 more)

### Community 19 - "faculty/controller.tsx"
Cohesion: 0.14
Nodes (35): batchSyllabus(), batchSyllabusCreate(), batchSyllabusStatus(), examCreate(), examMarks(), examMarksImport(), examMarksSave(), examMarksTemplate() (+27 more)

### Community 20 - "admin/controller.tsx"
Cohesion: 0.07
Nodes (59): cmsAdminActions, admissionProvision(), admissions(), admissionStatus(), batchCreate(), batches(), batchToggle(), blogCreate() (+51 more)

### Community 21 - "Requirement: Unified Credential Sign-In and Role Workspace Routing"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Multi-Role Authentication Specification, Purpose, Requirement: Mandatory First-Login Password Change, Requirement: Revocable Server-Managed Sessions and Sign-Out, Requirement: Role-Based Workspace and Action Isolation, Requirement: Unified Credential Sign-In and Role Workspace Routing, Scenario: Administrator signs in and reaches admin console (+12 more)

### Community 22 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Page Publishing Specification, Purpose, Requirement: Administrator-Only Page and Chrome Studio Access, Requirement: Atomic Publication, Authorship Audit, and Cache Invalidation, Requirement: Campaign Page Creation and Reserved Route Guard, Requirement: Draft Block Composition, Reordering, and Optimistic Concurrency, Requirement: Live Draft Preview with Search Indexing Protection (+12 more)

### Community 23 - "models/lms.ts"
Cohesion: 0.07
Nodes (44): createdBatchIds, createdMaterialIds, createdNotificationIds, createdUserIds, createdBatchIds, createdMaterialIds, createdNotificationIds, createdUserIds (+36 more)

### Community 24 - ""users""
Cohesion: 0.18
Nodes (18): "admissions", "blogs", "courses", "enquiries", "gallery_items", "materials", "site_settings", "batches" (+10 more)

### Community 25 - "Requirements"
Cohesion: 0.10
Nodes (20): Page Publishing Specification, Purpose, Requirement: Administrator-Only Page and Chrome Studio Access, Requirement: Atomic Publication, Authorship Audit, and Cache Invalidation, Requirement: Campaign Page Creation and Reserved Route Guard, Requirement: Draft Block Composition, Reordering, and Optimistic Concurrency, Requirement: Live Draft Preview with Search Indexing Protection, Requirement: Revision History and One-Click Rollback (+12 more)

### Community 28 - "schema/users.ts"
Cohesion: 0.29
Nodes (6): NewSessionRow, NewUserRow, SessionRow, USER_ROLES, USER_STATUSES, UserRow

### Community 30 - "seed.ts"
Cohesion: 0.24
Nodes (12): DEFAULT_SITE_CHROME, DEPARTMENT_SELECTIONS, IMPACT_METRICS, ImpactMetric, STATE_RANK_HIGHLIGHTS, TRUST_INITIATIVES, TRUST_PILLARS, TRUST_PROFILE (+4 more)

### Community 31 - "mail.tsx"
Cohesion: 0.10
Nodes (21): createPaartMailer(), CredentialEmailProps, credentialEmailSchema, dotStuffMime(), formatRoleLabel(), getMailer(), LocalDevFallbackTransport, localMailOutbox (+13 more)

### Community 32 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Purpose, Requirement: Edge CDN Static Asset Delivery, Requirement: Nitro-Driven Vercel Build Output Generation, Requirement: Serverless Environment Variable and Secret Integration, Requirement: Serverless PostgreSQL Pool Configuration, Scenario: Connection pool limit respected in serverless runtime, Scenario: Local production build preserves standard output (+5 more)

### Community 37 - "Requirements"
Cohesion: 0.14
Nodes (13): Purpose, Requirement: Edge CDN Static Asset Delivery, Requirement: Nitro-Driven Vercel Build Output Generation, Requirement: Serverless Environment Variable and Secret Integration, Requirement: Serverless PostgreSQL Pool Configuration, Requirements, Scenario: Connection pool limit respected in serverless runtime, Scenario: Local production build preserves standard output (+5 more)

### Community 42 - "db"
Cohesion: 0.19
Nodes (11): createdPageIds, createdUserIds, createdUserIds, createdPageIds, createdUserIds, resetCmsCache(), db, router (+3 more)

### Community 45 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, pg, @sdxc/lazy-frame, @sdxc/seo, @sdxc/strings, pg, @sdxc/lazy-frame, @sdxc/seo (+1 more)

### Community 46 - "provisioning.test.ts"
Cohesion: 0.15
Nodes (9): createdAdmissionIds, createdBatchIds, createdUserIds, memoryOutbox, createdBatchIds, createdUserIds, outbox, setMailerOverrideForTests() (+1 more)

### Community 47 - "portal/controller.tsx"
Cohesion: 0.21
Nodes (16): exams(), index(), marks(), materials(), notifications(), progress(), requireAspirant(), computeSyllabusProgressPct() (+8 more)

### Community 50 - "faculty.tsx"
Cohesion: 0.13
Nodes (20): BatchSummaryItem, ExamItem, MarksSheetEntry, SyllabusTopicItem, THEME_COOKIE, ThemeToggle, ThemeToggleProps, FACULTY_NAV_ITEMS (+12 more)

### Community 51 - "database.ts"
Cohesion: 0.13
Nodes (19): closeDatabase(), databaseContext, getDatabase(), getDatabasePoolConfig(), globalForPaartDb, PaartDb, transaction(), clientDir (+11 more)

### Community 52 - "Requirement: Unified Credential Sign-In and Role Workspace Routing"
Cohesion: 0.10
Nodes (20): Multi-Role Authentication Specification, Purpose, Requirement: Mandatory First-Login Password Change, Requirement: Revocable Server-Managed Sessions and Sign-Out, Requirement: Role-Based Workspace and Action Isolation, Requirement: Unified Credential Sign-In and Role Workspace Routing, Requirements, Scenario: Administrator signs in and reaches admin console (+12 more)

### Community 53 - "cms-schemas.test.ts"
Cohesion: 0.29
Nodes (7): BLOCK_TYPES, matchesReservedRoute(), normalizeCampaignSlug(), pageBlockSchema, siteChromeSchema, validateCampaignSlug(), DEFAULT_PAGES

### Community 54 - "initializers/auth.ts"
Cohesion: 0.06
Nodes (78): createAdminSession(), seedAdminSession(), changePassword(), changePasswordPage(), formatPasswordPolicyIssue(), getClientMeta(), legacyLogout(), login() (+70 more)

### Community 55 - "schema/cms.ts"
Cohesion: 0.13
Nodes (16): AdminPageSummary, ResolvedCmsPage, PageSeo, DefaultPageSeed, NewPageRevisionRow, NewPageRow, NewSiteChromeRow, PAGE_KINDS (+8 more)

### Community 56 - "PAART Academy — Clean & Standard Remix 3 Web Application"
Cohesion: 0.40
Nodes (4): Getting Started, Key Architectural Highlights, PAART Academy — Clean & Standard Remix 3 Web Application, Production Build, Tests & Server

### Community 57 - "cleanSubmittedBlockArrays"
Cohesion: 0.67
Nodes (4): asRecord(), cleanSubmittedBlockArrays(), cleanSubmittedSiteChrome(), trimStr()

### Community 58 - "normalizeVisibilityExpression"
Cohesion: 0.67
Nodes (3): normalizeVisibilityExpression(), parseIsoBoundMs(), visibilityRuleSchema

### Community 60 - "models/admissions.ts"
Cohesion: 0.16
Nodes (14): enquiries(), AdmissionItem, EnquiryItem, listEnquiries(), mapEnquiryRow(), AdmissionStatus, enquiries, ENQUIRY_STATUSES (+6 more)

### Community 62 - "router.ts"
Cohesion: 0.12
Nodes (15): rateLimitMiddleware(), DEFAULT_CSP_DIRECTIVES, securityHeadersMiddleware(), assetResolver, databaseMiddleware(), paartLogger, remix/router, RouterTypes (+7 more)

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

### Community 76 - "Design"
Cohesion: 0.18
Nodes (10): 1. Tier-2 Typed Block Registry over Relational Per-Block Tables or Raw AST JSON, 2. Two Page Contracts (`static_page` and `collection_template`) + `site_chrome` Singleton, 3. Curated Institutional Block Catalog + Selective Parallel Hydration, 4. Leveraging `@sdxc/*` Primitives for Publishing, Caching, and Preview, Context, Decisions, Design, Goals / Non-Goals (+2 more)

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
Cohesion: 0.24
Nodes (9): AdminPageDetail, PageRevisionSummary, BLOCK_TYPE_LABELS, BlockType, AdminPageEditorPage(), AdminPageEditorPageProps, renderBlockFields(), renderThreeColGrid() (+1 more)

### Community 82 - "Design"
Cohesion: 0.20
Nodes (9): 1. Integrate `nitro/vite` with Conditional Output, 2. Database Pooling Tolerances for Serverless Functions, 3. Edge Static Routing Configuration, Context, Decisions, Design, Goals / Non-Goals, Migration Plan (+1 more)

### Community 83 - "Tasks"
Cohesion: 0.22
Nodes (8): 1. Dependencies, Configuration & Database Schema, 2. Multi-Role Authentication, Sessions & RBAC (`identity/multi-role-auth`), 3. Admin Account Provisioning & SMTP Delivery (`identity/account-provisioning`), 4. Faculty Workspace (`lms/faculty-workspace`), 5. Aspirant Portal (`lms/aspirant-portal`), 6. End-to-End Integration Verification & Knowledge Graph Sync, Tasks, Workflow follow-up

### Community 84 - "Proposal"
Cohesion: 0.25
Nodes (7): Capabilities, Impact, Modified Capabilities, New Capabilities, Proposal, What Changes, Why

### Community 86 - "Proposal"
Cohesion: 0.25
Nodes (7): Capabilities, Impact, Modified Capabilities, New Capabilities, Proposal, What Changes, Why

### Community 88 - "Tasks"
Cohesion: 0.29
Nodes (6): 1. Dependencies & Environment Configuration, 2. Nitro & Pitlane Vite Integration, 3. Serverless Database Resilience, 4. Verification & Build Validation, Tasks, Workflow follow-up

### Community 89 - "models/blogs.ts"
Cohesion: 0.20
Nodes (15): resolveSampleEntitySlugs(), llmsAction(), sitemapAction(), AppContext, findBlogBySlug(), listPublishedBlogs(), mapBlogRow(), mapSeedBlog() (+7 more)

### Community 96 - "models/gallery.ts"
Cohesion: 0.15
Nodes (15): gallery(), galleryDelete(), HydratorLoaders, deleteGalleryItem(), GalleryItem, listGalleryItems(), mapGalleryRow(), mapSeedGallery() (+7 more)

## Knowledge Gaps
- **440 isolated node(s):** `IdRouteContext`, `RevisionRouteContext`, `pageDraftBracketSchema`, `siteChromeBracketSchema`, `createdUserIds` (+435 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 513 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Routes` connect `routes/index.ts` to `index.tsx`, `AdminUser`, `cms-responder.tsx`, `models/courses.ts`, `models/gallery.ts`, `models/materials.ts`, `portal/controller.tsx`, `models/cms.ts`, `faculty.tsx`, `faculty/controller.tsx`, `admin/controller.tsx`, `page-editor-page.tsx`, `initializers/auth.ts`, `models/blogs.ts`, `models/admissions.ts`, `router.ts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `SmtpLineReader` connect `.send` to `mail.tsx`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `db` connect `db` to `models/gallery.ts`, `index.tsx`, `cms-responder.tsx`, `models/courses.ts`, `models/materials.ts`, `provisioning.test.ts`, `models/cms.ts`, `database.ts`, `initializers/auth.ts`, `models/lms.ts`, `models/blogs.ts`, `models/admissions.ts`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `IdRouteContext`, `RevisionRouteContext`, `pageDraftBracketSchema` to the rest of the system?**
  _440 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0695970695970696 - nodes in this community are weakly interconnected._
- **Should `AdminUser` be split into smaller, more focused modules?**
  _Cohesion score 0.11182795698924732 - nodes in this community are weakly interconnected._
- **Should `cms-responder.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06386946386946386 - nodes in this community are weakly interconnected._