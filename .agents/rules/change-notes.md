---
trigger: always_on
description: Automatically add change notes in .changes folders for any modified package or addon.
---

## Change Notes (.changes)

Whenever you modify code, assets, or configuration in any package (`apps/*`, `packages/*`, or `addons/*`), you **MUST** record a change note file in each affected package's `.changes/` directory before marking the task complete.

### How to Create Change Notes

Run the CLI non-interactively from the monorepo root:

```bash
bun change <package-dir[,package-dir...]> <patch|minor|major> "<summary>"
```

*Examples:*
- Single package: `bun change apps/chat-remix patch "Fix message composer focus tracking"`
- Multiple packages: `bun change apps/chat-remix,packages/ui-remix minor "Add session validation helper"`
- Addon: `bun change addons/soundboard patch "Optimize audio caching"`

### Direct File Creation
Alternatively, create `<package-dir>/.changes/<bump>.<slug>.md`:
- File naming: `<bump>.<slug>.md` where `<bump>` is `patch`, `minor`, or `major` and `<slug>` is a kebab-case descriptor.
- File content: Line 1 should be a concise summary. If multiple items, follow with bullet points.

### Bump Type Guidelines
- `patch`: Bug fixes, performance optimizations, internal refactoring, dependency updates, styling adjustments (non-breaking)
- `minor`: New user-facing features, new API endpoints, new addon SDK APIs, new components, backward-compatible schema additions
- `major`: Breaking changes to public APIs, database schema removals/incompatibilities, or addon SDK contract changes

### Audience & Tone Guidelines (release.config.json)

Change note summaries become customer-facing release notes during automated releases. Categorize packages based on `release.config.json`:

#### 1. Private / Internal Packages (`independentPackages`)
- **Packages**: `apps/license`, `apps/store`, `packages/store-contracts` (defined in `independentPackages`).
- **Audience**: Internal engineering and infrastructure team only (never distributed to customers).
- **Tone**: Technical, internal, and security-specific terminology is fine:
  - *Example:* "Implement HMAC-SHA256 signature verification for Store license issuing"
  - *Example:* "Update Stripe webhook idempotency keys and error handling"

#### 2. Customer-Distributed Packages (`corePackages`, `addonsPattern`, `publicNpmPackages`)
- **Packages**:
  - `corePackages` & customer apps/packages: `apps/chat-remix`, `apps/chat`, `packages/addon-sdk-remix`, `packages/addon-sdk`, `packages/ui-remix`, `packages/ui`, `packages/locale-remix`, `packages/locale`, `packages/editor-remix`, `packages/editor`, `packages/runtime-remix`, `packages/runtime`, `packages/realtime`, `packages/db`, `packages/shared`, etc. (shipped to customers / Docker).
  - `addonsPattern`: `addons/*` (downloadable marketplace add-on packages).
  - `publicNpmPackages`: `@jchat/runtime-remix`, `@jchat/addon-sdk-remix`, `@jchat/create-addon-remix`, `@jchat/runtime`, `@jchat/addon-sdk`, `@jchat/create-addon` (published to public npm).
- **Audience**: Customers, site administrators, and external developers reading public release notes, GitHub Releases, and npm changelogs.
- **Tone**: Must use **common, user-friendly, professional language**:
  - **No sensitive security specifics or exploit descriptions**: Never expose internal cryptographic keys, proprietary anti-tamper mechanics, or raw exploit vectors in customer changelogs.
  - **Focus on customer impact, capability, or stability**:
    - ❌ *Avoid:* "Block ZIP upload exploit where attacker removes entitlement.json and bypasses HMAC check"
    - ✅ *Prefer:* "Enhance commercial add-on licensing and installation security validation"
    - ❌ *Avoid:* "Change AddonServerContext generic to allow Kysely subtyping without any"
    - ✅ *Prefer:* "Fix TypeScript type compatibility for custom add-on database contexts"
    - ❌ *Avoid:* "Refactor sliding-window Lua script for Redis rate limiter"
    - ✅ *Prefer:* "Optimize message rate limiting and server responsiveness"

### Rules
- If multiple packages are modified in the same task, create a change note for **every** affected package.
- Do not create change notes for documentation-only edits in `docs/` or tooling config changes that do not affect package build artifacts.
- A task is not done until change notes are present for all modified packages.
- **Do NOT manually bump versions or run `version-packages`**: Version bumping, changelog generation, and releases are fully automated by GitHub Actions when PRs merge to `master`. Agents only record change notes.
- **Commit Only After Confirmation**: **Never** run `git commit` autonomously. Always leave modifications uncommitted in the working tree and commit only after explicit user confirmation.
- **Audit & Format Only On User Commit Instruction**: Do NOT run `bun audit:changes` or `bun format` repeatedly on routine changes. Run `bun audit:changes` and `bun format` **ONLY** when the user explicitly instructs you to commit.
