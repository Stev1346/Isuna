# MVP Implementation Playbook

> **Classification:** Internal  
> **Authority:** Implementation sequence authority  
> **Audience:** Founder and Cursor  
> **Status:** Founding MVP baseline  
> **Last reviewed:** 2026-07-21


## How to use this playbook

This is a map, not generated application code. For the current sprint:

1. Read the feature’s authoritative product, architecture, security and design documents.
2. Confirm prerequisites and open decisions.
3. Ask Cursor to explain and break down the sequence.
4. Implement **one numbered step** yourself.
5. Run the commands and manual check.
6. Share code/output with Cursor for focused review.
7. Add the appropriate test before advancing.
8. Update the playbook only when the architecture or sequence genuinely changes.

A route/module name is an expected design direction, not a requirement to create every file immediately. Prefer a small vertical slice and refactor shared components after demonstrated reuse.

## Global implementation contract

Every household data feature follows:

```text
verified identity -> bounded input validation -> active membership/role ->
RLS-protected query or reviewed transaction -> domain invariant ->
safe response -> audit/monitoring where required
```

Every financial value follows:

```text
user/localized text -> validated parser -> bigint minor units + currency ->
domain calculation -> bigint/decimal-safe storage -> localized display
```

Every closed report follows:

```text
open source records -> readiness recheck -> atomic immutable snapshot ->
snapshot-only view model -> private versioned PDF
```

## Authentication

- **Feature purpose:** Establish a verified identity and protected session boundary.
- **Relevant documents:** master-prd; authentication-multitenancy-and-rls; security plan; auth stories; open-decisions (OD-19).
- **Dependencies:** Foundation, Supabase project and redirect/email config.
- **Concepts to understand:** SSR cookies and claims (`getClaims` / `getUser` / `getSession`), hooks/locals, form actions, OAuth callback, safe redirects, email verification gate.
- **Checkpoint 1 approved (2026-07-21):** See open-decisions Decision changed and OD-19. Implement against that contract; do not reopen without a decision update.

### Recommended implementation sequence

1. Create the Supabase browser client with public configuration.
2. Create the request-scoped server client using the current SSR cookie adapter.
3. Define `App.Locals` and a verified `getAuthContext` contract (`getClaims()`; `emailVerified`; optional `getUser()` for freshness).
4. Configure `hooks.server.ts` to create context and sanitized error correlation.
5. Create profile migration, own-profile RLS, Auth insert trigger + idempotent ensure, and generated types.
6. Create registration Zod schema and page/action.
7. Add verification callback and safe local return handling.
8. Create sign-in and sign-out.
9. Create recovery request and password-update flow.
10. Add Google OAuth and collision/callback tests.
11. Protect `(app)` routes at `/app` (verified email required) and sensitive cache behaviour.
12. Add unit, RLS and Playwright auth tests.

### Expected shape

- **Routes:** `/(auth)/register`, `/sign-in`, `/forgot-password`, `/auth/callback` (or confirm), `/account/password`, protected `(app)` with empty shell **`/app`**.
- **Server modules:** `server/auth/supabase-server.ts`, `server/auth/context.ts`, profile queries/services.
- **Schemas:** Registration, sign-in, reset and redirect schemas.
- **Database changes:** Profiles table/RLS/trigger only (`user_id` PK; defaults `en-CA` / `America/Edmonton`).
- **UI components:** AuthField, PasswordField, AuthForm, verification/error states.
- **Authorization:** Verified session + verified email (OD-19) for `(app)`; user owns profile only; no service role on this path.
- **Validation:** Bounded fields; generic enumeration response; allowlisted return paths.
- **Required tests:** Unit schemas; profile RLS; expiry/sign-out/direct route/unverified block E2E.
- **Manual verification:** Register, verify, refresh, sign out, back button, reset expired token, unverified cannot open `/app`.
- **Security review:** No token logs; CSRF/origin/callback review; no service role.
- **Completion criteria:** All auth stories pass and later code has one stable auth context.

### Cursor prompt

```text
I am implementing Authentication as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Profiles

- **Feature purpose:** Store minimal application identity/preferences without duplicating Auth secrets.
- **Relevant documents:** database model; auth guide; privacy plan; open-decisions Sprint 2 Checkpoint 1.
- **Dependencies:** Authentication.
- **Concepts to understand:** Auth metadata versus application profile; own-data RLS; trigger + idempotent ensure.

### Recommended implementation sequence

1. Confirm minimal fields/purposes (`user_id`, display name, `en-CA`, `America/Edmonton`).
2. Create trigger-based profile creation with idempotent ensure.
3. Add own-profile query/update service.
4. Create account/profile page.
5. Test another user cannot read/update private profile fields.

### Expected shape

- **Routes:** `/(app)/account/profile` (under verified `(app)` gate).
- **Server modules:** `server/db/queries/profiles.ts`, `server/services/profile-service.ts`.
- **Schemas:** Display name, locale, timezone.
- **Database changes:** Profiles table + Auth insert trigger; own-user RLS only.
- **UI components:** Profile form and status.
- **Authorization:** User can manage own profile; household member display uses narrow view later.
- **Validation:** Lengths, locale/timezone allowlists.
- **Required tests:** RLS + form action + duplicate profile.
- **Manual verification:** Create/update with two users.
- **Security review:** No email enumeration; deletion linkage.
- **Completion criteria:** One profile per auth user and safe member presentation.

### Cursor prompt

```text
I am implementing Profiles as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Households

