# Security and Privacy Plan

> **Classification:** Internal  
> **Authority:** Security and privacy control authority  
> **Audience:** Founder and Cursor  
> **Status:** Founding MVP baseline  
> **Last reviewed:** 2026-07-16


## 1. Scope and posture

Isuna stores highly sensitive household financial information. The MVP is not a bank and does not move money, but confidentiality, integrity, availability and user control are product requirements. Security is implemented through layered controls rather than a single vendor feature.

This plan is a technical and organizational baseline, not legal advice or a certification. Canadian privacy counsel should review the production service, provincial applicability, contracts, notices, retention and incident process before public launch.

## 2. Security principles

1. **Default deny.** Access must be explicitly established by verified identity, active household membership and role.
2. **Defence in depth.** Server authorization, PostgreSQL RLS, constraints, private storage and monitoring overlap.
3. **Least privilege.** Browser clients receive public keys and minimum data; service-role access is exceptional.
4. **Minimize blast radius.** Collect less, retain less, separate environments and use short-lived links/tokens.
5. **Integrity before convenience.** Reconciliation, transactions, idempotency and immutable snapshots take precedence over shortcuts.
6. **No secret security assumptions.** Public-facing design can be explained without revealing exploitable details; internal threat specifics remain private.
7. **Privacy by design.** Purposes, collection, analytics, access, export and deletion are considered before data is added.
8. **Fail safely.** An error must not widen access, partially close a period or expose another tenant’s existence.
9. **Evidence.** Tests, audit events, deployment records, restore exercises and reviews support claims.
10. **Founder comprehension.** The sole developer must understand every privileged path and response plan.

## 3. Data classification

| Class | Examples | Handling baseline |
|---|---|---|
| Restricted | credentials, session material, invitation/recovery tokens, service keys, webhook secrets | Never log or expose; secret manager/environment only; strict access; rotate on suspicion |
| Highly sensitive financial | balances, transactions, debts, investments, income, reports, CSV rows, meeting notes | Encrypt in transit/at rest through providers; tenant isolation; private storage; minimal telemetry; controlled retention |
| Personal | name, email, household membership, notification preferences, locale | Purpose-limited access; protect from enumeration; export/deletion rights |
| Security/operational | audit events, IP-derived abuse signals, provider IDs, error correlation IDs | Allowlisted metadata; retention; restricted access; no unnecessary financial content |
| Public | published documentation, product descriptions, public roadmap | Review for accuracy, confidentiality and unsupported security claims |

A data inventory records field, purpose, source, lawful/consent rationale as applicable, system/vendor, retention, access roles, export/deletion treatment and logging restrictions.

## 4. PIPEDA-oriented privacy baseline

The Office of the Privacy Commissioner of Canada describes ten fair information principles: accountability; identifying purposes; consent; limiting collection; limiting use, disclosure and retention; accuracy; safeguards; openness; individual access; and challenging compliance. Isuna should map product and operational controls to these principles and to applicable provincial private-sector law.

### Accountability

- Name a privacy owner (initially the founder) and backup contact.
- Maintain policies, data inventory, vendor/subprocessor register and training notes.
- Review vendors and contractual data-processing/security terms.
- Record privacy impact decisions for new sensitive features.

### Identifying purposes and consent

- Explain why each onboarding field, upload and notification is needed.
- Separate essential processing from optional analytics/marketing.
- Do not reuse financial descriptions or report contents for model training, advertising or unrelated analytics.
- Record material consent versions where required.

### Limiting collection, use and retention

- Do not collect bank credentials in the manual MVP.
- Avoid retaining original CSVs by default after successful import unless the user opts in and retention is stated.
- Do not collect SIN, government IDs, credit scores or tax documents in MVP.
- Delete transient exports, signed links, invitation tokens and failed-upload artefacts on schedule.
- Define backup expiry honestly; deletion from active data is not immediate disappearance from every backup.

### Accuracy and access

- Reconciliation and as-of dates help users understand accuracy.
- Users can correct open data and create audited corrections for closed periods.
- Provide machine-readable export and a process for access/correction inquiries.

### Safeguards and openness

- Safeguards scale to the sensitivity of household financial data.
- Public privacy/security overview uses plain language without publishing policy internals.
- The production privacy notice identifies purposes, vendors/categories, retention, rights and contact process.

### Breach obligations

Maintain a breach log. Assess whether a breach creates a real risk of significant harm and obtain legal/privacy guidance on reporting and notification obligations. Preserve evidence, contain first, and communicate facts without speculation.

Official references to review before launch:

- `https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/`
- `https://www.priv.gc.ca/en/privacy-topics/business-privacy/breaches-and-safeguards/privacy-breaches-at-your-business/gd_pb_201810/`
- `https://laws-lois.justice.gc.ca/eng/acts/P-8.6/`

## 5. Data minimization rules

Before adding a field, answer:

1. Which user outcome requires it?
2. Can it be derived temporarily instead of stored?
3. Is a less precise value sufficient?
4. Does it need history?
5. Who needs to read it?
6. Should it appear in export, audit, logs or reports?
7. When can it be deleted?
8. What happens if it is breached?

