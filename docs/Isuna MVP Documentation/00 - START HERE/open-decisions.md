# Open Decisions

> **Classification:** Internal  
> **Authority:** Decision authority  
> **Audience:** Founder; consult Cursor and advisers as needed  
> **Status:** Founding MVP baseline  
> **Last reviewed:** 2026-08-04


## Decision policy

The project must keep moving without pretending unresolved choices are final. Each item below has a recommended default that may be implemented provisionally. A decision becomes final only when the founder changes its status to **Approved**, records the date and rationale, and updates dependent documents in the same pull request.

## Decision changed

- **2026-07-20 — OD-03:** Founder approved stack version currency (option 3): prefer latest stable non-prerelease for all stack tools; Node.js follows the nodejs.org production recommendation (Active LTS) at scaffold and deliberate upgrades; exact versions remain lockfile-pinned. Dependent architecture, standards, security, quality, Cursor guide, roadmap, and repository README sections updated in the same change set.
- **2026-07-21 — OD-03 versions recorded:** Node `24.18.0`, pnpm `10.15.1`, Supabase CLI upgraded `2.90.0` → `2.109.1` (Homebrew). App Node remains nvm-pinned LTS; Homebrew Node is unused for the project.
- **2026-07-21 — Sprint 2 Checkpoint 1 (auth architecture):** Founder approved identity/session/profile foundation decisions: `getAuthContext()` uses `getClaims()` (with `getUser()` only when Auth-server freshness is required); profiles PK `user_id`; profile create via `auth.users` insert trigger plus idempotent app ensure; own-user profile RLS only (no anon/public profile reads); profile defaults `locale = en-CA`, `timezone = America/Edmonton`; protected empty shell at `/app`; email must be verified before `(app)` access. Dependent auth architecture, playbook, roadmap, database model, and security plan updated. **OD-10** remains provisional until Sprint 3 (households). **OD-19** recorded Approved.
- **2026-08-04 — OD-19 clarification (Sprint 2 exit):** Founder confirmed that “verified email” means proof of inbox access. Completing Supabase password recovery (reset link) confirms the email the same way signup confirmation does; Google OAuth with a verified provider email also qualifies. UX must state this on the recovery password page (`?from=recovery`). No change to the Approved gate: unverified identities still cannot use `(app)` / `/app`.

## Current decisions

### OD-01: Launch pricing and free tier

- **Why it matters:** Affects Stripe scope, entitlement modelling and public copy.
- **Recommended default:** Ship a private beta without payment enforcement; implement subscription records and Stripe test-mode plumbing late in MVP.
- **Alternatives:** Free MVP; paid beta; freemium with limits.
- **Decide by:** Before Sprint 12.
- **Blocks the MVP:** No, if billing is feature-flagged.
- **Status:** Recommended default accepted provisionally until the founder records a change.
### OD-02: Accessible component approach

- **Why it matters:** Controls accessibility burden and design-system ownership.
- **Recommended default (Approved):** Use Bits UI headless Svelte 5 primitives plus Isuna-owned Tailwind components; evaluate shadcn-svelte only as source inspiration.
- **Alternatives:** Native HTML only; shadcn-svelte components; another audited library.
- **Decide by:** Sprint 1.
- **Blocks the MVP:** No.
- **Status:** Approved — 2026-07-20. Owner: Founder. Rationale: Recommended default accepted.
### OD-03: Package manager, Node channel, and stack version currency

