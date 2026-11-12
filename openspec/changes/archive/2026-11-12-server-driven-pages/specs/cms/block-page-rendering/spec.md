# Block Page Rendering Specification

## Purpose

Defines how public marketing pages, custom campaign landing pages, entity detail templates, and global site chrome are resolved from database block manifests, validated, hydrated with live academy records, and rendered on the server.

## ADDED Requirements

### Requirement: Database-Driven Public Page and Campaign Slug Resolution

The system SHALL resolve all core public routes (`/`, `/about`, `/courses`, `/materials`, `/gallery`, `/blogs`, `/faq`, `/contact`, `/admissions`) and published custom campaign slugs (`/:slug`) from stored page manifests, returning HTTP `404` when a requested slug does not exist or is in unpublished `draft` status for non-preview requests.

#### Scenario: Visitor loads a published core or custom campaign page

- **WHEN** an unauthenticated visitor requests `GET /`, `GET /about`, or a published custom campaign path such as `GET /tnpsc-group-4-2027`
- **THEN** the system renders the page's ordered `published` blocks inside the institutional site layout with HTTP `200`

#### Scenario: Unpublished draft campaign slug returns 404 to public visitors

- **WHEN** an unauthenticated visitor or non-administrator requests `GET /unpublished-campaign` whose page status is `draft`
- **THEN** the system responds with HTTP `404` and does not expose draft block content

### Requirement: Entity Detail Template Rendering

The system SHALL render dynamic detail routes (`/courses/:slug` and `/blogs/:slug`) by combining the active entity record for `:slug` with the corresponding published collection template blocks, returning HTTP `404` if the target course or article is missing or inactive.

#### Scenario: Visitor loads an active course detail page through the collection template

- **WHEN** a visitor requests `GET /courses/tnpsc-group-4` for an active course
- **THEN** the system binds the course record into the published course-detail template blocks and renders the full institutional course page with `Course` structured data

#### Scenario: Inactive or unknown entity slug returns 404

- **WHEN** a visitor requests `GET /courses/unknown-course` or `GET /blogs/unpublished-post`
- **THEN** the system responds with HTTP `404` and renders the institutional not-found state

### Requirement: Database-Backed Site Chrome Rendering

The system SHALL render the global public top utility bar, header navigation links, call-to-action buttons, trust profile metadata, and multi-column footer from stored site-chrome configuration while preserving role-aware portal links for authenticated users.

#### Scenario: Updated header navigation link appears across all public pages

- **WHEN** an Administrator publishes a new link or updated trust phone/hours entry in site chrome and a visitor requests any public page
- **THEN** the public header, utility bar, and footer reflect the stored site-chrome entries without a code change

### Requirement: Per-Block Schema Validation and Fault Isolation

The system SHALL validate each stored block against its typed block schema before rendering, skipping any disabled or malformed block with a server warning rather than failing the entire page with HTTP `500`.

#### Scenario: Malformed block payload is isolated without crashing the page

- **WHEN** a stored page manifest contains one invalid block alongside valid blocks
- **THEN** the system logs a structured validation warning, omits only the invalid block, and renders all remaining valid blocks with HTTP `200`

### Requirement: Live Collection Hydration and Interactive Form Blocks

The system SHALL hydrate data-driven blocks (`courses`, public `materials`, `blogs`, `gallery`, enquiry forms, and admission forms) from live database tables on the server while enforcing honeypot spam protection and public-only material visibility.

#### Scenario: Course and public material blocks reflect live database updates

- **WHEN** a page contains a course-catalog block and a study-materials block
- **THEN** the system populates active courses matching the block's category/limit filter and includes only published materials with `public` visibility

#### Scenario: Enquiry and admission blocks preserve anti-spam validation

- **WHEN** a visitor views or submits an enquiry or admission block rendered on a server-driven page
- **THEN** the system issues fresh honeypot fields on render and validates submissions through the existing enquiry and admission handlers

### Requirement: Safe Rich Text and Conditional Block Visibility

The system SHALL render rich prose block fields from sanitized Markdown ASTs without raw HTML script injection, and SHALL evaluate optional per-block visibility rules (such as date windows or signed-in user roles) on the server before emitting HTML.

#### Scenario: Script tags or unsafe URLs inside Markdown prose are neutralized

- **WHEN** a prose or announcement block contains raw `<script>` markup or `javascript:` links
- **THEN** the rendered HTML omits executable script elements and unsafe URL schemes

#### Scenario: Expired or role-restricted block is hidden from non-matching visitors

- **WHEN** a block defines a visibility window that has ended or restricts display to authenticated `aspirant` users
- **THEN** the server omits that block from the HTML response for unauthenticated visitors

### Requirement: SEO Metadata, Structured Data, Sitemap, and Offline Resilience

The system SHALL generate page `<title>`, meta description, canonical URL, and JSON-LD (`EducationalOrganization` and `FAQPage` when FAQ blocks are active) from the resolved page manifest, include all published indexable pages in `/sitemap.xml` and `/llms.txt`, and fall back to built-in institutional seed manifests if the database is temporarily unreachable.

#### Scenario: Published campaign page with FAQ block updates structured data and sitemap

- **WHEN** a published indexable page includes an FAQ block
- **THEN** the page response emits `FAQPage` JSON-LD for those items and `/sitemap.xml` plus `/llms.txt` list the page's canonical URL

#### Scenario: Public core pages remain available during transient database outage

- **WHEN** the database connection is unavailable during a `GET /` or `GET /about` request
- **THEN** the system renders the built-in institutional fallback page manifest instead of an unhandled `500` error
