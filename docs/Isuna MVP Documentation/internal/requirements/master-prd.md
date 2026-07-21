# Master Product Requirements Document

> **Classification:** Internal  
> **Authority:** Primary product requirements authority  
> **Audience:** Founder and Cursor  
> **Status:** Founding MVP baseline  
> **Last reviewed:** 2026-07-16


## 1. Product overview

Isuna is a secure, collaborative Family Financial Operating System for Canadian-first households. The MVP combines structured financial setup, transaction management, monthly budgeting, reconciliation, debt/savings/investment tracking, a focused dashboard, a guided Monthly Money Meeting, immutable month close, quarterly review, PDF reports, household collaboration, and user-controlled export/deletion.

## 2. MVP objective

Prove this statement:

> A household can enter its financial information once, understand its current financial position, complete a structured Monthly Money Meeting, close the month, and preserve that month as an accurate historical record.

The MVP is not proven by the number of modules shipped. It is proven by an end-to-end, secure, repeatable monthly operating loop.

## 3. Target users

- An individual organizing several financial accounts.
- A couple or household coordinating shared finances.
- A household paying down debt.
- A household building savings and long-term wealth.
- A financially engaged household exploring simple financial-independence scenarios.

See [`../product/user-personas-and-jobs.md`](../product/user-personas-and-jobs.md).

## 4. Primary workflows

1. **Identity and household:** register, verify, sign in, create household, invite member, switch household.
2. **Financial onboarding:** enter locale, accounts, opening balances, debts, goals, investments, budget and first transaction/import.
3. **Monthly maintenance:** enter/import, categorize, review, split, identify transfers, update balances and reconcile.
4. **Understand:** view current dashboard, net worth, cash flow, progress and attention items.
5. **Meet:** complete structured Monthly Money Meeting with notes, decisions, actions and next-month goals.
6. **Close:** validate readiness, document exceptions, create immutable snapshot, generate report and start next period.
7. **Quarterly review:** aggregate three closed months, identify trends, record priorities and preserve a quarterly snapshot.
8. **Control data:** export household data and request household/user deletion.

## 5. Functional requirements

### FR-01 Authentication

The system shall support email/password registration, email verification, password reset, Google authentication, secure sign-in/sign-out, cookie-based server-compatible sessions and protected application routes. Authenticated identity shall be verified server-side before sensitive data access.

### FR-02 Profiles and households

A user shall have a profile and may belong to multiple households. A household shall have one or more members with `owner` or `editor` roles. Only authorized members may access household data. Owner-only operations include membership removal, billing, whole-household export, deletion and close correction unless changed by an approved decision.

### FR-03 Invitations

An owner shall be able to invite an email address through a single-use, expiring, revocable invitation. Acceptance shall require authentication and shall not reveal household data before membership is created. Duplicate, expired, revoked and mismatched invitations shall fail safely.

### FR-04 Onboarding

The system shall present a resumable onboarding checklist covering country, province/territory, currency, household members, income, accounts, debts, savings, investments, budget, first transaction/import, first reconciliation and first meeting. Users may use partial product functionality before finishing, but missing steps shall be visible and may block close.

### FR-05 Accounts and balances

Users shall create typed asset/liability accounts, archive them, decide whether they appear in net worth, record opening balances and update values through transactions, balance adjustments, contributions or valuation entries as appropriate. Account currency shall be explicit.

### FR-06 Transactions

Users shall create, edit, archive/reverse where appropriate, search and filter transactions; assign categories; mark review/cleared status; add notes; split transactions; identify transfers; import CSV files through preview/mapping/validation; and receive duplicate warnings. Destructive edits affecting closed periods shall be prohibited or handled through correction workflows.

### FR-07 Categories and rules

A household shall have seeded and custom categories for income, expense, debt payment, savings and investment contributions. Categories may be archived. Simple rules may propose categories based on normalized description and account, but users remain able to review and override suggestions.

### FR-08 Budgeting

A household shall create monthly budget periods and line items with planned amounts, actual amounts, variance, essential/discretionary designation and notes. Users may copy a prior period or apply a reusable template. Actuals shall be derived from qualifying transactions/splits under the canonical calculation rules.

### FR-09 Reconciliation

For each relevant account and period, a user shall record statement date and balance, compare it with the application balance, inspect difference, resolve items or approve a documented exception. Close readiness shall identify required unreconciled accounts and unresolved differences.

### FR-10 Debt

Users shall track debt terms, balances, payments, priority strategy and estimates. Snowball, avalanche and custom ordering shall be transparent. Estimates shall expose assumptions and shall never be described as guaranteed.

### FR-11 Savings goals

Users shall track emergency, sinking and custom goals with target, date, priority, contributions and progress. Suggested contributions are arithmetic planning aids, not advice.

### FR-12 Investments and FI scenarios

Users shall manually track investment account balances and contributions, including registered account types and employer contributions. A basic FI scenario may use user-controlled assumptions and clear disclaimers. The MVP shall not supply personalized investment recommendations or automatic prices.

### FR-13 Dashboard and net worth

The dashboard shall present three to eight primary KPIs, previous-period comparisons where valid, progress indicators, data freshness, unreconciled items and next actions. Net worth shall follow the canonical inclusion and valuation rules and link to supporting accounts.

### FR-14 Monthly Money Meeting