No field is added because it “might be useful for AI later.”

## 6. Authentication security

- Use Supabase Auth; never handle password hashes directly.
- Require email verification before sensitive household use according to approved UX.
- Configure strong password policy and rate/abuse controls supported by provider.
- Use generic reset/invitation responses to limit account enumeration.
- OAuth callback validates state and an allowlisted return destination.
- Require recent authentication for export, deletion, email/security changes and possibly billing/member removal.
- Plan for MFA as a post-MVP account-security enhancement; do not design a schema that blocks it.
- Notify users of important identity/security changes without including sensitive details.

## 7. Session security

- Follow current Supabase SSR cookie guidance.
- Cookies use secure attributes appropriate to environment; no tokens in URLs or local logs.
- Rotate/refresh through supported SDK flow; validate claims server-side.
- Sign-out clears relevant cookies and sensitive page responses are not shared-cacheable.
- Protect state-changing form actions against cross-site request threats using SvelteKit same-origin protections plus deliberate Origin/CSRF review for endpoints.
- Session identifiers and cookies are scrubbed from Sentry, logs and support screenshots.

## 8. Authorization and RLS

- Every household-owned table has an ownership path, RLS and cross-tenant tests.
- Every server action verifies authenticated identity and role.
- A route layout is not authorization for endpoints.
- Browser-supplied household/resource IDs are untrusted.
- Use composite foreign keys or constraint functions to prevent child/parent cross-household references.
- Snapshot/audit tables are append-only for normal roles.
- Service role never appears in browser code and is not used for routine requests.
- Review SQL functions for `security definer`, owner, grants and fixed `search_path`.

See `../architecture/authentication-multitenancy-and-rls.md`.

## 9. Secrets management

- Local secrets live in ignored `.env.local`; production secrets in Vercel/Supabase/provider environment management.
- `.env.example` contains names and comments only.
- Separate development, preview and production values.
- Do not paste production secrets into Cursor, chat, issues, screenshots, test fixtures or documentation.
- Restrict dashboard access and enable provider MFA.
- Rotate on staff/device compromise, repository exposure, build/log exposure or vendor incident.
- Maintain a secret register: owner, environment, purpose, rotation method and last rotation date—not the value.

## 10. Encryption

- HTTPS/TLS for all network traffic.
- Rely on managed provider encryption at rest only after verifying current vendor documentation and contracts.
- Consider application-level encryption for selected future fields only with a full key-management/recovery/search design; ad hoc encryption can increase data-loss risk.
- Tokens stored in the database are hashed where verification does not require recovery.
- Export archives and backups require private access; extra archive encryption is evaluated before launch.

Never claim “end-to-end encrypted” because the server must process financial data.

## 11. File and storage security

- Private buckets only for imports, reports and exports.
- Authorize upload intent and download at request time.
- Random/opaque object names; sanitize display filename separately.
- Allowlist extensions/MIME and inspect actual content enough for the use case.
- Set size, row, page and decompression limits.
- Do not execute or render uploaded HTML/scripts.
- Short-lived signed URLs; never log them.
- Delete orphaned uploads and expired exports through a monitored job.
- RLS/storage policies receive cross-household tests.

## 12. CSV-import security

CSV is untrusted input, even though it is text.

- Limit bytes, rows, columns and field lengths before expensive processing.
- Handle UTF encodings and malformed quoting predictably.
- Treat every value as text/data; no `eval`, dynamic SQL or template execution.
- Normalize headers without allowing prototype/property pollution patterns.
- Validate amounts/dates strictly and reject overflow.
- Show preview; do not commit automatically.
- Compute duplicate fingerprints with documented fields and let users review.
- Parse transiently; retain originals only under approved policy.
- Prevent formulas from becoming active in generated CSV exports.
- Scrub imported values from error logs.

## 13. Formula-injection prevention

When exporting CSV, spreadsheet software may execute cells beginning with `=`, `+`, `-`, `@`, tab or carriage return. Apply a documented neutralization strategy to all user-controlled text fields, such as prefixing with an apostrophe, and clearly distinguish this from numeric amount columns generated by Isuna. Test multiple spreadsheet applications. PDFs must escape HTML and disallow user HTML.

## 14. Rate limiting and abuse prevention

Apply provider/platform and application controls to:

- registration, sign-in, reset and OAuth callbacks;
- invitation create/resend/accept/revoke;
- CSV upload/preview/commit;
- report/export generation and downloads;
- data deletion requests;
- Stripe session creation and webhook endpoints;
- expensive search/filter ranges.

Keys may combine IP-derived pseudonymous signal, user ID, household ID and action. Avoid retaining raw IP longer than needed. Rate-limit failure responses without creating an enumeration side channel.

## 15. Audit logging

Audit high-impact events, not every keystroke. Record actor, household, event type, target identifier, time, request ID, safe reason code and allowlisted metadata. Never record passwords, tokens, complete notes, CSV rows or report contents. Make events append-only to normal roles and monitor anomalous gaps/tampering attempts.

