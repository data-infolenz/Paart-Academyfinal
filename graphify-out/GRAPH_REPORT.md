# Graph Report - Paart-Academyfinal  (2026-11-12)

## Corpus Check
- 128 files · ~64,705 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 972 nodes · 2699 edges · 68 communities (41 shown, 27 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.59)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `025b94bf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- routes/index.ts
- admin/controller.tsx
- public/controller.tsx
- config/courses.ts
- app.ts
- TypeScript Path Aliases & Config
- dependencies
- schema/index.ts
- Requirement: Unified Credential Sign-In and Role Workspace Routing
- scripts
- initializers/auth.ts
- Architecture & OpenSpec Constraints
- Browser Hydration & Frame Prefetch
- PostgreSQL Initial Migration
- Node Module Path Resolver
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Decisions
- Tasks
- Proposal
- models/lms.ts
- 0002_multi_role_lms/up.sql
- database.ts
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
- @sdxc/seo
- @sdxc/sitemap
- @sdxc/u
- @sdxc/ui
- @sdxc/uuid
- mail.tsx
- SessionUser
- faculty.tsx
- faculty/controller.tsx
- middleware/auth.ts
- seed.ts
- requireAdmin
- provisioning.test.ts
- models/users.ts
- models/admissions.ts
- models/enquiries.ts
- formDataToObject
- PaartDb
- router.ts
- getExamMarksSheet
- LmsValidationError
- authMiddleware
- SmtpTransport

## God Nodes (most connected - your core abstractions)
1. `Routes` - 53 edges
2. `AdminUser` - 50 edges
3. `PaartDb` - 43 edges
4. `acadSerif()` - 37 edges
5. `SessionUser` - 35 edges
6. `SiteSettings` - 35 edges
7. `requireAdmin()` - 34 edges
8. `acadCard()` - 31 edges
9. `getSiteSettings()` - 28 edges
10. `CourseItem` - 27 edges

## Surprising Connections (you probably didn't know these)
- `Academic Institution UI Design Constraint` --semantically_similar_to--> `WCAG AA Semantic UI (@sdxc/ui + @sdxc/u)`  [INFERRED] [semantically similar]
  openspec/config.yaml → README.md
- `OpenSpec Verification & Graphify Maintenance Gate` --semantically_similar_to--> `Vite+ (vp) Build & Verification Toolchain`  [INFERRED] [semantically similar]
  openspec/config.yaml → README.md
- `FacultyLayoutProps` --references--> `SessionUser`  [EXTRACTED]
  resources/layouts/faculty.tsx → app/initializers/auth.ts
- `SessionUser` --references--> `UserRole`  [EXTRACTED]
  app/initializers/auth.ts → database/schema/users.ts
- `SessionUser` --references--> `UserStatus`  [EXTRACTED]
  app/initializers/auth.ts → database/schema/users.ts

## Import Cycles
- 3-file cycle: `app/http/controllers/public/controller.tsx -> app/http/controllers/public/llms.ts -> app/initializers/router.ts -> app/http/controllers/public/controller.tsx`
- 3-file cycle: `app/http/controllers/public/controller.tsx -> app/http/controllers/public/sitemap.ts -> app/initializers/router.ts -> app/http/controllers/public/controller.tsx`

## Hyperedges (group relationships)
- **PAART Academy Remix 3 SSR Platform Architecture** — readme_paartacademy, readme_remix3ssr, readme_middlewarepipeline, readme_postgresdatalayer, readme_seolegacyredirects [EXTRACTED 1.00]
- **PAART Academy Institutional UI & Styling Governance** — readme_wcagsemanticui, openspec_config_academicdesignconstraint, openspec_config_tsxutilitystyling [INFERRED 0.95]
- **Vite+ Build Verification & Graphify Sync Workflow** — openspec_config_specdrivenschema, openspec_config_validationgate, readme_viteplustoolchain [INFERRED 0.95]

## Communities (68 total, 27 thin omitted)

### Community 0 - "routes/index.ts"
Cohesion: 0.06
Nodes (99): AdminUser, BlogItem, CourseItem, GalleryItem, MaterialItem, DEFAULT_SETTINGS, SiteSettings, CourseDetailSpec (+91 more)

### Community 1 - "admin/controller.tsx"
Cohesion: 0.09
Nodes (27): batchToggle(), blogDelete(), blogToggle(), courseDelete(), courseToggle(), changePasswordSchema, createBatchSchema, createBlogSchema (+19 more)

### Community 2 - "public/controller.tsx"
Cohesion: 0.06
Nodes (61): apply(), submit(), success(), index(), show(), index(), show(), about() (+53 more)

### Community 3 - "config/courses.ts"
Cohesion: 0.15
Nodes (15): gallery(), galleryDelete(), deleteGalleryItem(), listGalleryItems(), mapGalleryRow(), mapSeedGallery(), CourseCategory, SEED_GALLERY (+7 more)

### Community 4 - "app.ts"
Cohesion: 0.09
Nodes (23): rateLimitMiddleware(), closeDatabase(), getDatabase(), transaction(), paartLogger, clientDir, rootDir, RouterLike (+15 more)

### Community 5 - "TypeScript Path Aliases & Config"
Cohesion: 0.06
Nodes (37): ./app/*, bootstrap/**/*, ./config/*, ./database/*, dist, DOM, DOM.Iterable, ES2024 (+29 more)

### Community 6 - "dependencies"
Cohesion: 0.29
Nodes (7): dependencies, pg, @pitlane/assets, @sdxc/security-headers, pg, @pitlane/assets, @sdxc/security-headers

### Community 7 - "schema/index.ts"
Cohesion: 0.13
Nodes (21): NewAdmissionRow, NewBlogRow, CourseRow, NewCourseRow, NewEnquiryRow, NewGalleryRow, col, InferInsert (+13 more)

### Community 8 - "Requirement: Unified Credential Sign-In and Role Workspace Routing"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Multi-Role Authentication Specification, Purpose, Requirement: Mandatory First-Login Password Change, Requirement: Revocable Server-Managed Sessions and Sign-Out, Requirement: Role-Based Workspace and Action Isolation, Requirement: Unified Credential Sign-In and Role Workspace Routing, Scenario: Administrator signs in and reaches admin console (+12 more)

### Community 9 - "scripts"
Cohesion: 0.06
Nodes (31): devDependencies, @types/node, @types/pg, typescript, vite, vite-plus, engines, node (+23 more)

### Community 10 - "initializers/auth.ts"
Cohesion: 0.20
Nodes (20): changePassword(), formatPasswordPolicyIssue(), getClientMeta(), legacyLogout(), login(), loginPage(), logout(), authenticateCredentials() (+12 more)

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

### Community 17 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): Account Provisioning Specification, ADDED Requirements, Purpose, Requirement: Account Suspension and Reactivation, Requirement: Closed Administrator-Only Account Creation, Requirement: One-Click Aspirant Provisioning from Admissions, Requirement: SMTP Welcome Email and Credential Re-Issuance, Scenario: Administrator prevented from self-suspension (+8 more)

### Community 18 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Aspirant Portal Specification, Purpose, Requirement: Aspirant Progress and Performance Overview, Requirement: Enrolled and Public Study Materials Access, Requirement: Published Test Marks and Scorecard History, Requirement: Targeted Notifications Feed, Requirement: Upcoming Exam Schedule View (+8 more)

### Community 19 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Faculty Workspace Specification, Purpose, Requirement: Aspirant Exam Marks Entry, CSV Import, and Result Publication, Requirement: Batch Syllabus Progress Tracking, Requirement: Mock and OMR Exam Scheduling, Requirement: Targeted Academic Notifications, Requirement: Visibility-Scoped Study Material Publishing (+8 more)

### Community 20 - "Decisions"
Cohesion: 0.17
Nodes (11): 1. Server-Managed Hashed Sessions + `@sdxc/crypto` `scrypt` Passwords, 2. Authorization Architecture with `@sdxc/authz` + Mandatory Password-Change Gate, 3. SMTP Email Delivery via `@sdxc/mail` + Zero-Dependency Node `node:net` / `node:tls` Transport, 4. Relational LMS Data Model (`0002_multi_role_lms`), 5. Pure SSR UI Architecture (`@sdxc/u` + `@sdxc/ui`), Context, Decisions, Design: Multi-Role Identity, SMTP Provisioning & LMS Portals (+3 more)

### Community 21 - "Tasks"
Cohesion: 0.22
Nodes (8): 1. Dependencies, Configuration & Database Schema, 2. Multi-Role Authentication, Sessions & RBAC (`identity/multi-role-auth`), 3. Admin Account Provisioning & SMTP Delivery (`identity/account-provisioning`), 4. Faculty Workspace (`lms/faculty-workspace`), 5. Aspirant Portal (`lms/aspirant-portal`), 6. End-to-End Integration Verification & Knowledge Graph Sync, Tasks, Workflow follow-up

### Community 22 - "Proposal"
Cohesion: 0.25
Nodes (7): Capabilities, Impact, Modified Capabilities, New Capabilities, Proposal, What Changes, Why

### Community 23 - "models/lms.ts"
Cohesion: 0.10
Nodes (31): AspirantBatchProgress, AspirantPublishedScorecard, createNotification(), MarksEntryInputRow, NotificationItem, updateSyllabusTopicStatus(), AttendanceStatus, BatchRow (+23 more)

### Community 24 - "0002_multi_role_lms/up.sql"
Cohesion: 0.42
Nodes (10): "admissions", "batches", "enrollments", "exam_results", "exams", "materials", "notifications", "sessions" (+2 more)

### Community 25 - "database.ts"
Cohesion: 0.19
Nodes (8): createdUserIds, seedRoleUser(), databaseContext, databaseMiddleware(), db, globalForPaartDb, UserRole, users

### Community 50 - "mail.tsx"
Cohesion: 0.07
Nodes (25): createdBatchIds, createdUserIds, outbox, connectSocket(), createPaartMailer(), CredentialEmailProps, credentialEmailSchema, dotStuffMime() (+17 more)

### Community 51 - "SessionUser"
Cohesion: 0.12
Nodes (29): exams(), index(), marks(), materials(), notifications(), progress(), requireAspirant(), SessionUser (+21 more)

### Community 52 - "faculty.tsx"
Cohesion: 0.12
Nodes (22): BatchSummaryItem, ExamItem, MarksSheetEntry, SyllabusTopicItem, ManagedUserItem, ExamStatus, SyllabusTopicStatus, FACULTY_NAV_ITEMS (+14 more)

### Community 53 - "faculty/controller.tsx"
Cohesion: 0.19
Nodes (25): batchSyllabus(), batchSyllabusCreate(), batchSyllabusStatus(), examCreate(), examMarks(), examMarksTemplate(), examPublish(), exams() (+17 more)

### Community 54 - "middleware/auth.ts"
Cohesion: 0.15
Nodes (22): changePasswordPage(), authSessionContext, enforcePasswordChange(), forbiddenResponse(), isPasswordChangeExempt(), loadSessionUser(), PASSWORD_CHANGE_EXEMPT_PATHS, redirectToLogin() (+14 more)

### Community 55 - "seed.ts"
Cohesion: 0.13
Nodes (19): createdBatchIds, createdMaterialIds, createdNotificationIds, createdUserIds, createdBatchIds, createdMaterialIds, createdNotificationIds, createdUserIds (+11 more)

### Community 56 - "requireAdmin"
Cohesion: 0.14
Nodes (20): admissionProvision(), admissions(), batches(), blogs(), courses(), index(), materialDelete(), materials() (+12 more)

### Community 57 - "provisioning.test.ts"
Cohesion: 0.18
Nodes (13): createdAdmissionIds, createdBatchIds, createdUserIds, memoryOutbox, seedAdminSession(), createTestUser(), createPortalUser(), createTestUser() (+5 more)

### Community 58 - "models/users.ts"
Cohesion: 0.28
Nodes (14): generateTemporaryPassword(), normalizeUserEmail(), revokeUserSessions(), sendAccountCredentialsEmail(), generateRollNumber(), mapUserRow(), provisionAdmissionApplicant(), provisionUserAccount() (+6 more)

### Community 59 - "models/admissions.ts"
Cohesion: 0.21
Nodes (10): admissionStatus(), AdmissionItem, updateAdmissionStatus(), ADMISSION_STATUSES, AdmissionRow, AdmissionStatus, AdminAdmissionsPage(), AdminAdmissionsPageProps (+2 more)

### Community 60 - "models/enquiries.ts"
Cohesion: 0.20
Nodes (12): enquiries(), enquiryStatus(), EnquiryItem, listEnquiries(), mapEnquiryRow(), updateEnquiryStatus(), enquiries, ENQUIRY_STATUSES (+4 more)

### Community 61 - "formDataToObject"
Cohesion: 0.17
Nodes (13): batchCreate(), blogCreate(), courseCreate(), galleryCreate(), materialCreate(), settingsUpdate(), formDataToObject(), slugify() (+5 more)

### Community 62 - "PaartDb"
Cohesion: 0.30
Nodes (11): PaartDb, createBatch(), publishExamResults(), recomputeExamRanks(), createMaterial(), deleteMaterial(), listAllMaterials(), listMaterialsForAspirant() (+3 more)

### Community 63 - "router.ts"
Cohesion: 0.22
Nodes (6): LEGACY_WP_PAGE_MAP, legacyRedirectsMiddleware(), DEFAULT_CSP_DIRECTIVES, securityHeadersMiddleware(), remix/router, RouterTypes

### Community 64 - "getExamMarksSheet"
Cohesion: 0.48
Nodes (7): examMarksImport(), examMarksSave(), getExamMarksSheet(), importExamMarksCsv(), sanitizeFormulaText(), saveExamMarks(), ATTENDANCE_STATUSES

## Knowledge Gaps
- **251 isolated node(s):** `createdUserIds`, `createdBatchIds`, `createdAdmissionIds`, `memoryOutbox`, `createdUserIds` (+246 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Routes` connect `routes/index.ts` to `admin/controller.tsx`, `public/controller.tsx`, `initializers/auth.ts`, `SessionUser`, `faculty.tsx`, `faculty/controller.tsx`, `models/lms.ts`, `models/admissions.ts`, `models/enquiries.ts`, `router.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `AdminUser` connect `routes/index.ts` to `initializers/auth.ts`, `faculty.tsx`, `middleware/auth.ts`, `models/admissions.ts`, `models/enquiries.ts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `PaartDb` connect `PaartDb` to `getExamMarksSheet`, `admin/controller.tsx`, `public/controller.tsx`, `app.ts`, `initializers/auth.ts`, `SessionUser`, `faculty/controller.tsx`, `middleware/auth.ts`, `models/lms.ts`, `requireAdmin`, `provisioning.test.ts`, `models/users.ts`, `seed.ts`, `database.ts`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `createdUserIds`, `createdBatchIds`, `createdAdmissionIds` to the rest of the system?**
  _251 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `routes/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06295589720570081 - nodes in this community are weakly interconnected._
- **Should `admin/controller.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09247311827956989 - nodes in this community are weakly interconnected._
- **Should `public/controller.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0594679186228482 - nodes in this community are weakly interconnected._