- **Feature purpose:** Create the tenant root and owner membership transactionally.
- **Relevant documents:** master PRD; database; RLS; threat model.
- **Dependencies:** Authentication/profile.
- **Concepts to understand:** Shared-schema tenancy, role model, transaction/RPC, last-owner invariant.

### Recommended implementation sequence

1. Create household/member migrations and enums.
2. Add composite keys/indexes and RLS helpers.
3. Implement transactional create-household operation.
4. Create server permission helper and tests.
5. Create household selection and switcher.
6. Create settings update with protected currency rules.
7. Implement member removal/ownership safeguards.

### Expected shape

- **Routes:** `/(app)/households/new`, `/households/[householdId]/settings`.
- **Server modules:** Household queries, membership/permission service.
- **Schemas:** Create/update household schemas.
- **Database changes:** Households, household_members, audit events.
- **UI components:** HouseholdForm, Switcher, MemberList.
- **Authorization:** Active membership every request; Owner protected operations.
- **Validation:** Locale/currency/status and no unsafe ownership change.
- **Required tests:** Full CRUD matrix with Household A/B.
- **Manual verification:** Create two households, switch, direct foreign IDs, remove editor.
- **Security review:** RLS before exposure; no shared password model.
- **Completion criteria:** Owner/editor tenant boundary proven.

### Cursor prompt

```text
I am implementing Households as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Invitations

- **Feature purpose:** Create secure single-use membership onboarding.
- **Relevant documents:** RLS; database; security/threat; invitation stories.
- **Dependencies:** Households, email interface.
- **Concepts to understand:** Opaque token hashing, expiry, concurrency/idempotency, minimal pre-auth disclosure.

### Recommended implementation sequence

1. Create invitation table and partial unique indexes.
2. Generate strong token and store only hash.
3. Implement owner create/resend/revoke with rate limits.
4. Render/send minimal invitation email through fake provider.
5. Create accept page that authenticates before details.
6. Implement atomic accept function/service.
7. Handle existing member, mismatch, expiry, reuse and concurrent clicks.
8. Add Resend test integration later without changing domain contract.

### Expected shape

- **Routes:** `/households/[id]/members`, `/invite/[token]`.
- **Server modules:** Invitation service, token utility, email provider/template.
- **Schemas:** Invite email/role and token acceptance.
- **Database changes:** Invitations + membership/audit transaction.
- **UI components:** InviteForm, InvitationList, AcceptState.
- **Authorization:** Owner creates/revokes; invitee only accepts valid intended token.
- **Validation:** Normalized email, role allowlist, expiry.
- **Required tests:** Concurrency, reused/wrong token, Editor denied, rate.
- **Manual verification:** Invite second synthetic user in private browser.
- **Security review:** Token not logged; email contains no finances.
- **Completion criteria:** One acceptance creates one active membership.

### Cursor prompt

```text
I am implementing Invitations as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Onboarding

- **Feature purpose:** Guide setup through resumable data-derived progress.
- **Relevant documents:** PRD; personas; design; relevant feature docs.
- **Dependencies:** Household.
- **Concepts to understand:** Progressive disclosure, data-derived completion, close blockers.

### Recommended implementation sequence

1. Define onboarding step catalogue and required/optional rules.
2. Create setup-progress read model from persisted data.
3. Add onboarding layout/navigation and resume route.
4. Implement household locale step.
5. Link account/debt/goal/investment/budget/import/reconciliation steps as features arrive.
6. Show skipped/incomplete state and first-meeting handoff.
7. Test concurrent completion and no client-only progress.

### Expected shape

- **Routes:** `/households/[id]/onboarding/[step]`.
- **Server modules:** Onboarding read model/service.
- **Schemas:** Step-specific schemas owned by domains.
- **Database changes:** Prefer derive from domain rows; optional progress metadata only if needed.
- **UI components:** ProgressNav, StepHeader, SaveContinue, FinishLater.
- **Authorization:** Any active member can progress financial setup; protected settings Owner.
- **Validation:** Each step server validated; missing is not zero.
- **Required tests:** Read-model unit/integration and E2E resume.
- **Manual verification:** Stop/reload/use second member.
- **Security review:** Do not expose unnecessary household data in public invite/auth pages.
- **Completion criteria:** Progress truth matches records and clearly identifies next step.

### Cursor prompt