## 16. Data export

- Owner + recent authentication.
- Durable request status and idempotency.
- Re-query scope from authorized household; never rely on a client-supplied object list.
- Include documented machine-readable data and a manifest/schema version.
- Neutralize spreadsheet formulas in CSV outputs.
- Private archive with short access expiry; delete according to retention.
- Audit request, completion, download and expiry.
- Rate limit and notify household appropriately.

## 17. Data deletion

- Explain account versus household deletion and effect on other members.
- Require recent auth, explicit confirmation and owner safeguards.
- Disable access at the approved point, cancel billing, revoke invitations/links, and queue staged deletion.
- Define records retained for legal/security reasons and backup expiry.
- Protect deletion jobs against cross-household IDs and retry duplication.
- Audit request/approval/completion using minimal retained evidence.
- Test partial failures and restoration during grace period.

## 18. Backups and recovery

- Verify Supabase backup capabilities, retention and point-in-time options for the selected plan before launch.
- Document recovery point objective (RPO) and recovery time objective (RTO) as operational targets after testing.
- Conduct a restore exercise into an isolated environment before launch and periodically thereafter.
- Ensure restored storage/report references are consistent or can be regenerated.
- Restrict backup access and ensure test restores do not send real emails or webhooks.
- A backup is not a substitute for snapshot immutability or migration rollback planning.

## 19. Incident response

### Roles

Founder is incident commander, technical lead, privacy lead and communications owner until delegated. Maintain external contacts for Supabase, Vercel, Stripe, Resend, Sentry, legal/privacy counsel and security assistance.

### Lifecycle

1. **Detect and triage:** open incident record, preserve timestamps/evidence, classify severity.
2. **Contain:** revoke/rotate credentials, disable affected path, isolate environment, block abuse.
3. **Assess:** data classes, households/users, time window, source, integrity and availability.
4. **Eradicate and recover:** patch, test, restore/reprocess, monitor recurrence.
5. **Notify/report:** follow applicable law/contracts and provide factual user guidance.
6. **Learn:** root cause, timeline, control/test/document changes, retained breach record.

Do not destroy logs prematurely, blame users, or claim scope is known before evidence supports it.

## 20. Dependency and supply-chain security

- Pin lockfile; use supported Node/package manager versions.
- Automated dependency review/audit and GitHub security alerts.
- Minimize dependencies; document why privileged or parsing libraries are needed.
- Review maintainer health, update cadence, license, transitive size and security history.
- Do not auto-merge major/security-sensitive updates without tests.
- Verify package names to avoid typosquatting.
- Restrict GitHub Actions permissions, pin third-party actions to immutable commits where practical, and protect production environments.
- Generate/review an SBOM or dependency inventory before launch.

## 21. Monitoring and privacy-conscious analytics

Sentry/event telemetry must scrub:

- request bodies and form data by default;
- cookies, auth headers and URLs containing tokens;
- transaction descriptions, notes, account/category custom names;
- financial amounts and report/import/export content;
- email addresses unless a specific support/security need is approved.

Product analytics use coarse events and no session replay on authenticated financial pages. A user’s financial data is not an advertising profile.

## 22. Secure development with Cursor

- Give Cursor repository code and sanitized fixtures, never production data or secrets.
- Disable or limit indexing of local secret files and exported real datasets.
- Ask Cursor to identify files read and assumptions.
- Require focused diffs; review every line before applying.
- Never accept “disable RLS,” “use service role,” broad grants or client-only authorization as a shortcut.
- Ask for abuse cases and cross-household tests with every data feature.
- Verify package/API suggestions against official current documentation.
- Do not let Cursor claim tests passed unless commands ran and output is available.
- Treat generated migrations and security policies as high-risk code requiring manual review and database tests.

## 23. Production security checklist

### Identity and access

- [ ] Provider accounts use MFA and least privilege.
- [ ] Auth redirect URLs are allowlisted per environment.
- [ ] Password/reset/email policies and abuse limits are tested.
- [ ] Owner/editor matrix is implemented and documented.

### Data and tenancy

- [ ] Every table/storage bucket has RLS/policies and cross-household tests.
- [ ] No normal request uses service role.
- [ ] Closed snapshots and audit events reject mutation.
- [ ] Export/deletion paths are scope-tested.

### Application

- [ ] Validation, error mapping, CSRF/origin review and secure headers complete.
- [ ] CSV/formula injection tests pass.
- [ ] No sensitive logging; Sentry scrubbing verified with test events.
- [ ] Rate limits and idempotency tests pass.

### Operations

- [ ] Secrets inventoried and environment-separated.
- [ ] Backup/restore exercise completed.
- [ ] Alerts have an owner and tested route.
- [ ] Incident contacts and runbook accessible out of band.
- [ ] Dependencies/actions reviewed and lockfile clean.
- [ ] Privacy notice, terms, disclaimer and subprocessor list reviewed.
- [ ] No critical/high security issue remains open.
