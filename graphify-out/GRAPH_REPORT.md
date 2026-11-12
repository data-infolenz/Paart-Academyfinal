# Graph Report - Paart-Academyfinal  (2026-11-12)

## Corpus Check
- 92 files · ~35,280 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 626 nodes · 1554 edges · 23 communities
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.59)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `02739e78`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AdminUser
- admin/controller.tsx
- public/controller.tsx
- database.ts
- academic-ui.tsx
- TypeScript Path Aliases & Config
- Remix 3 & @sdxc Dependencies
- models/courses.ts
- Requirement: Unified Credential Sign-In and Role Workspace Routing
- Package Scripts & Vite+ Tooling
- Admin Session Authentication
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
- `AcademicCalloutBandProps` --references--> `SiteSettings`  [EXTRACTED]
  resources/components/academic-ui.tsx → app/models/settings.ts
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

## Communities (23 total, 0 thin omitted)

### Community 0 - "AdminUser"
Cohesion: 0.09
Nodes (60): AdminUser, SessionPayload, BlogItem, CourseItem, GalleryItem, DEFAULT_SETTINGS, SiteSettings, acadCard() (+52 more)

### Community 1 - "admin/controller.tsx"
Cohesion: 0.06
Nodes (64): admissions(), admissionStatus(), blogCreate(), blogDelete(), blogs(), blogToggle(), courseCreate(), courseDelete() (+56 more)

### Community 2 - "public/controller.tsx"
Cohesion: 0.07
Nodes (50): apply(), submit(), success(), index(), show(), index(), show(), about() (+42 more)

### Community 3 - "database.ts"
Cohesion: 0.07
Nodes (32): LEGACY_WP_PAGE_MAP, legacyRedirectsMiddleware(), rateLimitMiddleware(), DEFAULT_CSP_DIRECTIVES, securityHeadersMiddleware(), closeDatabase(), databaseContext, databaseMiddleware() (+24 more)

### Community 4 - "academic-ui.tsx"
Cohesion: 0.16
Nodes (31): DEPARTMENT_SELECTIONS, IMPACT_METRICS, ImpactMetric, STATE_RANK_HIGHLIGHTS, TRUST_INITIATIVES, TRUST_PILLARS, TRUST_PROFILE, TRUST_VISION_MISSION (+23 more)

### Community 5 - "TypeScript Path Aliases & Config"
Cohesion: 0.06
Nodes (37): ./app/*, bootstrap/**/*, ./config/*, ./database/*, dist, DOM, DOM.Iterable, ES2024 (+29 more)

### Community 6 - "Remix 3 & @sdxc Dependencies"
Cohesion: 0.05
Nodes (37): dependencies, pg, @pitlane/assets, @pitlane/vite-plugin-remix, remix, @sdxc/assets-middleware, @sdxc/catch-response-middleware, @sdxc/health (+29 more)

### Community 7 - "models/courses.ts"
Cohesion: 0.07
Nodes (50): AdmissionItem, mapAdmissionRow(), findBlogBySlug(), mapBlogRow(), mapSeedBlog(), findCourseBySlug(), listAllCourses(), mapCourseRow() (+42 more)

### Community 8 - "Requirement: Unified Credential Sign-In and Role Workspace Routing"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Multi-Role Authentication Specification, Purpose, Requirement: Mandatory First-Login Password Change, Requirement: Revocable Server-Managed Sessions and Sign-Out, Requirement: Role-Based Workspace and Action Isolation, Requirement: Unified Credential Sign-In and Role Workspace Routing, Scenario: Administrator signs in and reaches admin console (+12 more)

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
Nodes (11): 1. Server-Managed Hashed Sessions + `@sdxc/crypto` `scrypt` Passwords, 2. Authorization Architecture with `@sdxc/authz` + Mandatory Password-Change Gate, 3. SMTP Email Delivery via `@sdxc/mail` + Thin Node `nodemailer` SMTP Transport, 4. Relational LMS Data Model (`0002_multi_role_lms`), 5. Pure SSR UI Architecture (`@sdxc/u` + `@sdxc/ui`), Context, Decisions, Design: Multi-Role Identity, SMTP Provisioning & LMS Portals (+3 more)

### Community 21 - "Tasks"
Cohesion: 0.22
Nodes (8): 1. Dependencies, Configuration & Database Schema, 2. Multi-Role Authentication, Sessions & RBAC (`identity/multi-role-auth`), 3. Admin Account Provisioning & SMTP Delivery (`identity/account-provisioning`), 4. Faculty Workspace (`lms/faculty-workspace`), 5. Aspirant Portal (`lms/aspirant-portal`), 6. End-to-End Integration Verification & Knowledge Graph Sync, Tasks, Workflow follow-up

### Community 22 - "Proposal"
Cohesion: 0.25
Nodes (7): Capabilities, Impact, Modified Capabilities, New Capabilities, Proposal, What Changes, Why

## Knowledge Gaps
- **181 isolated node(s):** `sessionUserContext`, `LEGACY_WP_PAGE_MAP`, `DEFAULT_CSP_DIRECTIVES`, `phoneSchema`, `SessionPayload` (+176 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminUser` connect `AdminUser` to `admin/controller.tsx`, `Admin Session Authentication`, `academic-ui.tsx`, `models/courses.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `Routes` connect `AdminUser` to `admin/controller.tsx`, `public/controller.tsx`, `database.ts`, `academic-ui.tsx`, `models/courses.ts`, `Admin Session Authentication`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `getSiteSettings()` connect `public/controller.tsx` to `AdminUser`, `admin/controller.tsx`, `Admin Session Authentication`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `sessionUserContext`, `LEGACY_WP_PAGE_MAP`, `DEFAULT_CSP_DIRECTIVES` to the rest of the system?**
  _181 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AdminUser` be split into smaller, more focused modules?**
  _Cohesion score 0.08861082737487232 - nodes in this community are weakly interconnected._
- **Should `admin/controller.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.057971014492753624 - nodes in this community are weakly interconnected._
- **Should `public/controller.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07049180327868852 - nodes in this community are weakly interconnected._