```text
I am implementing Onboarding as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Accounts

- **Feature purpose:** Represent assets/liabilities and opening/as-of values safely.
- **Relevant documents:** database; calculations; design; account stories.
- **Dependencies:** Household, money type.
- **Concepts to understand:** Money minor units, account taxonomy, archive/history, valuation versus ledger.

### Recommended implementation sequence

1. Create account and balance snapshot migrations/RLS.
2. Implement money parser/serializer/formatter tests.
3. Create account schemas and server queries/services.
4. Build add/edit list/detail.
5. Record opening value with as-of date transactionally.
6. Implement archive/restore and dependency guards.
7. Add net-worth inclusion and reconciliation-required settings.

### Expected shape

- **Routes:** `/households/[id]/accounts`, `/accounts/new`, `/accounts/[accountId]`.
- **Server modules:** Account queries/service, money domain.
- **Schemas:** Account type/name/currency/date/money.
- **Database changes:** Accounts, account_balance_snapshots.
- **UI components:** AccountCard/Table/Form, MoneyInput, ArchiveDialog.
- **Authorization:** Editor writes household accounts; Owner for future destructive settings if needed.
- **Validation:** Type/currency/date/bigint bounds and same household.
- **Required tests:** Money unit; constraints/RLS; archive E2E.
- **Manual verification:** Create all key account types, cents/boundaries, archive/restore.
- **Security review:** No hard delete with history; no mixed-currency silent totals.
- **Completion criteria:** Accounts are stable source containers with exact values.

### Cursor prompt

```text
I am implementing Accounts as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Categories

- **Feature purpose:** Provide system and household classifications for ledger/budget.
- **Relevant documents:** database; scope; design.
- **Dependencies:** Household.
- **Concepts to understand:** Seed versioning, hierarchy, archive-not-delete, category kinds.

### Recommended implementation sequence

1. Choose copy-on-household seed strategy.
2. Create category migration and seeded system codes.
3. Add household category RLS/constraints and no-cycle strategy.
4. Create list/add/edit/archive UI.
5. Enforce kind compatibility in splits/budget later.
6. Test existing historical labels after rename/archive.

### Expected shape

- **Routes:** `/households/[id]/settings/categories`.
- **Server modules:** Category query/service/seed installer.
- **Schemas:** Name/kind/parent/essentiality.
- **Database changes:** Categories and seed version metadata.
- **UI components:** CategoryTree/List/Form.
- **Authorization:** Members read; Editors manage household copies.
- **Validation:** Normalized uniqueness, hierarchy, bounded names.
- **Required tests:** Seed idempotency, RLS, cycle/archive.
- **Manual verification:** Add/rename/archive category and view prior transaction.
- **Security review:** Custom names scrubbed from telemetry.
- **Completion criteria:** Stable codes and resolvable historical categories.

### Cursor prompt

```text
I am implementing Categories as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Transactions

- **Feature purpose:** Maintain an exact household ledger manually.
- **Relevant documents:** database; calculations; stories; security.
- **Dependencies:** Accounts/categories.
- **Concepts to understand:** Signed convention, split invariants, open/closed mutation, pagination.

### Recommended implementation sequence

1. Define transaction sign/category/transfer conventions in tests.
2. Create transaction/split migrations, ownership FKs, indexes and RLS.
3. Create validation schemas and create service with one split.
4. Build manual entry and transaction list/read model.
5. Add edit/review/cleared/note and safe reverse/archive policy.
6. Implement search/filter/pagination.
7. Implement multi-split transactionally.
8. Add closed-period guards when budget periods exist.

### Expected shape

- **Routes:** `/transactions`, `/transactions/new`, `/transactions/[id]`.
- **Server modules:** Ledger queries, transaction service, split validator.
- **Schemas:** Transaction/date/money/split/filter schemas.
- **Database changes:** Transactions, transaction_splits.
- **UI components:** TransactionForm/Table/Card/Detail/SplitEditor/Filters.
- **Authorization:** Editors mutate open rows; all members read; server and RLS scope.
- **Validation:** Amount/date/account/category/split sum, bounded query.
- **Required tests:** Money/sign, DB constraints/RLS, E2E manual/split/search.
- **Manual verification:** Income/expense/refund/split/closed/foreign tests.
- **Security review:** XSS/notes/logs; no client-computed total trust.
- **Completion criteria:** Ledger balances and split totals are deterministic.

### Cursor prompt

```text
I am implementing Transactions as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## CSV imports

- **Feature purpose:** Convert untrusted files into reviewed ledger rows.
- **Relevant documents:** security plan; threat model; ledger; open decisions.
- **Dependencies:** Transactions.
- **Concepts to understand:** Bounded parsing, mapping, staging, preview/commit, duplicate/idempotency.

### Recommended implementation sequence

1. Define accepted file/encoding/limits and retention.
2. Add import batch/row tables as an implementation-required schema extension.
3. Create upload intent and bounded parser adapter.
4. Normalize headers and map columns through schema.
5. Create preview with row errors/totals/duplicate candidates.
6. Allow mapping corrections and explicit account selection.
7. Commit valid approved rows in transaction/controlled batches with idempotency.
8. Record per-row result and cleanup artefacts.
9. Add saved mapping only after generic flow works.

### Expected shape

