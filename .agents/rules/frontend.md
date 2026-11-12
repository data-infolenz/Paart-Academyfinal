---
trigger: always_on
description: JChat Application Engine component architecture, client entry boundaries, and styling standards.
---

## Frontend Architectural Rules & Component Boundaries

All frontend code in `apps/chat-remix/app/`, `apps/store/resources/`, `apps/store/app/http/controllers/`, `packages/ui-remix/`, and `packages/ui/` MUST strictly follow these standards:

### 1. JChat Application Engine Component Architecture & Client Entry Boundaries

| Layer | Path | Responsibility |
| :--- | :--- | :--- |
| **Feature Controllers** | `app/http/controllers/*`, `app/actions/*` | HTTP/HTML routes, validation, Problem Details, renders views |
| **Server Page Views** | `resources/views/*`, `page.tsx` | Server-only `<Document>` shell, top bars, renders `clientEntry` |
| **Client Entry Islands** | `resources/components/*`, `portal.tsx` | Hydrated `clientEntry(import.meta.url, ...)` interactive islands |
| **App Shared UI** | `resources/layouts/*`, `app/ui/*` | App-wide shells (`Document`, `ThemeToggle`, `LanguageSwitcher`) |
| **Primitive UI Library** | `@jchat/ui-remix/*` | 100% domain-agnostic UI components, `/u`, `/icons` |

- **Strict Server `page.tsx` vs `clientEntry` Island Separation (No `node:async_hooks` in Browser Bundles)**:
  - Any file containing `clientEntry(import.meta.url, ...)` is bundled for the browser by Vite.
  - **NEVER import `Document` or any module that transitively imports `remix/middleware/async-context` (`node:async_hooks`), database repositories, or server secrets inside a `clientEntry` file**. Doing so causes `[createFrame] Failed to load module ... TypeError: AsyncLocalStorage is not a constructor` in the browser.
  - Place `<Document>` in a dedicated server-only file (e.g. `resources/layouts/document.tsx` / `page.tsx`) and import `clientEntry` islands from separate files.
  - Route controllers must always render the server `<Document>` / `<*Page />` component (never bare `clientEntry` directly) so full `<!DOCTYPE html>` SSR documents are returned.
- **Purity of `entry.ts` / `bootstrap/browser.ts`**:
  - Strictly a framework runner (`run()`, module loader, frame resolver) and Vite HMR script.
  - **Never add feature logic, DOM event listeners, scrollspy tracking, clipboard handlers, or ad-hoc polyfills to `entry.ts` or `bootstrap/browser.ts`**.
- **Self-Contained Component Interactivity (`clientEntry`)**:
  - Encapsulate component-specific DOM events inside the component using `clientEntry` with `mix={[ on("event", ...), ref(...) ]}`.
  - Always bind cleanup signals (`{ signal }`) in `ref` callbacks to prevent event listener leaks upon unmount.
- **Serializable Props Requirement**:
  - `clientEntry` enforces `SerializableProps` at compile-time.
  - **Never pass complex objects with non-serializable properties (such as entity models containing `Date` fields like `User`) directly as props to a `clientEntry`**. Pass serializable primitives, booleans, or ISO strings.
