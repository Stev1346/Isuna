# Testing, Release and Quality Plan

> **Classification:** Internal  
> **Authority:** Quality and release authority  
> **Audience:** Founder and Cursor  
> **Status:** Founding MVP baseline  
> **Last reviewed:** 2026-07-20


## 1. Quality objective

Isuna must make sensitive financial workflows predictable, explainable and recoverable. Test count is not the objective. The objective is evidence that user outcomes, household isolation, financial invariants, accessibility and operational recovery continue to work.

## 2. Testing pyramid

```text
         E2E: few critical household workflows
      Integration: services, database, providers
   Unit/property: calculations, parsing, state logic
Static: TypeScript, lint, formatting, dependency/secrets/schema checks
```

Most financial edge cases belong in fast unit/property tests. RLS and transaction behaviour require a real test database. A few E2E tests prove the assembled system.

## 3. Static quality gates

- TypeScript/Svelte check.
- ESLint and formatting check.
- Unit test suite.
- Migration lint/verification and generated-type drift check.
- Secret scanning.
- Dependency/security audit with reviewed exceptions.
- Build production bundle and inspect forbidden environment exposure.
- Markdown link/structure check for authoritative docs where practical.

No global `skipLibCheck`/lint disable or broad test exclusion merely to make CI green.

## 4. Unit tests

Use Vitest for:

- money parsing, arithmetic and serialization;
- every calculation rule and rounding boundary;
- CSV header/row mapping and duplicate fingerprinting;
- Zod schema transforms;
- permission predicate mapping (in addition to DB tests);
- close-readiness classification;
- action carryover;
- report view-model construction;
- email template safe rendering;
- status transition reducers.

Use table-driven tests. Add property-based testing library only if justified; simple generated loops can cover invariants initially.

## 5. Integration tests

Test application services with a real test Supabase/PostgreSQL environment or local stack:

- household creation + owner membership transaction;
- invitation acceptance concurrency/idempotency;
- transaction/split/transfer write consistency;
- CSV commit rollback/row results;
- budget actual aggregation;
- reconciliation status changes after ledger edits;
- close transaction and report record creation;
- export manifest generation;
- Stripe event mapping through verified fixture abstraction;
- email provider interface with fake transport.

Do not mock the database for tests whose purpose is constraints, transactions or RLS.

## 6. Database tests

- Migration applies from empty schema.
- Upgrade applies from previous release fixture.
- Foreign keys, checks, uniques and ownership composite keys reject invalid state.
- Closed snapshot/audit mutation is rejected.
- Close rollback leaves no partial snapshot/action/next period.
- Concurrent close creates one valid current version.
- Query functions return deterministic ordered results.
- Critical query plans use expected indexes on representative volume.

Supabase SQL/pgTAP or a documented TypeScript database harness may be used. Keep setup understandable to the founder.

## 7. RLS tests

For every household table and storage bucket, create identities:

- `ownerA`, `editorA`, `removedA`;
- `ownerB` with known B record IDs;
- anonymous;
- privileged job only where required.

Test all CRUD verbs and RPCs. A select returning zero rows may be correct; writes must also prove no row changed. Include attempts to change `household_id`, link a foreign parent and access signed/download routes.

CI fails if a new exposed table lacks RLS or policy coverage.

## 8. End-to-end tests

Playwright critical paths:

1. Register/verify in test strategy → create household → onboarding start.
2. Owner invites Editor → invitee accepts → both switch/access correctly.
3. Create accounts/categories → manual transaction → split → transfer.
4. Import CSV preview → fix invalid mapping → commit once → duplicate warning.
5. Create budget → actuals → reconcile statement.
6. Add debt/savings/investment → dashboard values and details.
7. Complete meeting → actions → close → snapshot → report → next month.
8. Close blocked and exception flow.
9. Correct/re-close creates version 2; version 1 remains.
10. Quarterly review from three closed fixtures.
11. Owner export/deletion confirmation path; Editor denied.
12. Foreign household direct URL/API/download denied.

Use accessible locators (role, label, text) rather than fragile CSS implementation selectors. Playwright traces/screenshots must not upload real financial data.

## 9. Financial calculation tests

For each rule:

- hand-calculated example;
- zero and negative values;
- missing data;
- minimum/maximum safe amount;
- currency mismatch;
- rounding halfway cases under selected policy;
- deterministic output/rule version;
- invariants/properties;
- snapshot fixture compatibility.

Mortgage and debt schedules require independent fixture verification for Canadian compounding/payment conventions before public use. Tests state assumptions, not just expected opaque numbers.

## 10. Accessibility tests

Automated:

- axe integrated with Playwright on critical pages;
- labels/names, duplicate IDs, landmark/heading checks;
- contrast tooling as available;
- no serious/critical violations in core workflows.

Manual per critical flow:

- keyboard only, including menus/dialogs/table actions;
- visible focus and focus return;
- screen reader spot check (VoiceOver on macOS/iOS plus another platform as feasible);
- 200%/400% zoom and narrow reflow;
- reduced motion;
- high contrast/forced colours where available;
- error summary and live-status announcements;
- chart text alternatives.

Automated accessibility tools cannot prove full accessibility.

## 11. Security tests

- auth bypass/session expiry/sign-out cache;
- role escalation and IDOR;
- RLS matrix;
- invitation token expiry/reuse/rate;
- CSV malformed/oversize/formula payload;
- XSS/output escaping in notes/reports;
- CSRF/origin for mutations and webhooks;
- Stripe signature/replay/out-of-order;
- signed report/export expiry and removed membership;
- service-role bundle/log scan;
- sensitive-error Sentry/log inspection;
- dependency/action/secret scans;
- deletion/export scope and retry.