- **Routes:** `/transactions/import`, `/imports/[batchId]/preview`, `/imports/[batchId]/result`.
- **Server modules:** Import parser, staging queries, duplicate service, commit service.
- **Schemas:** Upload metadata, mapping, normalized row.
- **Database changes:** Import batches/rows plus ledger rows; private object only if retained.
- **UI components:** FileDrop/Input, MappingGrid, PreviewTable, ErrorSummary, CommitStatus.
- **Authorization:** Editor; re-authorize batch/account at preview and commit.
- **Validation:** Bytes/rows/fields/date/amount; never execute content.
- **Required tests:** Malicious fixtures, retry/rollback, RLS/storage, E2E.
- **Manual verification:** Malformed file, correction, retry, removed membership.
- **Security review:** Formula injection on later export; no raw rows logs/Cursor.
- **Completion criteria:** Committed totals equal approved preview and no duplicate retry.

### Cursor prompt

```text
I am implementing CSV imports as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Budgets

- **Feature purpose:** Store a monthly plan and derive actual variance.
- **Relevant documents:** PRD; DB; calculations; design.
- **Dependencies:** Categories/transactions/period model.
- **Concepts to understand:** Period uniqueness, category semantics, actual query, copy forward.

### Recommended implementation sequence

1. Create budget/template, period, item migrations/RLS.
2. Define canonical month/timezone and status transitions.
3. Build period creation and budget editor.
4. Implement copy previous/template without actuals.
5. Build actual aggregation from transaction splits.
6. Calculate variance with category-kind semantics.
7. Link variances to supporting transactions.
8. Add period notes and status.

### Expected shape

- **Routes:** `/budget`, `/budget/[period]`, `/budget/templates`.
- **Server modules:** Budget query/service, actual aggregator.
- **Schemas:** Period/item/copy schemas.
- **Database changes:** Budgets, budget_periods, budget_items.
- **UI components:** BudgetGrid/List, VarianceCell, PeriodSelector, CopyDialog.
- **Authorization:** Editors edit open; members read; closed guard.
- **Validation:** Unique period/category, money, category kind.
- **Required tests:** Aggregation/refunds/transfers/zero plan, RLS, E2E copy.
- **Manual verification:** Create/copy/edit and trace actual.
- **Security review:** No misleading zero for incomplete ledger.
- **Completion criteria:** Plan and actual are exact, traceable and close-aware.

### Cursor prompt

```text
I am implementing Budgets as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Reconciliation

- **Feature purpose:** Prove app balances align with account statements.
- **Relevant documents:** DB; close design; stories.
- **Dependencies:** Ledger/budget periods.
- **Concepts to understand:** Statement/app balance, session versions, readiness invalidation, exceptions.

### Recommended implementation sequence

1. Create reconciliation session/item migration/RLS.
2. Define which accounts require reconciliation.
3. Compute application balance as of statement date.
4. Build start session and statement input.
5. Show difference and eligible transaction review.
6. Complete only at zero difference.
7. Add owner-approved documented exception path.
8. Invalidate/flag readiness after source changes.
9. Expose close-readiness account statuses.

### Expected shape

- **Routes:** `/reconciliation`, `/reconciliation/[sessionId]`.
- **Server modules:** Reconciliation service, balance query, readiness service.
- **Schemas:** Statement date/balance, exception reason.
- **Database changes:** Reconciliation sessions/items, audit events.
- **UI components:** ReconciliationSummary, Difference, ItemList, ExceptionPanel.
- **Authorization:** Editor reconciles; Owner exception; server recomputes.
- **Validation:** Date/balance/rationale and status transition.
- **Required tests:** Late transaction, race, RLS, exception, E2E.
- **Manual verification:** Exact and nonzero workflows; edit source afterward.
- **Security review:** Exceptions visible/audited; no browser difference authority.
- **Completion criteria:** Each required account has explicit trusted status.

### Cursor prompt

```text
I am implementing Reconciliation as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Debts

- **Feature purpose:** Track balances/payments and transparent payoff scenarios.
- **Relevant documents:** DB; calculations; disclaimer.
- **Dependencies:** Accounts/ledger/money/decimal strategy.
- **Concepts to understand:** Rates, strategy ranking, amortization and non-guaranteed estimates.

### Recommended implementation sequence

1. Create debt/payment tables/RLS.
2. Implement rate parser/decimal strategy.
3. Build add/edit/link debt and payment history.
4. Implement snowball/avalanche/custom ranking.
5. Implement bounded payoff estimator and assumptions result.
6. Create progress/estimate UI and disclaimer.
7. Integrate dashboard/snapshot view models.

### Expected shape

- **Routes:** `/goals/debt`, `/debts/[id]`.
- **Server modules:** Debt queries/service, payoff calculations.
- **Schemas:** Debt terms/payment/rate/custom rank.
- **Database changes:** Debts, debt_payments.
- **UI components:** DebtForm/List/StrategyCompare/EstimatePanel.
- **Authorization:** Editors write open; members read.
- **Validation:** Nonnegative balances/payments, rate bounds, linked account.
- **Required tests:** Calculation fixtures/property; RLS; non-amortizing E2E.
- **Manual verification:** 0%, high rate, payment too low, paid debt.
- **Security review:** No “guaranteed”/advice claims; terms may differ.
- **Completion criteria:** Progress and estimates expose inputs/status/warnings.

### Cursor prompt

```text
I am implementing Debts as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Savings goals

