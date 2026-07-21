# Repository and Coding Standards

> **Classification:** Internal  
> **Authority:** Engineering standards authority  
> **Audience:** Founder and Cursor  
> **Status:** Founding MVP baseline  
> **Last reviewed:** 2026-07-20


## 1. Repository model

Use one repository for the SvelteKit application, Supabase migrations, automated tests and documentation. The founder owns all merges and production releases. Keep the structure feature-oriented inside stable technical boundaries rather than creating one folder per table or one global `utils` directory.

## 2. Recommended structure

```text
isuna/
├── src/
│   ├── app.d.ts
│   ├── app.html
│   ├── hooks.server.ts
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/                 # audited visual primitives
│   │   │   └── app/                # shared application components
│   │   ├── features/
│   │   │   ├── households/
│   │   │   │   ├── components/
│   │   │   │   ├── schemas.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── presentation.ts
│   │   │   ├── ledger/
│   │   │   ├── budgeting/
│   │   │   ├── reconciliation/
│   │   │   ├── planning/
│   │   │   ├── meetings/
│   │   │   └── reporting/
│   │   ├── domain/
│   │   │   ├── money/
│   │   │   ├── calculations/
│   │   │   ├── closing/
│   │   │   └── errors/
│   │   ├── server/
│   │   │   ├── auth/
│   │   │   ├── db/
│   │   │   │   ├── queries/
│   │   │   │   └── generated.types.ts
│   │   │   ├── services/
│   │   │   ├── providers/
│   │   │   ├── audit/
│   │   │   ├── logging/
│   │   │   └── validation/
│   │   ├── email/
│   │   │   └── templates/
│   │   ├── reports/
│   │   │   ├── view-models/
│   │   │   └── print-components/
│   │   └── shared/
│   │       ├── constants/
│   │       ├── formatters/
│   │       └── types/
│   └── routes/
│       ├── (public)/
│       ├── (auth)/
│       ├── (app)/
│       │   └── households/[householdId]/...
│       └── api/
│           └── webhooks/
├── static/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── database/
│   ├── e2e/
│   ├── fixtures/
│   └── helpers/
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   ├── seed.sql
│   └── tests/
├── docs/
│   └── Isuna MVP Documentation/
├── scripts/
├── .github/
│   ├── workflows/
│   ├── pull_request_template.md
│   └── ISSUE_TEMPLATE/
├── .env.example
├── package.json
├── pnpm-lock.yaml
└── README.md
```

### Placement rules

- **Routes:** orchestration, loading and form/action boundaries only. Avoid large business rules in `+page.server.ts`.
- **Feature modules:** feature-specific schemas, UI and presentation mapping that can be imported by routes.
- **Components:** visual interaction. They receive data/callbacks; they do not open arbitrary database connections.
- **Server-only services:** workflows spanning authorization, queries, calculations, audit and providers.
- **Database queries:** named functions in `$lib/server/db/queries/<domain>.ts`; return narrow typed rows/read models.
- **Validation schemas:** near the feature input contract; server is authoritative. Do not treat generated DB types as input validation.
- **Domain types/calculations:** framework-independent TypeScript with no Svelte/Supabase imports.
- **Auth helpers:** request identity and membership/permission functions under `$lib/server/auth`.
- **Email templates:** typed template input, no raw financial details unless explicitly required and reviewed.
- **PDF templates:** snapshot-specific view models and print components; no live queries inside components.
- **Tests:** colocated `.test.ts` is acceptable for small pure modules; cross-module and database/E2E tests remain in `tests/`.
- **Migrations:** one coherent change per timestamped file with comments and verification notes.
- **Documentation:** approved package under `docs/`; lightweight ADRs are not added unless a major decision cannot be represented in `open-decisions.md`.

## 3. Dependency direction

```text
routes/components -> feature presentation/schemas -> application services
application services -> domain + query/provider interfaces
database/provider implementations -> interfaces
domain -> no SvelteKit, browser, Supabase or provider dependency
```

Server modules may import domain modules. Domain modules never import server or UI modules. Browser-visible code never imports `$lib/server` or private environment variables.

## 4. TypeScript standards

