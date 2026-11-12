---
trigger: always_on
description: Testing requirements and patterns across API, frontend, and integration tests.
---

## Testing Guidelines

Add or update tests whenever modifying observable domain behavior, business logic, security boundaries, or data persistence.

---

### 1. Forbidden Test Targets (Zero Tolerance)

Agents MUST NEVER create or maintain unit tests for the following categories:

| Target Category | Policy | Reason & Enforcement |
| :--- | :---: | :--- |
| **Vite UI Components & Resources (`resources/**/*`)** | ❌ **FORBIDDEN** | Files in `resources/components/`, `resources/views/`, and `resources/layouts/` rely on Vite plugins (`@pitlane/assets`, clientEntry, CSS). `bun test` runs outside Vite and will fail. UI is validated strictly by `bun typecheck` and `bun build`. |
| **Constants, Dictionaries & Enums** | ❌ **FORBIDDEN** | Never test that a constant equals its own literal (e.g. `expect(CHAT_DIALOG_IDS.auth).toBe("auth-dialog-modal")` or `expect(KEY).toBe("...")`). TypeScript enforces constant values at compile-time. |
| **Upstream & 3rd-Party Library Re-Exports** | ❌ **FORBIDDEN** | Never test that `@sdxc/*`, `remix`, or `lucide-react` functions exist (e.g. `expect(typeof UI.Button).toBe("function")`). Upstream libraries are already 100% tested by their authors. |
| **Presentational JSX Templates & Styling** | ❌ **FORBIDDEN** | Never write unit tests asserting that HTML tags render specific CSS classes or text strings. Visual rendering is verified via production builds and typecheck. |
| **Trivial Internal Helpers & Types** | ❌ **FORBIDDEN** | Do not create dedicated unit tests for 2-line helpers or type guards; test them through the feature's main service or controller test. |

---

### 2. Permitted & Required Test Targets

Tests in this repository are strictly focused on business logic and API contracts:

| Change Type | Test File Pattern | Required Test Coverage |
| :--- | :--- | :--- |
| **New or Modified Route Controller** | `controller.test.ts` | Happy path, auth guard (401/403), RFC 9457 Problem Details input validation (400/422). |
| **New or Modified Domain Service** | `service.test.ts` / `*.test.ts` | Pure business logic, pricing/calculations, permission gates, background job handlers. |
| **Database Schema & Models** | Integrated in service/controller tests | Soft-delete filtering (`deletedAt IS NULL`), transaction rollbacks, multi-tenant site isolation. |
| **Reusable SDK / Library Core Utilities** | `*.test.ts` in `packages/*` | Branch-heavy parsing, cryptography, token signing, or protocol normalization. |

---

### 3. Feature & API Testing Conventions (`apps/chat-remix`, `apps/store`)

- **In JChat Application Engine**:
  - `controller.test.ts` lives alongside feature routes (`app/http/controllers/<name>/controller.test.ts` or `app/actions/<name>/route.test.ts`).
  - Execute route actions via `router.fetch(new Request(...))`.
  - For site-scoped routes in Chat Remix, always provide seeded site slugs (e.g. `http://localhost/site-slug/...`).
  - Asset resolution during controller tests uses the graceful fallback resolver when running outside Vite (`manifest.mode === "unavailable"`).

---

### 4. Integration Test Rules

- **Seeded Data Only**: **Never** generate random UUIDs in integration tests. Always use seeded fixtures (`seedTestData()`) because foreign keys and permission resolvers query real PostgreSQL records.
- **Fixture Lifecycle**: Tests must call `await seedTestData()` before test execution and `await cleanupTestData()` in `afterAll` / teardown routines.
- **Transactions & Isolation**: Use `withRollbackTx()` for database tests that should not leave persistent test rows committed behind.

---

### 5. Pragmatic Test Granularity (Anti-Bloat Standards)

- **Do NOT create a test file for every file created or modified.**
- **Feature-Level Over Micro-Unit Tests**: Focus test coverage on the **main entry point** of a feature (e.g. `controller.test.ts` or `service.test.ts`) instead of creating separate tests for every helper, utility, type definition, schema file, or sub-component.
- **Agent Decision Invariant**:
  - If a file is in `resources/` $\rightarrow$ **STOP. Do NOT write a unit test.**
  - If a test only asserts `typeof X === "function"` or `X === "constant"` $\rightarrow$ **STOP. Do NOT write the test.**
  - If a file is a Drizzle schema or `@sdxc/data-model` schema $\rightarrow$ **STOP. Verify via endpoint or service test.**