- **Feature purpose:** Track emergency/sinking/custom goals and contributions.
- **Relevant documents:** DB; calculations; design.
- **Dependencies:** Accounts/transactions.
- **Concepts to understand:** Goal funding source, withdrawals, shared account ambiguity, emergency denominator.

### Recommended implementation sequence

1. Create goals/contributions migration/RLS.
2. Build goal CRUD/archive.
3. Link account or manual contribution mode explicitly.
4. Implement contribution history and transaction link.
5. Calculate progress/remaining/overfunding.
6. Calculate emergency months only with valid essential expense basis.
7. Integrate dashboard/snapshot.

### Expected shape

- **Routes:** `/goals/savings`, `/goals/savings/[id]`.
- **Server modules:** Savings queries/service/calculations.
- **Schemas:** Target/date/contribution/priority.
- **Database changes:** Savings goals/contributions.
- **UI components:** GoalForm/Card/Progress/ContributionList.
- **Authorization:** Editors write; members read.
- **Validation:** Target>0, currency/date, duplicate linked transaction.
- **Required tests:** Progress/emergency missing/withdrawal, RLS.
- **Manual verification:** Overfund, withdraw, zero expenses.
- **Security review:** No universal recommended emergency amount.
- **Completion criteria:** Goal progress is traceable and missing data explicit.

### Cursor prompt

```text
I am implementing Savings goals as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Investments

- **Feature purpose:** Track manual valuations and contributions without advice.
- **Relevant documents:** DB; calculations; disclaimer.
- **Dependencies:** Accounts/transactions.
- **Concepts to understand:** Valuation versus contribution, registered labels, employer contributions, scenarios.

### Recommended implementation sequence

1. Create investment specialization/contribution schema/RLS.
2. Build registered-account form and account linkage.
3. Record dated valuations through account balance snapshots.
4. Record contribution/withdrawal/employer history.
5. Calculate investing rate with explicit modes.
6. Add optional FI scenario inputs/results and disclaimer.
7. Integrate dashboard/snapshot.

### Expected shape

- **Routes:** `/goals/investments`, `/investments/[id]`, `/planning/financial-independence`.
- **Server modules:** Investment queries/service, scenario calculations.
- **Schemas:** Account type, contribution, valuation, scenario assumptions.
- **Database changes:** Investment accounts/contributions + balance snapshots.
- **UI components:** InvestmentForm/History/Valuation/ScenarioPanel.
- **Authorization:** Editors write; members read.
- **Validation:** Dates, currency, amount, rate assumptions.
- **Required tests:** Contributions vs transfers/gains, RLS, scenario edges.
- **Manual verification:** Manual valuation then contribution and scenario.
- **Security review:** No live price/advice/return promise.
- **Completion criteria:** UI labels all values by as-of/source and scenario assumptions.

### Cursor prompt

```text
I am implementing Investments as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Net worth

- **Feature purpose:** Compute current and historical household position.
- **Relevant documents:** calculations; DB; snapshot design.
- **Dependencies:** All account/valuation domains.
- **Concepts to understand:** As-of selection, inclusion, freshness, partial status, current vs closed.

### Recommended implementation sequence

1. Define asset/liability type mapping and inclusion.
2. Create latest-valid-value query at as-of date.
3. Build net-worth calculation/read model.
4. Add account breakdown and missing/stale status.
5. Add current history placeholder, then closed snapshot series.
6. Ensure archive/name changes do not rewrite history.

### Expected shape

- **Routes:** `/net-worth`.
- **Server modules:** Net-worth query/service/calculation.
- **Schemas:** As-of/filter only.
- **Database changes:** No required new table beyond snapshots.
- **UI components:** NetWorthKpi/Breakdown/Trend/Summary.
- **Authorization:** Members read authorized data.
- **Validation:** Bounded dates and one currency.
- **Required tests:** Positive/negative/excluded/stale/RLS/snapshot stable.
- **Manual verification:** Change live value and compare closed.
- **Security review:** Partial clearly labelled; no formal valuation claim.
- **Completion criteria:** Every total reconciles to component rows.

### Cursor prompt

```text
I am implementing Net worth as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Dashboard

- **Feature purpose:** Prioritize a small current-position scorecard and actions.
- **Relevant documents:** design; calculations; PRD.
- **Dependencies:** Net worth, budgets, reconciliation, planning domains.
- **Concepts to understand:** Read models, comparison basis, freshness, accessible charts.

### Recommended implementation sequence

1. Choose 3–8 MVP KPIs and exact definitions.
2. Create one dashboard service that composes narrow domain read models.
3. Optimize aggregate queries and inspect plans.
4. Build attention/next-action rules.
5. Create KPI/freshness/exception components.
6. Add one net-worth or cash-flow chart with text/table alternative.
7. Implement partial onboarding/no-prior states.
8. Add health score only after transparent component tests.

### Expected shape

- **Routes:** `/overview`.
- **Server modules:** Dashboard service/read-model queries.
- **Schemas:** Period selector only.
- **Database changes:** No new source table; optional cached read model later.
- **UI components:** KPIGrid, AttentionPanel, ChartSummary, FreshnessStrip.
- **Authorization:** Members read; server resolves selected household.
- **Validation:** Period/as-of bounds.
- **Required tests:** Read model unit, RLS, query plan, Playwright/axe.
- **Manual verification:** Partial and complete household on mobile.
- **Security review:** No amounts in analytics; no overloaded chart.
- **Completion criteria:** Page answers stand/attention/next action quickly.

### Cursor prompt

```text
I am implementing Dashboard as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Monthly Money Meeting