- **Leverage `@jchat/ui-remix` / `@jchat/ui-remix/*` Components, Overlays & Mixins**:
  - Import UI components, mixins, and utilities exclusively from `@jchat/ui-remix` or `@jchat/ui-remix/*` — never directly from `@sdxc/ui` in app code.
  - Use built-in accessible `@jchat/ui-remix` components (`<Button>`, `<Dialog>`, `<Dialog.Close>`, `<Modal>`, `<Alert>`, `<Card>`, `<Form>`, `<TextField>`, `<Input>`, `<Label>`, `<Checkbox>`, `<RadioGroup>`, `<Select>`, `<Avatar>`, `<Badge>`, `<Heading>`, `<Text>`, `<Separator>`, `<Menu>`, `<Popover>`, `<Spinner>`, etc.) rather than hand-rolling raw HTML primitives.
  - Open/close `<Dialog>` / `<Modal>` declaratively via native Invoker Commands (`commandfor="dialog-id"` and `command="show-modal"` / `command="close"`).
  - **Type-Safe Navigation Links via `route.href(params, { searchParams })`**: When configuring `href` props on `<Link>`, `<LinkButton>`, `<Tabs.Tab>`, or action redirects, always pass query parameters via `{ searchParams }` (e.g. `routes.dashboard.catalog.href(undefined, { searchParams: { tab: "addons" } })`). Never use manual string interpolation with `?` or `&`.
  - **Never apply `u.hstack` or `u.vstack` directly to `<Dialog>` or `<Modal>`**: Applying flex display utilities (`display: flex`) directly to `<Dialog>` overrides browser native `display: none` / `:open` user-agent styling and prevents dynamic `open` attributes from being handled implicitly. Always place flex layouts (`u.vstack` / `u.hstack`) on an inner container (e.g., an interior `<div>`) inside the dialog rather than on the root `<Dialog>` element.
  - Decompose sub-components below the exported component (exported functions first).
  - Use `@jchat/ui-remix` mixins (e.g. `hotkey("mod+k")`) directly in `mix` arrays rather than adding manual `window.addEventListener("keydown")` listeners.
- **Styling, `u.hstack` / `u.vstack`, Design Tokens & Responsive Design (`@jchat/ui-remix/u`)**:
  - Style components inline with `import * as u from "@jchat/ui-remix/u"` in the `mix` array rather than adding custom CSS classes to `theme.css`.
  - **Always use `u.hstack` and `u.vstack` for Flex Layouts**: Use `u.hstack({ gap, align, justify })` or `u.vstack({ gap, align, justify })` instead of combining individual flex, gap, and align utilities. Never attach flex layouts directly to `<Dialog>` or `<Modal>` roots so dynamic `open` attributes are handled implicitly by the browser; nest an inner flex container instead.
  - Use `@jchat/ui-remix/u` design tokens (`u.bg()`, `neutral.tint`, `brand.tint`, `brand.solid`, `brand.on-solid`, `neutral.muted`, `u.border("neutral")`, `u.surface()`) and `u.colorMix("oklab", ...)`.
  - Use logical spacing mixins (`u.pis`, `u.pie`, `u.mis`, `u.mie`, `u.pbs`, `u.pbe`, `u.pi`, `u.pb`).
  - Prefer container queries (`u.at(...)`, `u.atMax(...)`) over media queries inside container hosts.
  - **Modern Control Cursor Standard (Zero `u.cursor("pointer")` on Buttons)**:
    - In accordance with modern web and desktop HIG standards (W3C, Apple HIG, Windows Fluent), buttons and action controls (`<Button>`, native `<button>`, `input[type="button"]`, `input[type="submit"]`, `[role="button"]`) deliberately use `cursor: default` (arrow pointer), NOT `cursor: pointer` (pointing hand).
    - `cursor: pointer` is reserved exclusively for hyperlinks (`<a>` / `<Link>`).
    - Disabled controls automatically receive `cursor: not-allowed`, and busy/pending controls receive `cursor: wait` via `@layer base` and `@sdxc/ui` components.
    - **NEVER manually attach `u.cursor("pointer")` to `<Button>`, `<button>`, `<a>`, `<Link>`, `<summary>`, or `[role="button"]`**.
    - Reserve `u.cursor(...)` strictly for non-native interactive elements (such as `<label>` tags acting as selectable radio cards or drop zones) or transient state indicators (`u.cursor("grab")`/`grabbing` for drag handles).

---

### 2. Icons & Translations

- **Icons**:
  - In JChat Application Engine apps and `*-remix` packages, import icons exclusively from `@jchat/ui-remix/icons` (or `@jchat/addon-sdk-remix/icons` in addons).
  - In shared packages (`packages/ui`), import via `@jchat/ui`.
- **Translations**:
  - JChat Application Engine uses `@jchat/locale-remix` (Unicode MessageFormat 2, `createTranslator(locale)`, `@jchat/locale-remix/middleware`, `@jchat/locale-remix/ui`).
  - Always verify 20-language parity with `bun check:translations`.

---
