# PAART Academy — Clean & Standard Remix 3 Web Application

Official server-rendered web application for **PAART Academy** (_Puliyangudi Academic & Achievements Resource Trust_, est. 22 December 2018, Puliyangudi, Tenkasi District, Tamil Nadu).

Built strictly with **Node.js (`>=24.11.0`) + `npm`**, **Vite+ (`vite-plus@1.6.0`)**, **Remix 3 (`remix@3.2.0`)**, **`remix/data-table/postgres` (`pg`)**, and **WCAG AA semantic UI (`@sdxc/ui` + `@sdxc/u`)** following the exact Remix 3 architectural conventions of `Jchat/apps/store`.

---

## Key Architectural Highlights

- **100% Remix 3 SSR + Minimal Islands**:
  - Typed central route map in `routes/web.ts` (`remix/routes`).
  - Composable middleware pipeline in `app/initializers/router.ts` (`asyncContext`, `@sdxc/logger`, legacy WordPress `301` redirects, PostgreSQL context, compression, CSP & HSTS security headers, rate limiting, `formData`, `@pitlane/assets`, SSR `render`, and PBKDF2/HMAC admin session auth).
  - Lazy-loaded domain controllers in `app/http/controllers/*`.
  - Zero heavy client SPA bundle — only progressive enhancement islands (`ThemeToggle` & `@sdxc/ui` interactive primitives) hydrated via `bootstrap/browser.ts`.
- **PostgreSQL via `remix/data-table/postgres` (`pg`)**:
  - Typed schema definitions in `database/schema/*.ts` (`courses`, `materials`, `blogs`, `gallery_items`, `enquiries`, `admissions`, `site_settings`).
  - Versioned SQL migrations in `database/migrations/0001_initial/` (`up.sql` & `down.sql`).
  - Resilient read models in `app/models/*.ts` that query PostgreSQL and gracefully fall back to verified PAART Academy seed data when PostgreSQL is unreachable in local previews.
- **SEO, Accessibility & Legacy URL Preservation**:
  - Semantic HTML5 landmarks, WCAG AA contrast tokens (`resources/css/theme.css`), zero neumorphism.
  - Schema.org JSON-LD (`EducationalOrganization`, `Course`, `Article`, `FAQPage`), `/sitemap.xml`, `/llms.txt`, `/healthz`, and `/readyz`.
  - Automatic HTTP `301` redirects for legacy live `paart.in` WordPress URLs (`/?page_id=32` -> `/courses`, `/?page_id=33` -> `/contact`, `/?page_id=322` -> `/about`, `/?post_type=tribe_events` -> `/gallery`).

---

## Getting Started

```bash
cd Paart

# 1. Install dependencies using npm
npm install

# 2. Configure environment variables
cp .env.example .env

# 3. Run PostgreSQL migrations & seed verified PAART data (requires running PostgreSQL)
npm run db:migrate
npm run db:seed

# 4. Start development server (http://localhost:4100)
npm run dev
```

---

## Production Build, Tests & Server

```bash
# Unified Vite+ check (format + type-aware lint + typecheck via `vp check`)
npm run check

# Run automated Vitest suite via Vite+ (`vp test`)
npm test

# Build SSR + Client bundles via Vite+ (`vp build`)
npm run build

# Lint & Format via Vite+ (`vp lint` / `vp fmt`)
npm run lint
npm run format

# Start production Node HTTP server (remix/node-fetch-server)
npm start
```
