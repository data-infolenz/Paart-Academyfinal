# Graph Report - Paart-Academyfinal  (2026-11-12)

## Corpus Check
- 152 files · ~95,164 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1301 nodes · 3246 edges · 96 communities (63 shown, 33 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.59)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5137b920`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.tsx
- admin/controller.tsx
- cms-responder.tsx
- models/gallery.ts
- app.ts
- TypeScript Path Aliases & Config
- pg
- schema/index.ts
- cms-schemas.ts
- scripts
- auth/controller.tsx
- Architecture & OpenSpec Constraints
- Browser Hydration & Frame Prefetch
- PostgreSQL Initial Migration
- Node Module Path Resolver
- cms.test.ts
- models/cms.ts
- ADDED Requirements
- admissions/controller.tsx
- Requirement: Unified Credential Sign-In and Role Workspace Routing
- ADDED Requirements
- models/lms.ts
- 0002_multi_role_lms/up.sql
- users
- 0002_multi_role_lms/down.sql
- @pitlane/vite-plugin-remix
- remix
- @sdxc/assets-middleware
- @sdxc/authz
- @sdxc/catch-response-middleware
- @sdxc/crypto
- @sdxc/csv
- @sdxc/email-address
- @sdxc/health
- @sdxc/honeypot
- @sdxc/icons
- @sdxc/lazy-route
- @sdxc/logger
- @sdxc/mail
- @sdxc/password-policy
- @sdxc/rate-limit
- @sdxc/response
- @sdxc/result
- dependencies
- @sdxc/sitemap
- @sdxc/u
- @sdxc/ui
- @sdxc/uuid
- mail.tsx
- routes/index.ts
- Requirement: Unified Credential Sign-In and Role Workspace Routing
- faculty/controller.tsx
- middleware/auth.ts
- models/materials.ts
- requireAdmin
- provisioning.test.ts
- models/users.ts
- models/admissions.ts
- models/enquiries.ts
- courseCreate
- PaartDb
- database.ts
- saveExamMarks
- ADDED Requirements
- authMiddleware
- SmtpTransport
- ADDED Requirements
- ADDED Requirements
- Requirements
- Requirements
- Requirements
- listBatches
- initializers/auth.ts
- cms-actions.tsx
- .send
- cms-hydrator.ts
- server.ts
- Decisions
- Design
- page-editor-page.tsx
- default-pages.ts
- Tasks
- Proposal
- Proposal
- Tasks
- 0003_server_driven_pages/up.sql
- LocalDevFallbackTransport
- @pitlane/assets
- @sdxc/bracket-params
- @sdxc/cache
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
- `CourseCardProps` --references--> `CourseItem`  [EXTRACTED]
  resources/components/course-card.tsx → app/models/courses.ts
- `EnquiryFormCardProps` --references--> `CourseItem`  [EXTRACTED]
  resources/components/enquiry-form.tsx → app/models/courses.ts
- `userStatus()` --references--> `USER_STATUSES`  [EXTRACTED]
  app/http/controllers/admin/controller.tsx → database/schema/users.ts

## Import Cycles
- 3-file cycle: `app/http/controllers/public/cms-responder.tsx -> app/initializers/router.ts -> app/http/controllers/public/controller.tsx -> app/http/controllers/public/cms-responder.tsx`
- 3-file cycle: `app/http/controllers/public/controller.tsx -> app/http/controllers/public/llms.ts -> app/initializers/router.ts -> app/http/controllers/public/controller.tsx`
- 3-file cycle: `app/http/controllers/public/controller.tsx -> app/http/controllers/public/sitemap.ts -> app/initializers/router.ts -> app/http/controllers/public/controller.tsx`

## Hyperedges (group relationships)
- **PAART Academy Remix 3 SSR Platform Architecture** — readme_paartacademy, readme_remix3ssr, readme_middlewarepipeline, readme_postgresdatalayer, readme_seolegacyredirects [EXTRACTED 1.00]
- **PAART Academy Institutional UI & Styling Governance** — readme_wcagsemanticui, openspec_config_academicdesignconstraint, openspec_config_tsxutilitystyling [INFERRED 0.95]
- **Vite+ Build Verification & Graphify Sync Workflow** — openspec_config_specdrivenschema, openspec_config_validationgate, readme_viteplustoolchain [INFERRED 0.95]

## Communities (96 total, 33 thin omitted)

### Community 0 - "index.tsx"
Cohesion: 0.07
Nodes (73): renderSafeMarkdown(), VisibilityEvalContext, SiteChromeConfig, visibilityLanguage, DEFAULT_SETTINGS, mapSettingsRow(), SiteSettings, AdmissionFormBlock() (+65 more)

### Community 1 - "admin/controller.tsx"
Cohesion: 0.10
Nodes (22): cmsAdminActions, batchToggle(), blogDelete(), blogToggle(), courseDelete(), courseToggle(), deleteBlog(), toggleBlogPublished() (+14 more)

### Community 2 - "cms-responder.tsx"
Cohesion: 0.06
Nodes (67): resolveSampleEntitySlugs(), blogs(), success(), index(), show(), show(), index(), show() (+59 more)

### Community 3 - "models/gallery.ts"
Cohesion: 0.24
Nodes (9): gallery(), galleryDelete(), deleteGalleryItem(), listGalleryItems(), mapGalleryRow(), mapSeedGallery(), SEED_GALLERY, galleryItems (+1 more)

### Community 4 - "app.ts"
Cohesion: 0.17
Nodes (11): rateLimitMiddleware(), honeypot, issueHoneypotFields(), paartLogger, AppConfig, appConfigSchema, booleanFlag, configDir (+3 more)

### Community 5 - "TypeScript Path Aliases & Config"
Cohesion: 0.06
Nodes (37): ./app/*, bootstrap/**/*, ./config/*, ./database/*, dist, DOM, DOM.Iterable, ES2024 (+29 more)

### Community 7 - "schema/index.ts"
Cohesion: 0.16
Nodes (18): NewAdmissionRow, NewBlogRow, NewCourseRow, NewEnquiryRow, NewGalleryRow, col, InferInsert, InferSelect (+10 more)

### Community 8 - "cms-schemas.ts"
Cohesion: 0.06
Nodes (42): evaluateBlockVisibility(), academicHeroBlockSchema, admissionFormBlockSchema, asRecord(), baseEnvelope, BLOCK_TYPES, BlockValidationSummary, blogFeedBlockSchema (+34 more)

### Community 9 - "scripts"
Cohesion: 0.06
Nodes (31): devDependencies, @types/node, @types/pg, typescript, vite, vite-plus, engines, node (+23 more)

### Community 10 - "auth/controller.tsx"
Cohesion: 0.28
Nodes (14): changePassword(), changePasswordPage(), formatPasswordPolicyIssue(), getClientMeta(), legacyLogout(), login(), loginPage(), logout() (+6 more)

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

### Community 17 - "cms.test.ts"
Cohesion: 0.13
Nodes (25): createdPageIds, createdUserIds, createdPageIds, createdUserIds, activeCache, purgePageCache(), resetCmsCache(), router (+17 more)

### Community 18 - "models/cms.ts"
Cohesion: 0.13
Nodes (27): cmsPageKey(), getCmsCache(), AdminPageDetail, AdminPageSummary, mapPageRowToResolved(), mapSeedToResolvedPage(), PageRevisionSummary, resolveCollectionTemplate() (+19 more)

### Community 19 - "ADDED Requirements"
Cohesion: 0.09
Nodes (22): ADDED Requirements, Block Page Rendering Specification, Purpose, Requirement: Database-Backed Site Chrome Rendering, Requirement: Database-Driven Public Page and Campaign Slug Resolution, Requirement: Entity Detail Template Rendering, Requirement: Live Collection Hydration and Interactive Form Blocks, Requirement: Per-Block Schema Validation and Fault Isolation (+14 more)

### Community 20 - "admissions/controller.tsx"
Cohesion: 0.12
Nodes (17): apply(), submit(), admissionSchema, changePasswordSchema, createBatchSchema, createBlogSchema, createCourseSchema, createGallerySchema (+9 more)

### Community 21 - "Requirement: Unified Credential Sign-In and Role Workspace Routing"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Multi-Role Authentication Specification, Purpose, Requirement: Mandatory First-Login Password Change, Requirement: Revocable Server-Managed Sessions and Sign-Out, Requirement: Role-Based Workspace and Action Isolation, Requirement: Unified Credential Sign-In and Role Workspace Routing, Scenario: Administrator signs in and reaches admin console (+12 more)

### Community 22 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Page Publishing Specification, Purpose, Requirement: Administrator-Only Page and Chrome Studio Access, Requirement: Atomic Publication, Authorship Audit, and Cache Invalidation, Requirement: Campaign Page Creation and Reserved Route Guard, Requirement: Draft Block Composition, Reordering, and Optimistic Concurrency, Requirement: Live Draft Preview with Search Indexing Protection (+12 more)

### Community 23 - "models/lms.ts"
Cohesion: 0.09
Nodes (35): AspirantBatchProgress, AspirantPublishedScorecard, MarksEntryInputRow, MarksSheetEntry, SyllabusTopicItem, updateSyllabusTopicStatus(), AttendanceStatus, BatchRow (+27 more)

### Community 24 - "0002_multi_role_lms/up.sql"
Cohesion: 0.42
Nodes (10): "admissions", "batches", "enrollments", "exam_results", "exams", "materials", "notifications", "sessions" (+2 more)

### Community 25 - "users"
Cohesion: 0.33
Nodes (4): createdUserIds, seedRoleUser(), UserRole, users

### Community 45 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, @sdxc/lazy-frame, @sdxc/markdown, @sdxc/seo, @sdxc/strings, @sdxc/lazy-frame, @sdxc/markdown, @sdxc/seo (+1 more)

### Community 50 - "mail.tsx"
Cohesion: 0.12
Nodes (15): createPaartMailer(), CredentialEmailProps, credentialEmailSchema, formatRoleLabel(), getMailer(), localMailOutbox, NodeSmtpTransport, paartEmails (+7 more)

### Community 51 - "routes/index.ts"
Cohesion: 0.05
Nodes (74): exams(), index(), marks(), materials(), notifications(), progress(), requireAspirant(), AdminUser (+66 more)

### Community 52 - "Requirement: Unified Credential Sign-In and Role Workspace Routing"
Cohesion: 0.10
Nodes (20): Multi-Role Authentication Specification, Purpose, Requirement: Mandatory First-Login Password Change, Requirement: Revocable Server-Managed Sessions and Sign-Out, Requirement: Role-Based Workspace and Action Isolation, Requirement: Unified Credential Sign-In and Role Workspace Routing, Requirements, Scenario: Administrator signs in and reaches admin console (+12 more)

### Community 53 - "faculty/controller.tsx"
Cohesion: 0.14
Nodes (26): batchSyllabus(), batchSyllabusCreate(), batchSyllabusStatus(), examCreate(), examMarks(), examMarksImport(), examMarksSave(), examMarksTemplate() (+18 more)

### Community 54 - "middleware/auth.ts"
Cohesion: 0.16
Nodes (20): authSessionContext, enforcePasswordChange(), forbiddenResponse(), isPasswordChangeExempt(), PASSWORD_CHANGE_EXEMPT_PATHS, requestSessionMap, requireCmsAdmin(), requireRole() (+12 more)

### Community 55 - "models/materials.ts"
Cohesion: 0.12
Nodes (20): materialCreate(), createdBatchIds, createdMaterialIds, createdNotificationIds, createdUserIds, createdBatchIds, createdMaterialIds, createdNotificationIds (+12 more)

### Community 56 - "requireAdmin"
Cohesion: 0.17
Nodes (17): admissionProvision(), batchCreate(), courses(), galleryCreate(), materialCreate(), materialDelete(), settings(), settingsUpdate() (+9 more)

### Community 57 - "provisioning.test.ts"
Cohesion: 0.17
Nodes (14): createAdminSession(), createdAdmissionIds, createdBatchIds, createdUserIds, memoryOutbox, seedAdminSession(), createTestUser(), createPortalUser() (+6 more)

### Community 58 - "models/users.ts"
Cohesion: 0.24
Nodes (16): generateTemporaryPassword(), normalizeUserEmail(), revokeUserSessions(), sendAccountCredentialsEmail(), generateRollNumber(), ManagedUserItem, mapUserRow(), provisionAdmissionApplicant() (+8 more)

### Community 59 - "models/admissions.ts"
Cohesion: 0.25
Nodes (8): admissions(), admissionStatus(), listAdmissions(), mapAdmissionRow(), updateAdmissionStatus(), ADMISSION_STATUSES, AdmissionRow, AdmissionStatus

### Community 60 - "models/enquiries.ts"
Cohesion: 0.20
Nodes (9): enquiries(), enquiryStatus(), listEnquiries(), mapEnquiryRow(), updateEnquiryStatus(), enquiries, ENQUIRY_STATUSES, EnquiryRow (+1 more)

### Community 61 - "courseCreate"
Cohesion: 0.33
Nodes (6): blogCreate(), courseCreate(), slugify(), createBlog(), createCourse(), COURSE_CATEGORIES

### Community 62 - "PaartDb"
Cohesion: 0.31
Nodes (11): examPublish(), getDatabase(), PaartDb, transaction(), publishExamResults(), recomputeExamRanks(), resolveMigrationsDir(), runMigrations() (+3 more)

### Community 63 - "database.ts"
Cohesion: 0.11
Nodes (14): createdBatchIds, createdUserIds, outbox, LEGACY_WP_PAGE_MAP, legacyRedirectsMiddleware(), DEFAULT_CSP_DIRECTIVES, securityHeadersMiddleware(), databaseContext (+6 more)

### Community 64 - "saveExamMarks"
Cohesion: 0.83
Nodes (4): importExamMarksCsv(), sanitizeFormulaText(), saveExamMarks(), ATTENDANCE_STATUSES

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

### Community 73 - "listBatches"
Cohesion: 0.21
Nodes (15): batches(), index(), materials(), exams(), index(), materials(), notificationCreate(), notifications() (+7 more)

### Community 74 - "initializers/auth.ts"
Cohesion: 0.26
Nodes (12): loadSessionUser(), authenticateCredentials(), extractCookieValue(), getDummyPasswordHash(), hashSessionToken(), mapUserToSessionUser(), resolveSession(), createdUserIds (+4 more)

### Community 75 - "cms-actions.tsx"
Cohesion: 0.16
Nodes (13): computePreviewHref(), IdRouteContext, pageDraftBracketSchema, readFormInt(), readFormString(), renderEditorState(), RevisionRouteContext, siteChromeBracketSchema (+5 more)

### Community 76 - ".send"
Cohesion: 0.24
Nodes (5): connectSocket(), dotStuffMime(), sanitizeEnvelopeEmail(), SmtpLineReader, upgradeToTls()

### Community 77 - "cms-hydrator.ts"
Cohesion: 0.24
Nodes (12): BlogItem, HydrateBlocksOptions, HydratedCollections, HydratedPageResult, HydratorLoaders, GalleryItem, FaqCategory, FaqItem (+4 more)

### Community 78 - "server.ts"
Cohesion: 0.18
Nodes (9): closeDatabase(), clientDir, rootDir, RouterLike, server, shutdown(), ssrEntryPath, ssrModule (+1 more)

### Community 79 - "Decisions"
Cohesion: 0.17
Nodes (11): 1. Server-Managed Hashed Sessions + `@sdxc/crypto` `scrypt` Passwords, 2. Authorization Architecture with `@sdxc/authz` + Mandatory Password-Change Gate, 3. SMTP Email Delivery via `@sdxc/mail` + Zero-Dependency Node `node:net` / `node:tls` Transport, 4. Relational LMS Data Model (`0002_multi_role_lms`), 5. Pure SSR UI Architecture (`@sdxc/u` + `@sdxc/ui`), Context, Decisions, Design: Multi-Role Identity, SMTP Provisioning & LMS Portals (+3 more)

### Community 80 - "Design"
Cohesion: 0.18
Nodes (10): 1. Tier-2 Typed Block Registry over Relational Per-Block Tables or Raw AST JSON, 2. Two Page Contracts (`static_page` and `collection_template`) + `site_chrome` Singleton, 3. Curated Institutional Block Catalog + Selective Parallel Hydration, 4. Leveraging `@sdxc/*` Primitives for Publishing, Caching, and Preview, Context, Decisions, Design, Goals / Non-Goals (+2 more)

### Community 81 - "page-editor-page.tsx"
Cohesion: 0.31
Nodes (6): BLOCK_TYPE_LABELS, BlockType, AdminPageEditorPage(), renderBlockFields(), renderThreeColGrid(), renderTwoColGrid()

### Community 82 - "default-pages.ts"
Cohesion: 0.36
Nodes (8): DEPARTMENT_SELECTIONS, IMPACT_METRICS, ImpactMetric, STATE_RANK_HIGHLIGHTS, TRUST_INITIATIVES, TRUST_PILLARS, TRUST_PROFILE, TRUST_VISION_MISSION

### Community 83 - "Tasks"
Cohesion: 0.22
Nodes (8): 1. Dependencies, Configuration & Database Schema, 2. Multi-Role Authentication, Sessions & RBAC (`identity/multi-role-auth`), 3. Admin Account Provisioning & SMTP Delivery (`identity/account-provisioning`), 4. Faculty Workspace (`lms/faculty-workspace`), 5. Aspirant Portal (`lms/aspirant-portal`), 6. End-to-End Integration Verification & Knowledge Graph Sync, Tasks, Workflow follow-up

### Community 84 - "Proposal"
Cohesion: 0.25
Nodes (7): Capabilities, Impact, Modified Capabilities, New Capabilities, Proposal, What Changes, Why

### Community 85 - "Proposal"
Cohesion: 0.25
Nodes (7): Capabilities, Impact, Modified Capabilities, New Capabilities, Proposal, What Changes, Why

### Community 86 - "Tasks"
Cohesion: 0.25
Nodes (7): 1. Dependencies, Database Schema & Seed Manifests, 2. CMS Data Layer, Caching, Markdown & Visibility Engine (`cms/block-page-rendering`), 3. Institutional Block Catalog & Public SSR Routing (`cms/block-page-rendering`), 4. Admin Page Builder & Site Chrome Studio (`cms/page-publishing`), 5. End-to-End Publishing Verification & Knowledge Graph Sync, Tasks, Workflow follow-up

### Community 87 - "0003_server_driven_pages/up.sql"
Cohesion: 0.67
Nodes (3): "page_revisions", "pages", "site_chrome"

## Knowledge Gaps
- **386 isolated node(s):** `IdRouteContext`, `RevisionRouteContext`, `pageDraftBracketSchema`, `siteChromeBracketSchema`, `createdUserIds` (+381 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PaartDb` connect `PaartDb` to `saveExamMarks`, `admin/controller.tsx`, `requireAdmin`, `listBatches`, `initializers/auth.ts`, `auth/controller.tsx`, `cms.test.ts`, `models/cms.ts`, `routes/index.ts`, `faculty/controller.tsx`, `middleware/auth.ts`, `models/lms.ts`, `models/materials.ts`, `provisioning.test.ts`, `models/users.ts`, `database.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `Routes` connect `routes/index.ts` to `index.tsx`, `admin/controller.tsx`, `cms-responder.tsx`, `auth/controller.tsx`, `cms-actions.tsx`, `page-editor-page.tsx`, `admissions/controller.tsx`, `faculty/controller.tsx`, `database.ts`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `SmtpLineReader` connect `.send` to `mail.tsx`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `IdRouteContext`, `RevisionRouteContext`, `pageDraftBracketSchema` to the rest of the system?**
  _386 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06974921630094044 - nodes in this community are weakly interconnected._
- **Should `admin/controller.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10144927536231885 - nodes in this community are weakly interconnected._
- **Should `cms-responder.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.057124310288867254 - nodes in this community are weakly interconnected._