- **Feature purpose:** Turn financial facts into structured household decisions.
- **Relevant documents:** meeting stories; design; privacy; close.
- **Dependencies:** Dashboard/readiness/actions.
- **Concepts to understand:** Resumable workflow, attribution, concurrent edits, sensitive notes.

### Recommended implementation sequence

1. Create meeting/note/action migrations/RLS.
2. Define sections and completion requirements/version.
3. Create meeting start/resume service.
4. Build section navigation and source-data cards.
5. Add wins/challenges/upcoming/decisions/next goals.
6. Create action item assignment/status.
7. Implement save/conflict strategy and attribution.
8. Create final close checklist and readiness link.
9. Test two-member workflow and removed assignee.

### Expected shape

- **Routes:** `/meetings`, `/meetings/[meetingId]/[section]`.
- **Server modules:** Meeting/action services and queries.
- **Schemas:** Notes/actions/section completion.
- **Database changes:** Monthly meetings, notes, action items.
- **UI components:** MeetingNav, SourceCard, NoteField, DecisionList, ActionForm, Checklist.
- **Authorization:** Active members participate; close/finalize remains Owner default.
- **Validation:** Bounded plain text, active assignee, no unsafe HTML.
- **Required tests:** Resume/conflict/RLS/XSS/accessibility/E2E.
- **Manual verification:** Two users, refresh, incomplete, removed member.
- **Security review:** Notes excluded from analytics/logs.
- **Completion criteria:** Completed meeting is linked to period and close-ready evidence.

### Cursor prompt

```text
I am implementing Monthly Money Meeting as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Month close

- **Feature purpose:** Atomically preserve an immutable period version.
- **Relevant documents:** month-close design; calculations; DB; security.
- **Dependencies:** Reconciliation, meeting, all source domains.
- **Concepts to understand:** TOCTOU recheck, transaction/locks, idempotency, versioning, failure recovery.

### Recommended implementation sequence

1. Implement readiness version and blockers/warnings.
2. Design close RPC/service inputs and idempotency uniqueness.
3. Create snapshot header/detail migrations and immutable policies/triggers.
4. Implement lock, reauthorization and source selection.
5. Compute/copy canonical snapshot values with rule version.
6. Carry actions and create next period exactly once.
7. Create pending report and audit events.
8. Add failure injection/concurrency tests.
9. Build owner confirmation/result UI.
10. Implement correction workspace and superseding close.

### Expected shape

- **Routes:** `/periods/[period]/close`, `/snapshots/[id]`, correction route.
- **Server modules:** Close orchestration/RPC, snapshot query, readiness service.
- **Schemas:** Idempotency/readiness/exception/correction reason.
- **Database changes:** Financial snapshots/details, period links, audit/report/action changes.
- **UI components:** ReadinessChecklist, CloseConfirmation, SnapshotHeader, VersionBanner.
- **Authorization:** Owner only by default; trusted function verifies membership; snapshots read-only.
- **Validation:** Current period, expected version, non-overridable blockers.
- **Required tests:** Rollback/race/retry/immutability/correction/RLS/E2E.
- **Manual verification:** Double-click/network retry/source edit/failure.
- **Security review:** No service-role shortcut; audit safe; old snapshot never changes.
- **Completion criteria:** One durable complete version or no close; retry returns same result.

### Cursor prompt

```text
I am implementing Month close as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Snapshots

- **Feature purpose:** Provide exact historical read models independent of live data.
- **Relevant documents:** snapshot design; calculations; DB.
- **Dependencies:** Month close.
- **Concepts to understand:** Copied display fields, rule/content version, current/superseded history.

### Recommended implementation sequence

1. Define snapshot data contract and typed detail rows.
2. Create snapshot readers that never join live values for reported numbers.
3. Build version/current selection.
4. Add content hash verification utility.
5. Expose comparison series from snapshots.
6. Test rename/archive/live edits do not alter version.

### Expected shape

- **Routes:** `/reports/history`, `/snapshots/[id]`.
- **Server modules:** Snapshot query/read model.
- **Schemas:** Snapshot ID/version only.
- **Database changes:** Snapshot header/accounts/budget items and captured meeting/planning values.
- **UI components:** SnapshotSummary, VersionHistory, ClosedBadge.
- **Authorization:** Members read own household; no mutation.
- **Validation:** Opaque ID still scoped; version valid.
- **Required tests:** Mutation denial, live-change stability, hash fixture.
- **Manual verification:** Rename account after close and inspect.
- **Security review:** Historical privacy/export/deletion applies.
- **Completion criteria:** Closed page reproducibly renders same financial values.