The system shall guide a household through scorecard, income, spending, variance, debt, savings, investments, net-worth change, wins, challenges, upcoming commitments, decisions, action items, next-month goals and close checklist. Progress shall be saved. Meeting notes and actions shall be household-authorized.

### FR-15 Month close and snapshots

Closing shall validate required data and reconciliations, permit authorized documented exceptions, execute as one logical idempotent operation, create an immutable versioned snapshot, store meeting outputs, carry incomplete actions, prepare the next period, enqueue/generate a PDF and record audit events. A second close request shall not create an accidental duplicate.

### FR-16 Quarterly review

After three eligible closed months, the system shall summarize the quarter, compare performance, review trends/goals, record decisions and priorities, create an immutable quarterly snapshot and export a report.

### FR-17 Reports and files

Generated reports shall be derived from a specific immutable snapshot version, stored privately, associated with a content hash and accessed through short-lived authorization. Public URLs shall not expose financial reports.

### FR-18 Notifications

Users shall control essential and optional notifications. Security and transactional notifications may not be fully disabled where necessary. The MVP may limit reminders to email and in-app status.

### FR-19 Audit history

The system shall record security- and integrity-relevant events such as membership changes, role changes, close/correction, exports, deletion requests, billing changes and sensitive configuration changes. Audit records shall not contain raw secrets or unnecessary financial descriptions.

### FR-20 Subscription support

If billing is enabled at launch, Stripe Checkout/Billing shall create entitlements from verified server-side webhook events. Billing status shall not be trusted from the browser. The product shall retain a safe state for failed or delayed webhook processing.

### FR-21 Export and deletion

An authorized owner shall request an export containing supported household records and files in a documented format. Users shall request account deletion; owners shall manage household deletion according to the approved grace and retention policy. Destructive actions require recent authentication, explicit confirmation and audit events.

## 6. Non-functional requirements

### Security

- Default deny for household records.
- RLS enabled and tested on every exposed household table.
- Server authorization for every mutation and sensitive read.
- No service-role credential in client bundles, logs, documentation or screenshots.
- Secrets stored in environment management, rotated after suspected exposure.
- Rate limits and abuse controls on authentication, invitations, imports, exports and webhooks.
- Secure headers, dependency scanning, audit trail and incident plan.

### Privacy

- Collect only data needed for stated purposes.
- Provide understandable purpose/consent language.
- Maintain a data inventory, retention rules, subprocessors and access/deletion process.
- Use privacy-conscious analytics that exclude amounts, descriptions, account names and report contents by default.

### Accessibility

Target **WCAG 2.2 AA** as the design and test baseline. All core workflows shall support keyboard use, visible focus, semantic headings/landmarks, labelled controls, programmatic errors, adequate contrast, zoom/reflow and reduced motion. Colour shall never be the sole status signal.

### Performance expectations

These are product budgets, not guarantees:

- Main authenticated pages should become usable quickly on typical Canadian broadband and modern mobile devices.
- Dashboard queries should avoid N+1 patterns and return a bounded payload.
- Large imports shall be previewed and processed with explicit limits rather than blocking an interactive request indefinitely.
- Month close shall expose progress/failure safely and be retryable without duplicate snapshots.
- Report generation may be asynchronous internally, but the UI must show a durable status and never falsely claim completion.

### Reliability and integrity

- Migrations are version-controlled and reproducible.
- Multi-record financial operations use transactions.
- Snapshot creation is idempotent and versioned.
- Calculations are deterministic for the same input and rule version.
- Backups and restoration procedures are tested before launch.

### Maintainability

- Modular-monolith boundaries.
- Strict TypeScript and linting.
- Database queries outside presentation components.
- Shared validation schemas where appropriate without conflating client convenience with server trust.
- Minimal justified dependencies.
- Architecture and decision documentation updated with changes.

## 7. Data ownership and lifecycle

Users retain ownership of their contributed household data subject to membership, legal, security, backup and retention constraints described transparently. Operational records may be archived; closed snapshots are preserved until authorized deletion. Deletion from active systems and expiry from backups are separate stages and must be explained honestly.

## 8. Error handling

- Return actionable, non-sensitive user messages.
- Distinguish validation, authorization, conflict, unavailable dependency and unexpected server errors.
- Never reveal existence of another household’s record.
- Preserve user input after correctable form errors.
- Assign correlation IDs to unexpected failures without logging sensitive payloads.
- Make retries safe for invitations, imports, close, exports and webhooks.

## 9. Reporting requirements

Reports must identify household, period, snapshot version, generated time, currency, data freshness/exception summary and disclaimer. They must not pull changing live values after close. Print styling, tables and charts must remain legible without colour.

## 10. Analytics limitations

Do not send raw financial values, transaction descriptions, account names, notes, report documents, invitation addresses or CSV contents to general analytics. Product events should use coarse states such as `month_close_completed` and be reviewed through a data-inventory process.

## 11. Launch criteria

The MVP may launch beyond a controlled beta only when:

- all Must-have workflows pass acceptance and end-to-end tests;
- cross-household access tests pass for every domain table and storage bucket;
- financial calculation and snapshot invariants pass deterministic tests;
- a restore exercise succeeds;
- export and deletion are verified;
- email and payment webhooks are verified and idempotent if enabled;
- security headers, rate limits, monitoring and alert ownership are configured;
- accessibility review covers all critical paths;
- public claims and disclaimer have been reviewed;
- no critical/high unresolved security findings remain;
- the founder can explain, operate and rollback the deployed system.
