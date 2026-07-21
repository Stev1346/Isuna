# User Stories and Acceptance Criteria

> **Classification:** Internal  
> **Authority:** Behavioural acceptance authority  
> **Audience:** Founder and Cursor  
> **Status:** Founding MVP baseline  
> **Last reviewed:** 2026-07-16


## Testability rules

- “Works,” “secure,” “fast” and “user-friendly” are not acceptance criteria without observable evidence.
- Every household story includes a negative cross-household test.
- Financial results must be traceable to canonical calculation rules.
- Closed-period stories must verify immutability and idempotency.
- Public copy and UI labels may be refined, but the behaviour below requires a PRD/decision update to change.

## Authentication
### US-001

**As a visitor, I want to create an account with email and password, so I can establish a verified identity.**

#### Acceptance criteria

- Registration validates email/password, creates no duplicate profile, sends verification, and does not expose whether unrelated addresses have accounts.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Invalid input; existing identity; email unavailable; expired verification; rate limit.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-002

**As a user, I want to sign in and remain signed in securely, so I can return to my household workspace.**

#### Acceptance criteria

- A valid session is available to server hooks; protected routes redirect unauthenticated users; sign-out invalidates the session and protected data is not cached for the next user.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Wrong password; unverified email policy; expired/rotated token; disabled account.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-003

**As a user, I want to reset my password, so I can recover access without support.**

#### Acceptance criteria

- A single-use recovery flow expires, requires a new valid password, and revokes or rotates sessions according to policy.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Unknown email response does not enumerate; reused/expired token; rate abuse.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-004

**As a user, I want to sign in with Google, so I can use an existing trusted identity.**

#### Acceptance criteria

- OAuth callback validates state, creates/links the correct identity under explicit rules and returns to a safe local route.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Cancelled consent; email collision; unsafe return URL; provider outage.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Profiles and households
### US-005

**As a authenticated user, I want to create a household, so I can organize data in a private workspace.**

#### Acceptance criteria

- Household is created transactionally with the user as owner, default settings and audit event; no other user can read it.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Duplicate submission; invalid locale; transaction rollback.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-006

**As a household member, I want to switch between households I belong to, so I see only the selected workspace.**

#### Acceptance criteria

- Switcher lists authorized active memberships; server derives access each request; an arbitrary household ID cannot grant access.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Removed membership; stale selection; nonexistent household.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-007

**As a household owner, I want to update household profile, so the workspace reflects our locale and preferences.**

#### Acceptance criteria

- Only an owner changes protected settings; currency changes with financial data require a controlled policy, not silent conversion.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Editor attempt; unsupported country/currency; concurrent edit.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-008

**As a household owner, I want to remove a member, so I can control access.**

#### Acceptance criteria

- Removal revokes future household access immediately, records an audit event and prevents removing the sole owner without transfer/closure.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Self-removal as sole owner; last owner; active invitation; concurrent request.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Invitations
### US-009

**As a household owner, I want to invite my spouse or partner, so we can manage finances together.**

#### Acceptance criteria

- Invitation is single-use, revocable, expires after the configured period and reveals minimal data; acceptance creates one membership.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Already member; duplicate invite; expired/revoked token; mismatched recipient; token guessing.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-010

**As a invitee, I want to accept a valid invitation, so I can join the intended household.**

#### Acceptance criteria

- Authentication is required; token is hashed at rest; acceptance is atomic and idempotent; role is limited to permitted values.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Logged-in email mismatch policy; owner removed inviter; duplicate clicks.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Onboarding
### US-011

**As a new household member, I want to see setup progress, so I know the next useful step.**

#### Acceptance criteria

- Checklist reflects persisted household state, supports resume, links to each step and distinguishes optional from close-blocking tasks.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Partial records; another member completes a step; stale browser state.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-012

**As a household member, I want to complete financial setup gradually, so I can receive value before everything is entered.**

#### Acceptance criteria

- Each step saves independently with validation; later steps explain dependencies; close remains blocked when required facts are missing.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Back navigation; duplicate submits; unsupported account type.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Accounts and categories
### US-013

**As a editor, I want to add an account or liability, so the household picture includes it.**

#### Acceptance criteria

- Account requires household-derived authorization, type, name, currency, inclusion choice and opening-balance date/value; values use minor units.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Invalid currency; duplicate name allowed but clearly distinguished; future opening date policy; unauthorized household.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-014

**As a editor, I want to archive a closed account, so it no longer clutters active views without erasing history.**

#### Acceptance criteria

- Archived account is hidden by default, remains linked to transactions/snapshots and cannot be hard-deleted when historical records depend on it.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Account with pending reconciliation; closed period references; restore archive.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-015

**As a editor, I want to manage categories, so our budget matches how we think.**