Before launch, arrange an independent security review or penetration test focused on tenant isolation, Auth/SSR, storage, privileged functions and exports.

## 12. Manual QA

A sprint demo is not a substitute for focused QA. Use a checklist with:

- happy path on desktop/mobile;
- first-time, empty and partial onboarding;
- validation and correction without lost input;
- slow/dependency failure;
- concurrent member change;
- browser refresh/back/retry;
- large but allowed data;
- closed/read-only state;
- audit/monitoring result;
- public copy/disclaimer accuracy.

## 13. Test-data strategy

- Synthetic data only in repository and shared preview.
- Clearly fictional institutions, names and transaction descriptions.
- Deterministic fixtures with `Household Alpha` and `Household Beta` for isolation.
- Values cover negative net worth, no debt, high debt, partial data and overfunded goals.
- Seed three closed months for quarterly tests using the same close code where feasible, not manual snapshot SQL.
- Never copy production database to local/preview without an approved anonymization process.
- Tests clean up or reset local database predictably.

## 14. CI pipeline

### Pull request

1. checkout with minimal permissions;
2. install pinned Node/pnpm and dependencies from the lockfile (versions recorded after latest-stable selection per OD-03—not floating `latest` tags in workflows);
3. format/lint/type/Svelte check;
4. unit tests with coverage report as signal, not quota gaming;
5. start isolated local Supabase/test database;
6. apply migrations + seed;
7. database/RLS/integration tests;
8. build production app;
9. Playwright smoke/critical subset;
10. dependency, secret and policy catalogue checks;
11. upload sanitized test artefacts with short retention.

### Main/release

Full E2E/accessibility suite, migration verification, preview/staging smoke, release approval and production deployment. Production migrations are controlled and observable, not automatically executed from every branch preview.

## 15. Staging and previews

- Preview per PR uses non-production Supabase/project and provider test modes.
- Staging has stable synthetic scenarios and can receive verified provider test webhooks.
- No production customer email addresses.
- Email routes to allowlisted test inbox or suppressed transport.
- Destructive tests cannot reach production.
- Environment banner distinguishes non-production.

## 16. Release strategy

Use small releases behind feature flags where helpful, but flags do not excuse incomplete authorization. Recommended sequence:

1. deploy backward-compatible app code/migration;
2. verify health and canary tenant;
3. enable feature for founder/test household;
4. observe logs/metrics;
5. expand beta;
6. remove old code/columns in later migration after evidence.

Every release records commit, migrations, flags, test results, known issues and rollback/forward-fix decision.

## 17. Rollback and forward fix

Application rollback is safe only if the previous version understands the new schema/state. Destructive migrations may require forward fix instead. Before migration:

- classify backward compatibility;
- back up/restore point;
- estimate lock/time;
- define verification query;
- decide rollback SQL versus additive fix;
- ensure closed snapshots remain readable.

Stripe/webhook events and close requests must be replayable/idempotent after deployment failure.

## 18. Monitoring after release

Observe:

- error/latency changes by release;
- auth and invitation failures;
- RLS/permission denials (without flooding/noise);
- close/report/export/deletion failures and queue age;
- webhook signature and processing failures;
- database/storage usage and connection saturation;
- client performance on dashboard/transactions;
- support reports and accessibility regressions.

Define alert severity and action; alerts without an owner are not controls.

## 19. Definition of Ready

A story is ready when:

- user outcome and acceptance criteria are clear;
- scope and dependencies are identified;
- relevant documents and open decisions are known;
- data model/authorization impact reviewed;
- design state and copy are sufficient;
- tests and manual verification are planned;
- feature is small enough for a checkpoint;
- no unresolved security decision makes implementation speculative.

## 20. Definition of Done

- Acceptance and failure criteria pass.
- Founder understands and has reviewed every change.
- Types/lint/unit/integration/RLS/E2E at appropriate level pass with recorded commands.
- Manual mobile/desktop/accessibility checks complete.
- Security/privacy checklist complete.
- Monitoring/audit and safe errors implemented.
- Migration tested and generated types updated.
- Documentation/public claims updated.
- No unrelated rewrite or unexplained dependency.
- Demo shows user outcome and data integrity.
- Feature can be operated and rolled back/forward-fixed.

## 21. Sprint demo checklist

- State objective and persona/job.
- Show happy path from clean fixture.
- Show one important failure/permission case.
- Show mobile/keyboard interaction.
- Explain data model/RLS and calculation source.
- Show automated test results and manual checks.
- Show logs/audit without sensitive data.
- Identify debt, open decisions and out-of-scope work.
- Confirm documentation changed.

## 22. MVP launch checklist

### Product

- [ ] Complete onboarding → meeting → close → report loop.
- [ ] Three closed months → quarterly review.
- [ ] Export and deletion verified.
- [ ] Public status/copy accurate.

### Security/privacy

- [ ] Threat/RLS/storage/independent review complete.
- [ ] Restore exercise and incident tabletop complete.
- [ ] Privacy/terms/disclaimer/subprocessor review complete.
- [ ] No critical/high findings.

### Quality/accessibility

- [ ] Full suites pass from release commit.
- [ ] Critical workflows manually audited.
- [ ] Browser/device support documented.
- [ ] Performance budgets acceptable with representative volume.

### Operations

- [ ] Production secrets/regions/domains/webhooks verified.
- [ ] Monitoring, alerts, on-call contact and status process.
- [ ] Backup, migration and rollback plan.
- [ ] Billing/support/refund path if charging.
- [ ] Beta cohort and feedback/support channel defined.