### Cursor prompt

```text
I am implementing Snapshots as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Quarterly review

- **Feature purpose:** Aggregate three exact closed months into decisions and immutable quarter history.
- **Relevant documents:** PRD; snapshot design; stories.
- **Dependencies:** Three closed monthly snapshots.
- **Concepts to understand:** Eligibility/version selection, trends, source correction, quarterly snapshot.

### Recommended implementation sequence

1. Define quarter/calendar and eligibility rules.
2. Create quarterly review table/RLS.
3. Select and persist exact source snapshot IDs.
4. Build summary/trend read model from snapshots.
5. Create guided review sections/decisions/priorities/actions.
6. Finalize quarterly snapshot/version.
7. Handle corrected source month through visible stale/superseding workflow.
8. Add quarterly report.

### Expected shape

- **Routes:** `/reviews/quarterly`, `/reviews/quarterly/[id]`.
- **Server modules:** Quarterly service/read model.
- **Schemas:** Year/quarter/finalize/correction reason.
- **Database changes:** Quarterly reviews + financial snapshot/report/action links.
- **UI components:** QuarterSummary/Trend/ReviewNav/PriorityForm.
- **Authorization:** Members participate; Owner finalizes default.
- **Validation:** Three exact same-household/currency snapshots.
- **Required tests:** Missing month/corrected source/RLS/E2E.
- **Manual verification:** Seed/close three months then review.
- **Security review:** No live transaction aggregation.
- **Completion criteria:** Quarter records exact source versions and remains immutable.

### Cursor prompt

```text
I am implementing Quarterly review as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## PDF exports

- **Feature purpose:** Render private accessible reports from snapshot-only HTML.
- **Relevant documents:** system architecture; close design; security.
- **Dependencies:** Snapshots and private storage.
- **Concepts to understand:** Print CSS, internal auth, durable status, private downloads, template version.

### Recommended implementation sequence

1. Create generated report migration/RLS.
2. Build snapshot-only report view model and authenticated print route.
3. Create print components/styles with disclaimer and exception summary.
4. Implement PdfRenderer interface and Playwright adapter in supported runtime.
5. Claim/retry report records idempotently.
6. Store private object with hash/size/version.
7. Authorize download and issue short link/stream.
8. Test failure/orphan cleanup/superseded reports.

### Expected shape

- **Routes:** `/reports/[reportId]`, internal `/print/reports/[id]`, download endpoint.
- **Server modules:** Report service/worker, renderer, object store.
- **Schemas:** Report ID/retry only.
- **Database changes:** Generated reports + private storage.
- **UI components:** ReportStatus/Download, print layout.
- **Authorization:** Member download; internal renderer auth; trusted job writes.
- **Validation:** IDs/status, no live query.
- **Required tests:** Renderer fixture, foreign/expired link, failure retry, print visual/accessibility.
- **Manual verification:** Close with renderer down then retry.
- **Security review:** Signed URL not logged; private bucket.
- **Completion criteria:** Ready report hash maps to exact snapshot/template.

### Cursor prompt

```text
I am implementing PDF exports as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Data export

- **Feature purpose:** Return a scoped machine-readable copy under owner control.
- **Relevant documents:** security/privacy; PRD; DB.
- **Dependencies:** All domain tables and storage inventory.
- **Concepts to understand:** Recent auth, schema manifest, formula-safe CSV, durable private archive.

### Recommended implementation sequence

1. Define export format/version/manifest and included/excluded data.
2. Create export request/status table if needed.
3. Require Owner + recent auth and idempotency.
4. Query each table by authorized household in stable order.
5. Serialize JSON/CSV with bigint strings and formula neutralization.
6. Include file manifest or selected reports under policy.
7. Store private expiring archive, notify and audit.
8. Add expiry cleanup/retry/large fixture tests.

### Expected shape

- **Routes:** `/settings/data/export`, `/exports/[id]/download`.
- **Server modules:** Export service/job/serializer/object store.
- **Schemas:** Confirmation/recent-auth/idempotency.
- **Database changes:** Optional export_jobs; reads all household data.
- **UI components:** ExportPanel/Status/Download/Expiry.
- **Authorization:** Owner only; recheck at job and download.
- **Validation:** Typed confirmation, rate, format version.
- **Required tests:** Foreign scope, editor, expiry, retry, formula payload.
- **Manual verification:** Inspect archive manifest and cents.
- **Security review:** No other tenant/provider secrets/audit internals unnecessary.
- **Completion criteria:** Archive is complete/documented/private and expires.

### Cursor prompt

```text
I am implementing Data export as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Data deletion

- **Feature purpose:** Safely remove access and data according to approved lifecycle.
- **Relevant documents:** privacy/security; open decisions.
- **Dependencies:** Auth/household/billing/export/backups.
- **Concepts to understand:** Recent auth, owner safeguards, tombstone/grace, cascades, backup expiry.

### Recommended implementation sequence