#### Acceptance criteria

- Seeded and custom categories have valid kind, name uniqueness within parent/scope and archive behaviour; used categories remain historically resolvable.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Circular hierarchy; deleting used category; duplicate normalized name.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Transactions
### US-016

**As a editor, I want to enter a transaction manually, so the ledger reflects activity.**

#### Acceptance criteria

- Server validates account, date, amount, direction/category model, currency and household membership; create is audited when sensitive; budget actuals update from canonical query.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Closed date; archived account; zero/overflow amount; duplicate submit.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-017

**As a editor, I want to split a transaction, so one purchase can affect several categories.**

#### Acceptance criteria

- Split amounts sum exactly to parent amount in minor units; parent category handling is consistent; operation is transactional.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Rounding remainder; deleted category; concurrent edit.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-018

**As a editor, I want to mark a transfer, so cash movement is not counted as income or spending.**

#### Acceptance criteria

- Transfer links two authorized account entries with equal value under supported same-currency MVP rules and avoids double-counting.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Missing counterpart; cross-currency; closed period; one side deleted.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-019

**As a member, I want to search and filter transactions, so I can investigate a metric.**

#### Acceptance criteria

- Filters are household-scoped, paginated and return only authorized columns; date/category/account/review states combine predictably.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Empty result; malformed query; excessive range.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## CSV imports
### US-020

**As a editor, I want to upload and preview a CSV, so I can import without committing bad data.**

#### Acceptance criteria

- File size/type/row limits are enforced; parser treats content as data; preview shows mapping, validation and duplicate candidates before writes.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Malformed encoding; formula text; excessive rows; missing headers; parser failure.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-021

**As a editor, I want to commit an approved import, so validated rows enter the correct account once.**

#### Acceptance criteria

- Commit uses an import id/idempotency key, transaction or controlled batches, per-row result and exact household/account authorization.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Partial failure; repeated click; account archived; membership removed mid-flow.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Budgets
### US-022

**As a editor, I want to create a monthly budget, so we can agree on a plan.**

#### Acceptance criteria

- One active budget period per household/month/currency; items use categories and minor units; totals and variance follow canonical rules.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Duplicate period; closed month; archived category.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-023

**As a editor, I want to copy the previous month, so setup takes less time.**

#### Acceptance criteria

- Copy creates new editable items without copying actuals, close state or stale IDs; user reviews before save.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- No prior month; duplicated line; category archived.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-024

**As a member, I want to compare planned and actual amounts, so I understand meaningful variances.**

#### Acceptance criteria

- Actuals derive from eligible transaction splits, transfer exclusions and period timezone rules; links reveal supporting transactions.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Uncategorized items; pending/unreviewed policy; refunds; missing data.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Reconciliation
### US-025

**As a editor, I want to reconcile an account to a statement, so we can trust the period balance.**

#### Acceptance criteria

- Session records statement date/balance, computed application balance, difference, item review and status; zero difference or approved exception is explicit.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Late transaction; concurrent changes; archived account; statement outside period.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-026

**As a owner, I want to approve a documented reconciliation exception, so we can close with a known unresolved difference.**

#### Acceptance criteria

- Exception requires reason, approver, timestamp and amount; dashboard/report discloses it; approval is revocable only before close.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Blank reason; editor attempts if owner-only; change after close.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Debts
### US-027

**As a editor, I want to track a debt and payments, so we can see progress and estimates.**

#### Acceptance criteria

- Debt stores terms and linked/unlinked balance source; payment history is dated; estimates disclose assumptions and handle zero/unknown rates.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Negative balance; rate scale error; missed minimum; closed payment edit.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-028

**As a member, I want to compare snowball and avalanche order, so we can choose a strategy.**

#### Acceptance criteria

- Snowball orders eligible debts by balance, avalanche by effective rate, ties are deterministic and custom order is preserved separately.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Zero-interest debt; promotional rate; identical values; excluded mortgage.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Savings goals
### US-029

**As a editor, I want to create a savings goal, so we can track progress toward a purpose.**

#### Acceptance criteria

- Goal has type, target, optional date, priority, linked account or manual contributions; progress is bounded/presented correctly over target.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Zero target; past date; withdrawn contribution; archived goal.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-030

**As a member, I want to see an emergency-fund estimate, so we understand our buffer.**

#### Acceptance criteria

- Months equals eligible liquid emergency balance divided by defined monthly essential expense; missing denominator produces “not enough data,” not infinity.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Zero expenses; negative cash; excluded account; mixed period basis.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Investments
### US-031

**As a editor, I want to record investment balances and contributions, so net worth and contribution history include investments.**

#### Acceptance criteria