- `strict: true`; do not weaken strictness to satisfy generated code.
- Avoid `any`. Use `unknown`, validate, then narrow.
- Prefer discriminated unions for states and results.
- Use `readonly` inputs/collections where mutation is not intended.
- Use branded/string types sparingly for IDs/currency when they prevent mistakes.
- Database `bigint` values become `bigint` or validated decimal strings; never unsafe `number`.
- Dates at boundaries are ISO strings or Temporal/date-library values under a documented strategy. Do not pass ambiguous locale strings.
- Exhaustive `switch` with `assertNever` for security/financial statuses.
- Functions expose explicit return types at public module boundaries.
- Avoid classes unless identity/lifecycle or error types make them clearer; plain functions/types suit calculations.

```ts
export function assertNever(value: never): never {
  throw new Error(`Unexpected variant: ${String(value)}`);
}
```

## 5. Svelte 5 standards

- Use current Svelte 5 syntax and official guidance; do not mix legacy patterns accidentally.
- Keep component state local; move cross-route server state to loads/actions/database, not global client stores.
- Derive values rather than synchronizing duplicate state.
- Props are typed; event/callback contracts are explicit.
- Prefer native forms and SvelteKit form actions with progressive enhancement for financial mutations.
- Do not perform authorization or authoritative calculations in a component.
- Avoid reactive effects that write financial data automatically without clear user intent and idempotency.
- Use snippets/composition consistently according to chosen component primitives.
- Every interactive component has keyboard/focus/error behaviour documented or inherited from an audited primitive.

## 6. SvelteKit standards

- `+page.server.ts` loads private data and defines form actions for page workflows.
- `+server.ts` is for APIs, webhooks, downloads and non-page protocols; it repeats auth/authorization.
- `hooks.server.ts` creates request context, auth, correlation IDs and safe error handling—not feature logic.
- Redirects/errors use SvelteKit helpers and mapped domain errors.
- Return minimal serializable data; convert bigint safely.
- Do not expose environment variables except intentionally `PUBLIC_` values.
- Sensitive pages avoid public caching.
- External webhook endpoints authenticate the provider, read raw body when signature verification requires it, and do not expect user cookies.
- Use `depends`/invalidation deliberately; do not refetch every dashboard module after minor local UI changes without need.

## 7. Naming

| Element | Convention | Example |
|---|---|---|
| Svelte components | PascalCase | `CloseReadinessPanel.svelte` |
| TypeScript files | kebab-case or stable domain naming | `close-month.ts` |
| Functions/variables | camelCase, action-oriented | `requireHouseholdRole` |
| Types/interfaces | PascalCase | `HouseholdMembership` |
| Constants | camelCase for scoped, UPPER_SNAKE for true environment/global constants | `maxCsvRows`, `MAX_UPLOAD_BYTES` |
| Routes | lowercase kebab | `/monthly-meeting` |
| DB | snake_case | `financial_snapshots` |
| Tests | behaviour description | `close-month.integration.test.ts` |
| Error codes | stable upper snake | `CLOSE_RECONCILIATION_REQUIRED` |

Names should state units: `amountMinor`, `annualRate`, `periodStart`, `asOfDate`.

## 8. Imports

- Prefer `$lib/...` aliases over deep relative paths.
- Group: platform/framework, third party, `$lib`, local, type-only.
- Use `import type` for types.
- No barrel file that creates cycles or hides server/browser boundaries. Narrow feature `index.ts` exports are acceptable after review.
- Never import a server module into code that may bundle for the browser.

## 9. Validation

Validation layers:

1. Browser/native attributes for immediate usability.
2. Zod/server schema for shape, length, enum, numeric/date parsing and bounds.
3. Authorization/membership for actor capability.
4. Database lookups and constraints for referential/business state.
5. Domain invariants for financial operations.

Return field errors without leaking internal IDs or another tenant’s existence. Normalize once using documented functions; preserve original descriptions where needed.

## 10. Error model

```ts
export type AppErrorCode =
  | 'VALIDATION_FAILED'
  | 'NOT_AUTHENTICATED'
  | 'NOT_AUTHORIZED'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'DEPENDENCY_UNAVAILABLE'
  | 'UNEXPECTED';

export class AppError extends Error {
  constructor(
    readonly code: AppErrorCode,
    message: string,
    readonly safeDetails?: Record<string, string>
  ) { super(message); }
}
```

- Expected validation/conflict errors are not reported as server crashes.
- Unexpected errors receive a correlation ID and sanitized Sentry event.
- Never show SQL, stack traces or provider payloads to users.
- Do not catch errors merely to return `null`; preserve the distinction between absent and failed.

## 11. Logging

Structured allowlisted fields only. A logger call should name operation and stable IDs, not serialize arbitrary objects:

