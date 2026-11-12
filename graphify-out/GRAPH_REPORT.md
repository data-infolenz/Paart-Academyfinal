# Graph Report - Paart-Academyfinal  (2026-11-12)

## Corpus Check
- 159 files · ~99,093 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1398 nodes · 3337 edges · 101 communities (69 shown, 32 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.59)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9d58b797`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.tsx
- initializers/auth.ts
- cms-responder.tsx
- models/courses.ts
- auth/controller.tsx
- TypeScript Path Aliases & Config
- ADDED Requirements
- schema/index.ts
- cms-schemas.ts
- scripts
- models/materials.ts
- Architecture & OpenSpec Constraints
- Browser Hydration & Frame Prefetch
- PostgreSQL Initial Migration
- Node Module Path Resolver
- models/cms.ts
- Requirements
- faculty/controller.tsx
- admin/controller.tsx
- Requirement: Unified Credential Sign-In and Role Workspace Routing
- ADDED Requirements
- models/lms.ts
- 0002_multi_role_lms/up.sql
- Requirements
- 0002_multi_role_lms/down.sql
- @pitlane/vite-plugin-remix
- requireAdmin
- @sdxc/assets-middleware
- default-pages.ts
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
- getAspirantPortalSnapshot
- @sdxc/ui
- @sdxc/uuid
- document.tsx
- database.ts
- Requirement: Unified Credential Sign-In and Role Workspace Routing
- public/controller.tsx
- middleware/auth.ts
- schema/cms.ts
- cms-actions.tsx
- admissions/controller.tsx
- PaartDb
- models/admissions.ts
- models/enquiries.ts
- remix
- router.ts
- @sdxc/authz
- @sdxc/cache
- ADDED Requirements
- authMiddleware
- SmtpTransport
- ADDED Requirements
- ADDED Requirements
- Requirements
- Requirements
- Requirements
- @sdxc/catch-response-middleware
- @sdxc/crypto
- models/blogs.ts
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
- 0003_server_driven_pages/up.sql
- Tasks
- sitemap.ts
- @sdxc/bracket-params
- @sdxc/markdown
- @sdxc/rate-limit
- @sdxc/json-patch
- @sdxc/security-headers
- models/gallery.ts
- @pitlane/assets
- @sdxc/sitemap
- saveExamMarks
- @sdxc/u

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
- `WCAG AA Semantic UI (@sdxc/ui + @sdxc/u)` --semantically_similar_to--> `Academic Institution UI Design Constraint`  [INFERRED] [semantically similar]
  README.md → openspec/config.yaml
- `Vite+ (vp) Build & Verification Toolchain` --semantically_similar_to--> `OpenSpec Verification & Graphify Maintenance Gate`  [INFERRED] [semantically similar]
  README.md → openspec/config.yaml
- `seedRoleUser()` --references--> `UserRole`  [EXTRACTED]
  app/http/controllers/auth/controller.test.ts → database/schema/users.ts
- `SessionUser` --references--> `UserRole`  [EXTRACTED]
  app/initializers/auth.ts → database/schema/users.ts
- `FacultyLayoutProps` --references--> `SessionUser`  [EXTRACTED]
  resources/layouts/faculty.tsx → app/initializers/auth.ts

## Import Cycles
- 3-file cycle: `app/http/controllers/public/controller.tsx -> app/http/controllers/public/sitemap.ts -> app/initializers/router.ts -> app/http/controllers/public/controller.tsx`
- 3-file cycle: `app/http/controllers/public/cms-responder.tsx -> app/initializers/router.ts -> app/http/controllers/public/controller.tsx -> app/http/controllers/public/cms-responder.tsx`
- 3-file cycle: `app/http/controllers/public/controller.tsx -> app/http/controllers/public/llms.ts -> app/initializers/router.ts -> app/http/controllers/public/controller.tsx`

## Communities (101 total, 32 thin omitted)

### Community 0 - "index.tsx"
Cohesion: 0.07
Nodes (73): renderSafeMarkdown(), VisibilityEvalContext, SiteChromeConfig, visibilityLanguage, DEFAULT_SETTINGS, mapSettingsRow(), SiteSettings, DEFAULT_SITE_CHROME (+65 more)

### Community 1 - "initializers/auth.ts"
Cohesion: 0.06
Nodes (75): AdminUser, SessionUser, aspirantUser, AdmissionItem, BlogItem, HydrateBlocksOptions, HydratedCollections, HydratedPageResult (+67 more)

### Community 2 - "cms-responder.tsx"
Cohesion: 0.21
Nodes (16): index(), show(), show(), isAdminPreviewRequest(), renderCmsPageResponse(), renderEntityTemplatePage(), renderPublicNotFound(), AppContext (+8 more)

### Community 3 - "models/courses.ts"
Cohesion: 0.26
Nodes (11): findCourseBySlug(), mapCourseRow(), mapSeedCourse(), CourseCategory, CourseDetailSpec, SEED_COURSES, SEED_MATERIALS, SeedBlogItem (+3 more)

### Community 4 - "auth/controller.tsx"
Cohesion: 0.17
Nodes (21): changePassword(), changePasswordPage(), formatPasswordPolicyIssue(), getClientMeta(), legacyLogout(), login(), loginPage(), logout() (+13 more)

### Community 5 - "TypeScript Path Aliases & Config"
Cohesion: 0.06
Nodes (37): ./app/*, bootstrap/**/*, ./config/*, ./database/*, dist, DOM, DOM.Iterable, ES2024 (+29 more)

### Community 6 - "ADDED Requirements"
Cohesion: 0.09
Nodes (22): ADDED Requirements, Block Page Rendering Specification, Purpose, Requirement: Database-Backed Site Chrome Rendering, Requirement: Database-Driven Public Page and Campaign Slug Resolution, Requirement: Entity Detail Template Rendering, Requirement: Live Collection Hydration and Interactive Form Blocks, Requirement: Per-Block Schema Validation and Fault Isolation (+14 more)

### Community 7 - "schema/index.ts"
Cohesion: 0.17
Nodes (17): NewAdmissionRow, NewBlogRow, NewCourseRow, NewEnquiryRow, NewGalleryRow, col, InferInsert, InferSelect (+9 more)

### Community 8 - "cms-schemas.ts"
Cohesion: 0.06
Nodes (41): evaluateBlockVisibility(), academicHeroBlockSchema, admissionFormBlockSchema, asRecord(), baseEnvelope, BLOCK_TYPES, BlockValidationSummary, blogFeedBlockSchema (+33 more)

### Community 9 - "scripts"
Cohesion: 0.06
Nodes (33): nitro, devDependencies, nitro, @types/node, @types/pg, typescript, vite, vite-plus (+25 more)

### Community 10 - "models/materials.ts"
Cohesion: 0.12
Nodes (21): materialCreate(), createdBatchIds, createdMaterialIds, createdNotificationIds, createdUserIds, materials(), createdBatchIds, createdMaterialIds (+13 more)

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
Nodes (23): renderEditorState(), cmsPageKey(), getCmsCache(), purgeChromeCache(), purgePageCache(), deleteCampaignPage(), findPageById(), hasDraftDiff() (+15 more)

### Community 18 - "Requirements"
Cohesion: 0.09
Nodes (22): Block Page Rendering Specification, Purpose, Requirement: Database-Backed Site Chrome Rendering, Requirement: Database-Driven Public Page and Campaign Slug Resolution, Requirement: Entity Detail Template Rendering, Requirement: Live Collection Hydration and Interactive Form Blocks, Requirement: Per-Block Schema Validation and Fault Isolation, Requirement: Safe Rich Text and Conditional Block Visibility (+14 more)

### Community 19 - "faculty/controller.tsx"
Cohesion: 0.13
Nodes (37): index(), materials(), batchSyllabus(), batchSyllabusCreate(), batchSyllabusStatus(), examCreate(), examMarks(), examMarksImport() (+29 more)

### Community 20 - "admin/controller.tsx"
Cohesion: 0.08
Nodes (32): batchToggle(), blogDelete(), blogToggle(), courseDelete(), courseToggle(), changePasswordSchema, createBatchSchema, createBlogSchema (+24 more)

### Community 21 - "Requirement: Unified Credential Sign-In and Role Workspace Routing"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Multi-Role Authentication Specification, Purpose, Requirement: Mandatory First-Login Password Change, Requirement: Revocable Server-Managed Sessions and Sign-Out, Requirement: Role-Based Workspace and Action Isolation, Requirement: Unified Credential Sign-In and Role Workspace Routing, Scenario: Administrator signs in and reaches admin console (+12 more)

### Community 22 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Page Publishing Specification, Purpose, Requirement: Administrator-Only Page and Chrome Studio Access, Requirement: Atomic Publication, Authorship Audit, and Cache Invalidation, Requirement: Campaign Page Creation and Reserved Route Guard, Requirement: Draft Block Composition, Reordering, and Optimistic Concurrency, Requirement: Live Draft Preview with Search Indexing Protection (+12 more)

### Community 23 - "models/lms.ts"
Cohesion: 0.08
Nodes (36): AspirantBatchProgress, AspirantPublishedScorecard, LmsValidationError, MarksEntryInputRow, MarksSheetEntry, SyllabusTopicItem, updateSyllabusTopicStatus(), AttendanceStatus (+28 more)

### Community 24 - "0002_multi_role_lms/up.sql"
Cohesion: 0.42
Nodes (10): "admissions", "batches", "enrollments", "exam_results", "exams", "materials", "notifications", "sessions" (+2 more)

### Community 25 - "Requirements"
Cohesion: 0.10
Nodes (20): Page Publishing Specification, Purpose, Requirement: Administrator-Only Page and Chrome Studio Access, Requirement: Atomic Publication, Authorship Audit, and Cache Invalidation, Requirement: Campaign Page Creation and Reserved Route Guard, Requirement: Draft Block Composition, Reordering, and Optimistic Concurrency, Requirement: Live Draft Preview with Search Indexing Protection, Requirement: Revision History and One-Click Rollback (+12 more)

### Community 28 - "requireAdmin"
Cohesion: 0.12
Nodes (24): batchCreate(), blogCreate(), courseCreate(), courses(), galleryCreate(), materialCreate(), materialDelete(), settings() (+16 more)

### Community 30 - "default-pages.ts"
Cohesion: 0.23
Nodes (11): FaqCategory, FLAT_FAQS, PAART_FAQ_CATEGORIES, DEPARTMENT_SELECTIONS, IMPACT_METRICS, ImpactMetric, STATE_RANK_HIGHLIGHTS, TRUST_INITIATIVES (+3 more)

### Community 31 - "mail.tsx"
Cohesion: 0.07
Nodes (25): createdBatchIds, createdUserIds, outbox, connectSocket(), createPaartMailer(), CredentialEmailProps, credentialEmailSchema, dotStuffMime() (+17 more)

### Community 32 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Purpose, Requirement: Edge CDN Static Asset Delivery, Requirement: Nitro-Driven Vercel Build Output Generation, Requirement: Serverless Environment Variable and Secret Integration, Requirement: Serverless PostgreSQL Pool Configuration, Scenario: Connection pool limit respected in serverless runtime, Scenario: Local production build preserves standard output (+5 more)

### Community 37 - "Requirements"
Cohesion: 0.14
Nodes (13): Purpose, Requirement: Edge CDN Static Asset Delivery, Requirement: Nitro-Driven Vercel Build Output Generation, Requirement: Serverless Environment Variable and Secret Integration, Requirement: Serverless PostgreSQL Pool Configuration, Requirements, Scenario: Connection pool limit respected in serverless runtime, Scenario: Local production build preserves standard output (+5 more)

### Community 42 - "db"
Cohesion: 0.17
Nodes (13): createAdminSession(), createdPageIds, createdUserIds, createdUserIds, createdPageIds, createdUserIds, activeCache, resetCmsCache() (+5 more)

### Community 45 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, pg, @sdxc/lazy-frame, @sdxc/seo, @sdxc/strings, pg, @sdxc/lazy-frame, @sdxc/seo (+1 more)

### Community 46 - "provisioning.test.ts"
Cohesion: 0.18
Nodes (13): createdAdmissionIds, createdBatchIds, createdUserIds, memoryOutbox, seedAdminSession(), seedRoleUser(), createTestUser(), createPortalUser() (+5 more)

### Community 47 - "getAspirantPortalSnapshot"
Cohesion: 0.33
Nodes (9): exams(), index(), marks(), notifications(), progress(), requireAspirant(), computeSyllabusProgressPct(), getAspirantPortalSnapshot() (+1 more)

### Community 50 - "document.tsx"
Cohesion: 0.39
Nodes (6): readThemeCookie(), Theme, ThemeToggleProps, Document, DocumentProps, Props

### Community 51 - "database.ts"
Cohesion: 0.08
Nodes (30): rateLimitMiddleware(), closeDatabase(), databaseContext, databaseMiddleware(), getDatabase(), getDatabasePoolConfig(), globalForPaartDb, transaction() (+22 more)

### Community 52 - "Requirement: Unified Credential Sign-In and Role Workspace Routing"
Cohesion: 0.10
Nodes (20): Multi-Role Authentication Specification, Purpose, Requirement: Mandatory First-Login Password Change, Requirement: Revocable Server-Managed Sessions and Sign-Out, Requirement: Role-Based Workspace and Action Isolation, Requirement: Unified Credential Sign-In and Role Workspace Routing, Requirements, Scenario: Administrator signs in and reaches admin console (+12 more)

### Community 53 - "public/controller.tsx"
Cohesion: 0.18
Nodes (16): show(), index(), renderStaticCmsSlug(), about(), contact(), enquirySubmit(), faq(), gallery() (+8 more)

### Community 54 - "middleware/auth.ts"
Cohesion: 0.16
Nodes (24): authSessionContext, enforcePasswordChange(), forbiddenResponse(), isPasswordChangeExempt(), loadSessionUser(), PASSWORD_CHANGE_EXEMPT_PATHS, redirectToLogin(), requestSessionMap (+16 more)

### Community 55 - "schema/cms.ts"
Cohesion: 0.14
Nodes (14): AdminPageSummary, ResolvedCmsPage, NewPageRevisionRow, NewPageRow, NewSiteChromeRow, PAGE_KINDS, PAGE_STATUSES, PageKind (+6 more)

### Community 56 - "cms-actions.tsx"
Cohesion: 0.18
Nodes (12): cmsAdminActions, IdRouteContext, pageDraftBracketSchema, readFormInt(), readFormString(), RevisionRouteContext, siteChromeBracketSchema, createCampaignPage() (+4 more)

### Community 57 - "admissions/controller.tsx"
Cohesion: 0.26
Nodes (9): apply(), submit(), success(), admissionSchema, honeypot, issueHoneypotFields(), ALLOWED_EXTENSIONS, saveUploadedFile() (+1 more)

### Community 58 - "PaartDb"
Cohesion: 0.23
Nodes (18): batches(), generateTemporaryPassword(), normalizeUserEmail(), revokeUserSessions(), PaartDb, sendAccountCredentialsEmail(), generateRollNumber(), listActiveFacultyUsers() (+10 more)

### Community 59 - "models/admissions.ts"
Cohesion: 0.18
Nodes (10): admissionProvision(), admissions(), admissionStatus(), listAdmissions(), mapAdmissionRow(), updateAdmissionStatus(), ADMISSION_STATUSES, AdmissionRow (+2 more)

### Community 60 - "models/enquiries.ts"
Cohesion: 0.22
Nodes (9): enquiries(), enquiryStatus(), listEnquiries(), mapEnquiryRow(), updateEnquiryStatus(), enquiries, ENQUIRY_STATUSES, EnquiryRow (+1 more)

### Community 62 - "router.ts"
Cohesion: 0.29
Nodes (4): DEFAULT_CSP_DIRECTIVES, securityHeadersMiddleware(), remix/router, RouterTypes

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

### Community 75 - "models/blogs.ts"
Cohesion: 0.36
Nodes (8): blogs(), findBlogBySlug(), listAllBlogs(), mapBlogRow(), mapSeedBlog(), SEED_BLOGS, BlogRow, blogs

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
Cohesion: 0.21
Nodes (12): AdminPageDetail, PageRevisionSummary, BLOCK_TYPE_LABELS, BlockType, PageBlock, PageSeo, DefaultPageSeed, AdminPageEditorPage() (+4 more)

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

### Community 87 - "0003_server_driven_pages/up.sql"
Cohesion: 0.67
Nodes (3): "page_revisions", "pages", "site_chrome"

### Community 88 - "Tasks"
Cohesion: 0.29
Nodes (6): 1. Dependencies & Environment Configuration, 2. Nitro & Pitlane Vite Integration, 3. Serverless Database Resilience, 4. Verification & Build Validation, Tasks, Workflow follow-up

### Community 89 - "sitemap.ts"
Cohesion: 0.29
Nodes (11): computePreviewHref(), resolveSampleEntitySlugs(), llmsAction(), sitemapAction(), listPublishedBlogs(), getSiteChrome(), hydratePageBlocks(), listPublishedIndexablePages() (+3 more)

### Community 96 - "models/gallery.ts"
Cohesion: 0.22
Nodes (10): gallery(), galleryDelete(), deleteGalleryItem(), listGalleryItems(), mapGalleryRow(), mapSeedGallery(), SEED_GALLERY, SeedGalleryItem (+2 more)

### Community 99 - "saveExamMarks"
Cohesion: 0.38
Nodes (7): examPublish(), importExamMarksCsv(), publishExamResults(), recomputeExamRanks(), sanitizeFormulaText(), saveExamMarks(), ATTENDANCE_STATUSES

## Knowledge Gaps
- **441 isolated node(s):** `IdRouteContext`, `RevisionRouteContext`, `pageDraftBracketSchema`, `siteChromeBracketSchema`, `createdUserIds` (+436 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Routes` connect `initializers/auth.ts` to `sitemap.ts`, `index.tsx`, `cms-responder.tsx`, `auth/controller.tsx`, `page-editor-page.tsx`, `faculty/controller.tsx`, `admin/controller.tsx`, `public/controller.tsx`, `cms-actions.tsx`, `admissions/controller.tsx`, `router.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `PaartDb` connect `PaartDb` to `initializers/auth.ts`, `saveExamMarks`, `auth/controller.tsx`, `models/materials.ts`, `provisioning.test.ts`, `getAspirantPortalSnapshot`, `models/cms.ts`, `database.ts`, `faculty/controller.tsx`, `admin/controller.tsx`, `middleware/auth.ts`, `models/lms.ts`, `requireAdmin`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `IdRouteContext`, `RevisionRouteContext`, `pageDraftBracketSchema` to the rest of the system?**
  _441 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06996935648621042 - nodes in this community are weakly interconnected._
- **Should `initializers/auth.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05831285831285831 - nodes in this community are weakly interconnected._
- **Should `TypeScript Path Aliases & Config` be split into smaller, more focused modules?**
  _Cohesion score 0.059743954480796585 - nodes in this community are weakly interconnected._
- **Should `ADDED Requirements` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._