1. Approve account versus household deletion policy.
2. Inventory dependencies/retention/legal exceptions.
3. Create deletion request/state and idempotent job.
4. Require recent auth and typed scope confirmation.
5. Lock/tombstone household and revoke invitations/links at defined stage.
6. Cancel billing/notifications.
7. Delete active rows/files in controlled order or verified cascades.
8. Record minimal completion evidence and backup expiry explanation.
9. Implement grace restore if approved.
10. Test partial failure/retry/multi-owner.

### Expected shape

- **Routes:** `/settings/data/delete`.
- **Server modules:** Deletion service/job, storage/billing cleanup.
- **Schemas:** Recent-auth confirmation/reason optional.
- **Database changes:** Deletion request/tombstone; all domain cleanup.
- **UI components:** DangerZone, ScopeExplanation, Confirmation, GraceStatus.
- **Authorization:** Owner/identity owner; protect other members/sole-owner rules.
- **Validation:** Exact typed phrase, state/version.
- **Required tests:** Editor/foreign/retry/recovery/partial integration.
- **Manual verification:** Request/cancel/recover synthetic household.
- **Security review:** Highest-risk workflow; alert and incident evidence.
- **Completion criteria:** Access and active data follow published policy with verifiable job state.

### Cursor prompt

```text
I am implementing Data deletion as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Stripe

- **Feature purpose:** Map verified provider billing state to household entitlement.
- **Relevant documents:** system architecture; threat model; scope/open decisions.
- **Dependencies:** Household owner, production provider setup.
- **Concepts to understand:** Hosted Checkout, customer mapping, raw-body signature, idempotency/order.

### Recommended implementation sequence

1. Decide beta pricing/feature flag.
2. Create subscription and processed-event schema/RLS.
3. Implement BillingProvider interface.
4. Create owner-only Checkout/Portal session actions.
5. Create raw-body Stripe webhook endpoint and signature verification.
6. Store/process event idempotently and map known statuses.
7. Reconcile out-of-order/missing events from Stripe API if needed.
8. Show server-derived plan state.
9. Add test/live environment guards and tests.

### Expected shape

- **Routes:** `/settings/billing`, `/api/webhooks/stripe`.
- **Server modules:** Billing service/provider/webhook handler.
- **Schemas:** Checkout price key chosen server-side; portal return.
- **Database changes:** Subscriptions + processed billing events.
- **UI components:** PlanCard/BillingStatus/ManageButton.
- **Authorization:** Owner initiates; provider webhook writes; members read summary.
- **Validation:** No client price/status trust; event allowlist.
- **Required tests:** Forged/replay/out-of-order/duplicate/customer mismatch.
- **Manual verification:** Stripe CLI test events and return without webhook.
- **Security review:** Secrets server only; raw body; no card data.
- **Completion criteria:** Entitlement matches verified Stripe state and safe delayed state.

### Cursor prompt

```text
I am implementing Stripe as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```
## Production deployment

- **Feature purpose:** Deploy repeatably with separate environments, monitoring and rollback.
- **Relevant documents:** system architecture; testing/release; security.
- **Dependencies:** All critical features and vendor decisions.
- **Concepts to understand:** Vercel environments, migrations, secrets, alerts, backup/restore, release evidence.

### Recommended implementation sequence

1. Create Vercel project and non-production preview mapping.
2. Configure environment variables by environment; verify no production in preview.
3. Create controlled migration release procedure.
4. Configure Sentry with scrubbing and release tags.
5. Configure domains, auth redirects, Resend, Stripe webhooks.
6. Set rate limits/security headers/provider MFA.
7. Run full CI/staging smoke and production canary.
8. Complete restore drill and incident tabletop.
9. Review public docs/legal/privacy/security.
10. Record release and monitor/rollback decision.

### Expected shape

- **Routes:** No new user routes; operational endpoints only.
- **Server modules:** Environment validation, logging/monitoring, release scripts.
- **Schemas:** Environment schema.
- **Database changes:** Production migrations only through controlled path.
- **UI components:** Environment banner/status/support UI as needed.
- **Authorization:** Provider/dashboard access least privilege.
- **Validation:** Fail startup safely for missing config; no secret output.
- **Required tests:** Full launch checklist, canary tenant, alert test, restore.
- **Manual verification:** Fresh production user completes critical loop with synthetic data.
- **Security review:** No unsupported security/data-residency claims.
- **Completion criteria:** Founder can operate, diagnose and recover the released system.

### Cursor prompt

```text
I am implementing Production deployment as Isuna’s sole developer. Read the relevant documents listed in mvp-implementation-playbook.md and cursor-senior-developer-guide.md. Explain the user outcome and concepts, then break the approved sequence into checkpoints. Give me only the first step with exact files, a focused snippet, commands, expected result, manual verification, tests and security concerns. Do not build the whole feature or move to Step 2 until I share my implementation.
```

## Feature completion review

Before marking any feature complete, use the Cursor sprint-completion prompt and verify:

- acceptance criteria and edge cases;
- another-household negative path;
- server/client boundary;
- RLS and constraints;
- exact money/rate/date handling;
- loading/empty/error/permission/closed states;
- mobile/keyboard/screen-reader basics;
- safe logs/audit/monitoring;
- tests actually run;
- docs and generated types updated;
- no unrelated code generation or hidden technical debt.