```ts
logger.info('month_close_committed', {
  requestId,
  householdId,
  periodId,
  snapshotId
});
```

Use opaque IDs only where necessary. Never log `formData`, request headers, cookies, tokens, notes, transaction descriptions, CSV rows or report URLs.

## 12. Database access

- Prefer parameterized Supabase query builder or reviewed SQL/RPC.
- Query functions accept authorized context and return narrow projections.
- Avoid `select('*')` in production paths.
- Multi-record invariants use database transactions/RPC, not a chain of browser requests.
- RLS remains on even when server authorization exists.
- No service role in normal CRUD.
- Check and map every Supabase error; do not ignore `{ error }`.
- Generated types are regenerated after migrations and reviewed.
- Query changes include index/query-plan consideration.

## 13. Server actions

Each action follows:

```text
get verified auth -> parse form -> resolve/authorize household ->
call service -> map result/error -> return minimal response
```

An action names its intent (`createAccount`, `approveException`) and includes idempotency for operations where retries matter. Do not create one “save everything” action with many unrelated optional fields.

## 14. Comments and documentation

- Comment **why**, invariant or non-obvious external constraint—not line-by-line syntax.
- Financial formulas include source/definition and rule version.
- RLS policies/functions include threat/role intent.
- TODOs require issue/reference and consequence; no orphan TODOs in security paths.
- Public APIs/modules use concise TSDoc where it improves safe use.
- Update authoritative Markdown in the same PR as changed behaviour.

## 15. Dependencies

Add a dependency only when:

- native/platform functionality is insufficient;
- it materially reduces risk or effort;
- licence, maintenance and security are acceptable;
- bundle/server impact is understood;
- abstraction/exit cost is acceptable;
- tests cover the integration.

Version currency (OD-03):

- Prefer the newest **stable** (non-prerelease) release when adding or deliberately upgrading a package.
- Node.js follows the nodejs.org production recommendation (Active LTS); pin exact versions in `.nvmrc` and `package.json` `engines`.
- Pin pnpm via Corepack / `packageManager` and commit `pnpm-lock.yaml`; CI and local installs use the lockfile, not floating tags.
- Cursor must verify current official versions before suggesting packages and must not invent version numbers.
- Major or security-sensitive upgrades ship as reviewed PRs with tests—not silent drift or auto-merge without evidence.
- Alpha/beta/canary/RC defaults require founder-accepted technical debt with a repayment trigger.

Cursor must explain why a dependency is needed and alternatives considered. Do not add a general utility library for one trivial function.

## 16. Git workflow

### Branches

- `main` is protected and deployable.
- Short-lived branches: `feat/sprint-02-households`, `fix/rls-account-update`, `docs/close-policy`.
- The founder may use trunk-based small branches; avoid long-lived integration branches.

### Commits

Small coherent commits with imperative messages:

```text
feat(households): create owner membership transaction
fix(rls): prevent account household reassignment
test(close): cover duplicate idempotency key
docs(security): record export recent-auth rule
```

Never commit secrets, production data, generated exports or unexplained bulk AI changes.

### Pull requests

Even as sole developer, use PRs for reviewable checkpoints. PR includes outcome, screenshots where safe, migrations, tests run/results, manual checks, security/privacy impact, docs changed, rollout/rollback and open questions. Cursor may review, but founder approves and merges.

## 17. Environment variables

- Validate required server environment at startup or first use with safe errors.
- `PUBLIC_` only for values intentionally delivered to browser, such as public Supabase URL and publishable key.
- Service role, Stripe secret/webhook, Resend key and Sentry auth token are server/CI only.
- `.env.example` comments identify owner/purpose without values.
- Preview cannot use production database/secrets.

## 18. Migration standards

Every migration:

- has one purpose and timestamped name;
- is tested from clean database and from prior schema with representative data;
- creates constraints before exposing feature where possible;
- enables RLS/policies in the same safe sequence as table exposure;
- separates long backfill and validation when needed;
- avoids destructive irreversible change without export/backup plan;
- includes comments for security-definer functions and revokes default grants;
- is not edited after shared deployment—add a correcting migration;
- updates generated types and database documentation.

Migration review questions:

- Can this lock a large table?
- What happens to existing null/invalid rows?
- Does rollback lose data?
- Does an old app version work during rollout?
- Did ownership or RLS change?
- Could service role be avoided?
- Is the closed snapshot invariant preserved?