- **Why it matters:** Determines lockfile, CI, local consistency, and how dependencies are selected and upgraded across the stack.
- **Recommended default (Approved):** Prefer the latest **stable** (non-prerelease) version of every stack tool, with these rules:
  - **Package manager:** pnpm, pinned via Corepack / `packageManager` and the lockfile when the repository is created.
  - **Node.js:** At repository scaffold and at deliberate Node upgrades, use whatever [nodejs.org](https://nodejs.org) recommends for **production** (Active LTS channel). Pin the exact version in `.nvmrc` and `package.json` `engines` once scaffolding exists.
  - **Other stack packages** (SvelteKit, Svelte 5, TypeScript, Tailwind, Bits UI, Supabase clients/CLI, Vitest, Playwright, ESLint tooling, Stripe/Resend/Sentry SDKs when added): select the newest stable release available at add or deliberate upgrade time—not alpha/beta/canary/RC unless the founder accepts temporary debt with a repayment trigger.
  - **Reproducibility:** “Latest stable” is a selection policy, not floating CI. Local installs and CI use the lockfile (`pnpm-lock.yaml`) and pinned Node/pnpm. Upgrades are intentional PRs with tests, not silent drift.
- **Alternatives:** npm; Bun; Yarn; pin Node Current instead of production LTS; allow prerelease defaults.
- **Decide by:** Sprint 1.
- **Blocks the MVP:** Yes for setup.
- **Status:** Approved — 2026-07-20. Owner: Founder. Rationale: option 3 — latest stable for the stack; Node follows the production recommendation (Active LTS) at scaffold/upgrade time; exact pins recorded after Foundation scaffolding.
### OD-04: Canonical money representation

- **Why it matters:** Affects every schema and calculation.
- **Recommended default:** Signed `bigint` integer minor units plus ISO 4217 currency code; percentages/rates as `numeric`, never binary float.
- **Alternatives:** PostgreSQL `numeric(19,4)` amounts; specialized money library.
- **Decide by:** Before first financial migration.
- **Blocks the MVP:** Yes.
- **Status:** Recommended default accepted provisionally until the founder records a change.
### OD-05: Household deletion grace period

- **Why it matters:** Balances privacy rights with accidental-loss protection.
- **Recommended default:** Immediate user lock plus 30-day recoverable tombstone, followed by hard deletion where legally and operationally permitted.
- **Alternatives:** Immediate hard delete; 7-day grace; 90-day grace.
- **Decide by:** Before data deletion feature.
- **Blocks the MVP:** No until Sprint 12.
- **Status:** Recommended default accepted provisionally until the founder records a change.
### OD-06: Month reopening policy

- **Why it matters:** Changes historical truth and audit complexity.
- **Recommended default:** Do not mutate a closed snapshot. Create an audited superseding close version while preserving prior versions; UI calls this “Correct and re-close.”.
- **Alternatives:** Owner-only reopen in place; support-only reopen; never correct.
- **Decide by:** Before month-close implementation.
- **Blocks the MVP:** Yes for Sprint 10.
- **Status:** Recommended default accepted provisionally until the founder records a change.
### OD-07: CSV import formats

- **Why it matters:** Affects parser architecture and onboarding success.
- **Recommended default:** Generic mapped CSV importer with saved mappings; include templates for major Canadian institutions only after tested samples are legally obtained.
- **Alternatives:** One strict Isuna template; per-bank custom importers.
- **Decide by:** Sprint 4.
- **Blocks the MVP:** No.
- **Status:** Recommended default accepted provisionally until the founder records a change.
### OD-08: Financial health score weights

- **Why it matters:** Can create false authority and user anxiety.
- **Recommended default:** Use a transparent, configurable informational score with five capped components and a “not enough data” state; never present as creditworthiness.
- **Alternatives:** No score at MVP; fixed opaque score; multiple scores.
- **Decide by:** Before dashboard.
- **Blocks the MVP:** No.
- **Status:** Recommended default accepted provisionally until the founder records a change.
### OD-09: Invitation expiry

- **Why it matters:** Affects abuse resistance and usability.
- **Recommended default:** Single-use invitation token expiring after 7 days, revocable by owner.
- **Alternatives:** 24 hours; 14 days; no expiry.
- **Decide by:** Sprint 3.
- **Blocks the MVP:** No.
- **Status:** Recommended default accepted provisionally until the founder records a change.
### OD-10: Household roles

- **Why it matters:** Determines authorization matrix.
- **Recommended default:** Owner and Editor for MVP; owner-only membership, billing, export, deletion and close correction.
- **Alternatives:** Add Viewer; granular permissions.
- **Decide by:** Sprint 3 (deferred; Sprint 2 has no households).
- **Blocks the MVP:** Yes.
- **Status:** Recommended default accepted provisionally until the founder records a change. Remains provisional after Sprint 2 Checkpoint 1 (2026-07-21).
### OD-11: Account balance source of truth

- **Why it matters:** Impacts reconciliation and net worth.
- **Recommended default:** Posted transaction ledger plus explicit balance adjustments/opening balance; reconciled statement balances anchor closed snapshots.
- **Alternatives:** Manually entered current balance only; event-sourced ledger.
- **Decide by:** Before accounts/transactions.
- **Blocks the MVP:** Yes.
- **Status:** Recommended default accepted provisionally until the founder records a change.
### OD-12: PDF generation runtime

- **Why it matters:** Affects Vercel limits and report reproducibility.
- **Recommended default:** Generate authenticated print HTML, then render with Playwright in a controlled server/job environment; store private PDF and hash.
- **Alternatives:** Browser print only; third-party PDF API; direct PDF library.
- **Decide by:** Sprint 10.
- **Blocks the MVP:** No until reports.
- **Status:** Recommended default accepted provisionally until the founder records a change.
### OD-13: Data residency and vendor regions

- **Why it matters:** Important for Canadian trust and privacy disclosures.
- **Recommended default:** Select Canadian regions where supported and document every subprocessor/region; do not claim all data remains in Canada unless verified.
- **Alternatives:** US regions; self-hosting.
- **Decide by:** Before production vendor setup.
- **Blocks the MVP:** No for local development; yes for launch claims.
- **Status:** Recommended default accepted provisionally until the founder records a change.
### OD-14: Analytics product

- **Why it matters:** Sensitive financial context limits acceptable telemetry.
- **Recommended default:** No session replay on financial screens; collect minimal first-party events or privacy-configured analytics with no amounts/descriptions.
- **Alternatives:** Vercel Analytics; PostHog with strict controls; no analytics.
- **Decide by:** Before beta.
- **Blocks the MVP:** No.
- **Status:** Recommended default accepted provisionally until the founder records a change.
### OD-15: Email provider and sender domain

- **Why it matters:** Affects deliverability and invitation flows.
- **Recommended default:** Resend with a dedicated authenticated subdomain and environment-specific sender identities.
- **Alternatives:** Supabase SMTP default; Postmark; Amazon SES.
- **Decide by:** Sprint 3.
- **Blocks the MVP:** No.
- **Status:** Recommended default accepted provisionally until the founder records a change.
### OD-16: Province-specific privacy review

- **Why it matters:** Alberta and British Columbia have private-sector laws that may apply alongside or instead of PIPEDA.
- **Recommended default:** Obtain Canadian privacy counsel review before public launch; build to PIPEDA principles as baseline now.
- **Alternatives:** Founder-only assessment; delay affected provinces.
- **Decide by:** Before public launch.
- **Blocks the MVP:** No for MVP build; yes for launch.
- **Status:** Recommended default accepted provisionally until the founder records a change.
### OD-17: Investment projection assumptions

- **Why it matters:** Creates regulatory and trust risk.
- **Recommended default:** User-entered nominal return/inflation assumptions with visible ranges, no recommendation, and persistent disclaimer.
- **Alternatives:** Fixed defaults only; omit FI scenario.
- **Decide by:** Sprint 8.
- **Blocks the MVP:** No.
- **Status:** Recommended default accepted provisionally until the founder records a change.
### OD-18: Import file retention

- **Why it matters:** Affects breach impact and supportability.
- **Recommended default:** Parse transiently; retain original CSV only when user explicitly opts in, encrypted/private, with short retention and deletion controls.
- **Alternatives:** Always retain; never retain.
- **Decide by:** Sprint 4.
- **Blocks the MVP:** No.
- **Status:** Recommended default accepted provisionally until the founder records a change.
### OD-19: Email verification before protected app access

- **Why it matters:** Separates “account exists” from “trusted identity may enter the application”; reduces abuse and aligns with Canadian trust expectations before any financial data.
- **Recommended default (Approved):** Require a verified email (Supabase Auth email confirmation, or equivalent verified identity from Google OAuth) before access to `(app)` routes, including the empty `/app` shell. Unverified sessions may use auth/recovery flows only.
- **Alternatives:** Allow unverified access to empty shell with banner; verify only before household creation.
- **Decide by:** Sprint 2.
- **Blocks the MVP:** Yes for auth foundation.
- **Status:** Approved — 2026-07-21; clarified 2026-08-04. Owner: Founder. Rationale: Sprint 2 Checkpoint 1; security plan preferred verification before sensitive use; extend the gate to all protected app routes. Clarification: recovery-link completion is accepted as email verification (inbox proof), with UX clarity on the change-password page; not a bypass of OD-19.


## Decision record template

```text
Decision ID:
Decision:
Status: Proposed | Approved | Reversed | Superseded
Date:
Owner: Founder
Context:
Options considered:
Decision and rationale:
Security/privacy impact:
Documents and migrations affected:
Rollback or migration plan:
```
