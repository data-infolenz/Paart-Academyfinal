---
trigger: always_on
description: Addon development rules, sandboxing boundaries, and i18n requirements.
---

## Addon Development Rules

### 1. Sandboxing & Boundaries
- Addons live under `addons/`.
- Addons must be completely isolated extensions: they interact **only** via `@jchat/addon-sdk-remix` host APIs and shared externals (`./ui`, `./u`, `./icons`, `./events`, `./contracts`).
- Addons must **never** directly mutate core database schemas, internal core API routes, or core WebSocket handlers.

### 2. Event Namespacing
- All addon custom events must follow canonical namespacing:
  `addon:<addonId>:<eventName>`
  *(e.g., `addon:soundboard:playAudio`, `addon:tubescan:searchQuery`)*

### 3. Internationalization (i18n)
- Every addon must provide an English base localization (`src/locales/en.json`).
- The other 19 host languages (`ar`, `bg`, `de`, `el`, `es`, `fr`, `he`, `hi`, `hr`, `kn`, `ml`, `nl`, `pt`, `ro`, `ru`, `ta`, `te`, `tr`, `ur`) are optional and automatically fall back to English at runtime.
- Any provided non-English translation files must contain valid JSON and match the keys declared in `en.json`.
- All translation keys must pass validation via:
  ```bash
  bun check:translations
  ```

### 4. Development Workflow
- Initialize or scaffold addon workspace: `bun create-addon-remix`
- Synchronize local addons: `bun addons:sync`
- Run local addon development: `bun addons:dev`

### 5. Addon Database Tables & Schema
- Addon tables live exclusively in the `"addons"` schema.
- All table names and column names must strictly use lowercase `snake_case`.
- Table names must be prefixed with the addon identifier (e.g., `addons.<addon_id>_<entity>` like `addons.glimpse_stories`, `addons.djdrop_tracks`).
- In TypeScript, Kysely interfaces (`src/db.ts`) define `camelCase` properties, which are automatically translated to `snake_case` PostgreSQL columns via the host's `CamelCasePlugin`.

### 6. Addon Settings Standards
- Addon configuration properties in `manifest.ts`, frontend settings state, and backend `getConfig(siteId)` MUST strictly use pure `camelCase` (e.g., `youtubeApiKey`, `maxResults`, `cooldownSeconds`, `enabledSounds`, `publisherId`).
- Never use `snake_case` for addon configuration keys.
- Do not introduce dual-property fallback logic; maintain clean, idiomatic `camelCase` contracts across the entire addon stack.

