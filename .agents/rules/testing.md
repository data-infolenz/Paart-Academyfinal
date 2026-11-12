---
trigger: always_on
description: Testing requirements and patterns across models, controllers, and configuration for PAART Academy.
---

## Testing Guidelines

Add or update tests whenever modifying observable domain behavior, business logic, security boundaries, or data persistence.

---

### 1. Forbidden Test Targets (Zero Tolerance)

Agents MUST NEVER create or maintain unit tests for the following categories:

| Target Category | Policy | Reason & Enforcement |
| :--- | :---: | :--- |
| **Vite UI Components & Resources (`resources/**/*`, `app/components/**/*`)** | ❌ **FORBIDDEN** | UI templates rely on Vite plugins (`@pitlane/assets`, clientEntry, CSS). Pure unit test runners run outside Vite and will fail. UI is validated strictly by `npm run typecheck` and `npm run build`. |
| **Constants, Dictionaries & Enums** | ❌ **FORBIDDEN** | Never test that a constant equals its own literal (e.g. `expect(PORTAL_ROLES.admin).toBe("admin")` or `expect(KEY).toBe("...")`). TypeScript enforces constant values at compile-time. |
| **Upstream & 3rd-Party Library Re-Exports** | ❌ **FORBIDDEN** | Never test that `@sdxc/*`, `remix`, or `lucide-react` functions exist (e.g. `expect(typeof UI.Button).toBe("function")`). Upstream libraries are already 100% tested by their authors. |
| **Presentational JSX Templates & Styling** | ❌ **FORBIDDEN** | Never write unit tests asserting that HTML tags render specific CSS classes or text strings. Visual rendering is verified via production builds and typecheck. |
| **Trivial Internal Helpers & Types** | ❌ **FORBIDDEN** | Do not create dedicated unit tests for 2-line helpers or simple type guards; test them through the feature's main service, model, or action test. |

---

### 2. Permitted & Required Test Targets

Tests in this repository are strictly focused on business logic, data models, and API contracts:

| Change Type | Test File Pattern | Required Test Coverage |
| :--- | :--- | :--- |
| **Route Actions & API Handlers** | `app/actions/**/*.test.ts` | Happy path, RBAC authorization guard (401/403), input validation (400/422). |
| **Domain Models & Services** | `app/models/**/*.test.ts` | Business logic, admissions review transitions, LMS batch enrollment, CMS block hydration, user provisioning. |
| **Initializers & System Config** | `app/initializers/**/*.test.ts` | Config schema parsing, URL normalization, password hashing/salting, mailer transport. |
| **Database Schema & Models** | Integrated in model tests | Soft-delete filtering (`deleted_at IS NULL`), transaction rollbacks, relational integrity. |

---

### 3. Feature & API Testing Conventions

- **In PAART Academy**:
  - Unit and integration tests live in `app/**/*.test.{ts,tsx}` alongside their domain models, actions, or initializers.
  - Test framework is **Vitest** configured in `vite.config.ts`.
  - Execute tests using `npm test` or `npx vitest run <path>`.
  - Fast execution for single file: `npx vitest run app/initializers/config.test.ts`.

---

### 4. Integration Test Rules

- **Seeded Data**: When testing database queries, use seeded fixtures or scoped test entities with known states rather than unanchored random data.
- **Fixture Lifecycle**: Ensure test isolation; clean up created test entities or utilize transactional rollbacks so test runs do not leave orphaned rows.
- **Mocking External Transports**: Always mock external network calls (e.g. SMTP email delivery, SMS gateways) using in-memory or spy transports.

---

### 5. Pragmatic Test Granularity (Anti-Bloat Standards)

- **Do NOT create a test file for every single file created or modified.**
- **Feature-Level Over Micro-Unit Tests**: Focus test coverage on the **main entry point** of a feature (e.g. `users.test.ts`, `admissions.test.ts`, or `config.test.ts`) instead of creating separate tests for every minor helper, type definition, or sub-component.
- **Agent Decision Invariant**:
  - If a file is in `resources/` or `app/components/` $\rightarrow$ **STOP. Do NOT write a unit test.**
  - If a test only asserts `typeof X === "function"` or `X === "constant"` $\rightarrow$ **STOP. Do NOT write the test.**
  - If a file is a database schema definition $\rightarrow$ **STOP. Verify via model or endpoint test.**