- Valuations and contributions are distinct; account type and as-of date are explicit; no live price is implied.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Backdated valuation; employer contribution; withdrawal; closed snapshot.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-032

**As a member, I want to explore a basic FI scenario, so we can discuss assumptions.**

#### Acceptance criteria

- Inputs are user-controlled, formula and disclaimer are visible, result is labelled scenario, and missing/invalid assumptions block output.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Zero expenses; negative return; inflation greater than return; no investable assets.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Dashboard and net worth
### US-033

**As a member, I want to view an executive dashboard, so I know where we stand and what needs attention.**

#### Acceptance criteria

- Dashboard has no more than eight primary KPIs, every metric has definition/detail, freshness and unreconciled states are visible, and household scope is server-enforced.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- No prior period; partial onboarding; stale data; calculation unavailable.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-034

**As a member, I want to view net-worth history, so I can understand change over time.**

#### Acceptance criteria

- Current values and immutable closed snapshots are visually distinguished; inclusion rules are consistent; historical values never recalculate from live records.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- New account; archived account; corrected snapshot version.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Monthly Money Meeting
### US-035

**As a member, I want to complete a guided monthly meeting, so our household can review facts and decide together.**

#### Acceptance criteria

- Sections save progress, display source data and freshness, allow notes/wins/challenges/decisions/actions, and identify incomplete close items.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Two members edit; session timeout; incomplete data; reopened browser.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-036

**As a member, I want to assign an action item, so decisions become accountable work.**

#### Acceptance criteria

- Action has owner, description, status, optional due date and source meeting; assignee must be active member or unassigned.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Member removed; overdue; duplicate carryover.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Month close and snapshots
### US-037

**As a owner, I want to close a ready month, so the month becomes a reliable permanent record.**

#### Acceptance criteria

- Server rechecks readiness, locks period, computes canonical snapshot in a transaction, creates one version per idempotency key, records audit and leaves live future periods usable.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Double click; failed PDF; concurrent transaction; unresolved reconciliation; lost membership.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-038

**As a owner, I want to correct a closed month without erasing history, so the official record can be fixed transparently.**

#### Acceptance criteria

- Correction creates a superseding version with reason and audit trail; prior snapshot remains immutable and discoverable to authorized users.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Unauthorized editor; no reason; correction race; report regeneration.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Quarterly review
### US-039

**As a member, I want to review three closed months, so we can identify trends and set priorities.**

#### Acceptance criteria

- Eligible months are closed versions in the same household/currency and quarter policy; totals derive from snapshots; decisions/actions are saved and report is versioned.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Missing month; mixed corrected versions; incomplete data; calendar boundary.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Reports
### US-040

**As a member, I want to download a monthly or quarterly PDF, so we can retain and discuss a portable record.**

#### Acceptance criteria

- Report is generated from snapshot ID/version, has disclaimer and exception/freshness notes, is private, and access authorization is checked at request time.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Expired signed link; generation failure; stale report after correction; cross-household ID.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Export and deletion
### US-041

**As a owner, I want to export household data, so we retain control of our information.**

#### Acceptance criteria

- Recent authentication and owner role required; export status is durable; archive has documented schema and no other household data; completion/access expires.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Large export; repeated request; membership change; generation failure.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
### US-042

**As a owner, I want to delete a household, so we can end use and remove data under policy.**

#### Acceptance criteria

- Flow explains grace/retention, requires typed confirmation and recent auth, revokes access, records protected audit evidence and performs staged deletion.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Sole owner vs other owners; active subscription; legal hold; backup expiry.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.
## Stripe and subscription
### US-043

**As a owner, I want to start or manage a subscription, so I can pay for the household plan.**

#### Acceptance criteria

- Checkout session is created server-side for authorized owner; webhook signature is verified from raw body; events are idempotent; entitlements reflect server state.
- An unauthorized or unauthenticated request receives no sensitive record data and makes no change.
- Validation failures preserve safe user input and identify actionable fields without logging sensitive values.
- Successful behaviour is covered by the most appropriate unit, integration, RLS or end-to-end test.

#### Edge cases and failure conditions

- Forged/replayed event; delayed event; duplicate customer; failed payment; test/live key mix.
- Duplicate/retried requests do not create unintended duplicate financial records.
- Unexpected failures receive a correlation identifier and leave data in a valid state.


## Global acceptance criteria

Every MVP module must additionally satisfy:

1. Keyboard and screen-reader completion of the primary path.
2. Responsive operation at supported mobile, tablet and desktop widths.
3. No privileged secret, raw token, financial note or imported row in client logs or monitoring.
4. Consistent loading, empty, error, permission and retry states.
5. Audit events for defined sensitive operations.
6. Documentation and migration impact reviewed before merge.
7. Feature-flagged or unavailable modules do not imply completed functionality publicly.
