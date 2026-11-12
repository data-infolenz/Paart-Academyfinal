# Page Publishing Specification

## Purpose

Defines the Administrator-only Page Builder and Site Chrome Studio for composing draft block layouts, previewing unpublished drafts safely, publishing atomically with authorship and optimistic concurrency, and rolling back to prior revisions.

## ADDED Requirements

### Requirement: Administrator-Only Page and Chrome Studio Access

The system SHALL restrict all page management, block editing, site-chrome editing, draft preview, publish, and rollback endpoints (`/admin/pages*`, `/admin/chrome*`, and `?preview=draft`) exclusively to authenticated `admin` users.

#### Scenario: Faculty or aspirant denied access to page publishing studio

- **WHEN** an authenticated `faculty` or `aspirant` user sends a `GET` or `POST` request to `/admin/pages` or `/admin/chrome`
- **THEN** the system denies the request with HTTP `403 Forbidden`

#### Scenario: Non-administrator request with draft preview query ignores draft state

- **WHEN** an unauthenticated visitor or non-administrator requests `GET /about?preview=draft`
- **THEN** the system ignores the preview flag and renders only the currently published page state

### Requirement: Campaign Page Creation and Reserved Route Guard

The system SHALL allow Administrators to create new custom pages with normalized URL slugs while rejecting slugs that collide with existing pages or reserved application prefixes (`/admin`, `/faculty`, `/portal`, `/login`, `/logout`, `/account`, `/enquiries`, `/healthz`, `/readyz`, `/sitemap.xml`, `/llms.txt`).

#### Scenario: Administrator creates a new exam campaign page

- **WHEN** an authenticated `admin` submits `POST /admin/pages` with title `"TNPSC Group IV 2027 Batch"` and a unique unreserved slug
- **THEN** the system creates the page in `draft` status with normalized slug `/tnpsc-group-iv-2027-batch` and redirects to its block composer

#### Scenario: Reserved route path rejected during page creation

- **WHEN** an authenticated `admin` attempts to create a page with slug `/admin` or `/portal`
- **THEN** the system rejects the submission with HTTP `422` validation feedback and creates no page record

### Requirement: Draft Block Composition, Reordering, and Optimistic Concurrency

The system SHALL allow Administrators to add, edit, toggle, reorder, duplicate, and remove typed blocks on a page's `draft` manifest without altering the live `published` manifest, validating block inputs against schemas and rejecting stale concurrent edits when the submitted version does not match the current database version.

#### Scenario: Saving or reordering draft blocks leaves live published page untouched

- **WHEN** an authenticated `admin` modifies block copy or moves a block's position in `POST /admin/pages/:id/draft` without publishing
- **THEN** the system persists the updated `draft` blocks, increments the page version, and continues serving the unchanged `published` blocks to public visitors

#### Scenario: Stale version submission rejected to prevent lost updates

- **WHEN** an authenticated `admin` submits a draft mutation carrying an outdated page `version` number
- **THEN** the system responds with HTTP `409 Conflict` (or validation error banner) without overwriting newer edits

### Requirement: Live Draft Preview with Search Indexing Protection

The system SHALL allow authenticated Administrators to preview a page's unpublished `draft` blocks both inside an embedded live preview frame in `/admin/pages/:id` and at the page's URL with `?preview=draft`, emitting `robots="noindex, nofollow"`, `Cache-Control: private, no-store`, and a visible draft-preview indicator.

#### Scenario: Administrator inspects unpublished draft via preview mode

- **WHEN** an authenticated `admin` loads `GET /about?preview=draft` (directly or via the `/admin/pages/:id` preview frame)
- **THEN** the system renders the page's `draft` blocks with `noindex, nofollow` metadata, `private, no-store` caching headers, and an Administrator draft-preview bar

### Requirement: Atomic Publication, Authorship Audit, and Cache Invalidation

The system SHALL publish a page's validated `draft` blocks to `published` status atomically, record the publishing Administrator's `user.id` and timestamp, append an immutable snapshot to revision history, and immediately invalidate cached SSR responses for that page and `/sitemap.xml` / `/llms.txt`.

#### Scenario: Administrator publishes draft changes to live site

- **WHEN** an authenticated `admin` triggers `POST /admin/pages/:id/publish`
- **THEN** the system copies `draft` blocks into `published` blocks, sets page status to `published`, records the Administrator's `user.id` on the new revision row, purges the page cache entry, and serves the new content immediately on the next public `GET` request

### Requirement: Revision History and One-Click Rollback

The system SHALL list prior published revisions for each page with version number, timestamp, author, and change summary, and SHALL allow an Administrator to roll back a page to any prior revision in one action.

#### Scenario: Administrator rolls back a page to a previous revision

- **WHEN** an authenticated `admin` triggers `POST /admin/pages/:id/revisions/:revisionId/restore`
- **THEN** the system restores that revision's blocks and SEO settings into both `draft` and `published` states, records a new rollback revision attributed to the Administrator, and invalidates the SSR page cache

### Requirement: Site Chrome Studio Publishing

The system SHALL allow Administrators at `/admin/chrome` to edit and publish the global utility bar, primary navigation links, trust profile contact/hours details, and footer link columns, validating every link label/URL pair and purging cached public layouts upon save.

#### Scenario: Administrator updates header navigation and footer columns

- **WHEN** an authenticated `admin` submits valid navigation and footer items to `POST /admin/chrome`
- **THEN** the system persists the updated site-chrome configuration with the Administrator's `user.id`, invalidates the cached site-chrome state, and reflects the updated navigation across all public pages immediately
