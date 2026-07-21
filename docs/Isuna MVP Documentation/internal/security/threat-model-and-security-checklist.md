# Threat Model and Security Checklist

> **Classification:** Internal  
> **Authority:** Threat and review authority  
> **Audience:** Founder and Cursor  
> **Status:** Founding MVP baseline  
> **Last reviewed:** 2026-07-16


## Method

This model uses STRIDE categories (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) plus privacy and development-tool risks. Likelihood and impact are qualitative planning values, not measured probabilities. Reassess each milestone, after architecture changes and before launch.

### Assets

Identity/session material; household membership; financial records and notes; closed snapshots/reports; exports; payment entitlements; audit evidence; provider secrets; backups; repository and CI/CD.

### Trust boundaries

Browser ↔ SvelteKit; SvelteKit ↔ Supabase Auth/PostgreSQL/Storage; app ↔ Stripe/Resend/Sentry; GitHub Actions ↔ deployment; founder/Cursor ↔ repository/context; production ↔ backup/restore environments.

### Highest-priority abuse case

A valid user from Household B knows or guesses an identifier from Household A and attempts every read/write/download/export/close path. This must fail at the server and database/storage layers without revealing the record.

## T-01: Cross-household access

- **Scenario:** An authenticated member changes a UUID or query and reads another household’s balances or notes.
- **Likelihood:** Medium.
- **Impact:** Critical.
- **Prevention:** Direct household ownership; server membership checks; RLS; composite ownership FKs; generic errors.
- **Detection:** RLS denial/error trends, suspicious sequential resource probes, audit anomalies.
- **Response:** Contain account/session, review affected tables/logs, fix policy, assess breach/notify as required.
- **Test strategy:** Known foreign UUID read/write tests for every table, endpoint, storage object and export.
## T-02: IDOR

- **Scenario:** A route loads `/accounts/<known-id>` without validating household membership.
- **Likelihood:** High without controls.
- **Impact:** High.
- **Prevention:** Query under RLS and authorized household; never fetch then compare only in UI; opaque IDs are not a control.
- **Detection:** 404/403 patterns and code review of resource lookups.
- **Response:** Disable route, patch all similar resources, test tenant scope, review access evidence.
- **Test strategy:** E2E request with another tenant’s record ID must reveal no record and make no mutation.
## T-03: Broken RLS

- **Scenario:** A new table has RLS disabled, missing `with check`, or a policy allows all authenticated users.
- **Likelihood:** Medium.
- **Impact:** Critical.
- **Prevention:** Migration checklist; enable/force RLS; separate action policies; policy helpers reviewed; CI database tests.
- **Detection:** Schema audit query lists exposed tables/policies; canary cross-tenant tests.
- **Response:** Restrict API/grants, patch policy, rotate exposed links if needed, scope investigation.
- **Test strategy:** Automated policy catalogue plus owner/editor/other/anonymous CRUD matrix.
## T-04: Authentication bypass

- **Scenario:** Server trusts decoded/unverified token or protected UI layout while endpoint remains open.
- **Likelihood:** Low-Medium.
- **Impact:** Critical.
- **Prevention:** Current Supabase SSR validation; endpoint auth; safe callback handling; no client auth authority.
- **Detection:** Unexpected anonymous data queries, auth error dashboards.
- **Response:** Disable affected endpoint, revoke sessions if needed, patch and assess exposure.
- **Test strategy:** Anonymous/direct endpoint tests, forged/expired token tests, callback state tests.
## T-05: Session theft

- **Scenario:** Cookie/token leaks through XSS, logs, URLs, device compromise or support screenshot.
- **Likelihood:** Medium.
- **Impact:** High.
- **Prevention:** Secure cookie guidance, CSP, output escaping, no tokens in URLs/logs, short-lived links, provider MFA.
- **Detection:** New-location/security alerts where available, token use anomalies, CSP reports.
- **Response:** Revoke sessions, rotate secrets if systemic, notify affected user, patch leak.
- **Test strategy:** XSS tests, log-scrub tests, cache tests, stolen/expired session negative tests.
## T-06: Privilege escalation

- **Scenario:** Editor modifies role, approves exception, closes/corrects, exports or deletes as owner.
- **Likelihood:** Medium.
- **Impact:** High.
- **Prevention:** Central permission matrix; server role check; RLS/function role checks; immutable role fields to editor.
- **Detection:** Audit alerts for sensitive events and denied owner actions.
- **Response:** Revoke unauthorized action, preserve audit, correct state through versioned workflow.
- **Test strategy:** Editor attempts every owner-only action through UI and direct requests.
## T-07: Invitation abuse

- **Scenario:** Attacker guesses/reuses token, floods invites, joins with wrong email or invites self into target.
- **Likelihood:** Medium.
- **Impact:** High.
- **Prevention:** Strong random token, hash at rest, expiry, single use, recipient policy, owner auth, rate limit/revoke.
- **Detection:** Invite volume/failure metrics, duplicate acceptance alerts.
- **Response:** Revoke invites, remove unauthorized membership, rotate token implementation if weak, assess access.
- **Test strategy:** Expired/revoked/reused/wrong-recipient/concurrent acceptance and rate tests.
## T-08: Account takeover

- **Scenario:** Password reset, email account compromise, credential stuffing or OAuth-link confusion gives attacker control.
- **Likelihood:** Medium.
- **Impact:** Critical.
- **Prevention:** Provider protections, generic recovery, rate limits, recent auth, security notifications, future MFA readiness.
- **Detection:** Auth provider alerts, login/reset anomalies, sensitive action alerts.
- **Response:** Lock/recover identity, revoke sessions, reverse unauthorized membership/billing changes, notify.
- **Test strategy:** Enumeration, reset replay, OAuth collision, sensitive action recent-auth tests.
## T-09: Malicious CSV uploads

- **Scenario:** Oversized/pathological file exhausts memory or parser bug corrupts imports.
- **Likelihood:** High.
- **Impact:** High.
- **Prevention:** Byte/row/column/field limits, streaming/bounded parser, content validation, timeout, preview, sandboxed data treatment.
- **Detection:** Upload size/failure/latency alerts, memory/error monitoring.
- **Response:** Disable import, delete artefact, patch parser/limits, review committed rows.
- **Test strategy:** Malformed quoting/encoding, huge fields, row bombs, duplicate retries, parser fuzz fixtures.
## T-10: Formula injection

- **Scenario:** User-controlled text exported to CSV opens as executable spreadsheet formula.
- **Likelihood:** Medium.
- **Impact:** High.
- **Prevention:** Neutralize dangerous prefixes on export; separate typed numeric columns; warning and tests.
- **Detection:** Export safety tests and reports of blocked/suspicious values.
- **Response:** Disable export version, regenerate safely, notify downloaders if exposure plausible.
- **Test strategy:** Fields beginning `= + - @ tab CR`, Unicode variants and multiple spreadsheet apps.
## T-11: Malicious file uploads

- **Scenario:** Future attachment or retained CSV disguises executable/HTML content or public object.
- **Likelihood:** Medium.
- **Impact:** High.
- **Prevention:** Private bucket, allowlist and content checks, no active rendering, random key, size limits, short retention.
- **Detection:** Storage inventory scans, public-policy audit, unusual MIME/extension mismatch.
- **Response:** Quarantine/delete, revoke URLs, patch policy, assess downloads.
- **Test strategy:** Polyglot/mismatched MIME, SVG/HTML, public URL and cross-household download tests.
## T-12: Stripe webhook forgery

- **Scenario:** Attacker posts fake paid event to unlock subscription.
- **Likelihood:** Medium.
- **Impact:** High.
- **Prevention:** Verify signature from raw body, correct environment secret, idempotent event table, validate event/object mapping.
- **Detection:** Signature failures, unknown event/customer alerts, entitlement reconciliation.
- **Response:** Disable entitlement change, replay verified events, correct subscription state, rotate webhook secret if exposed.
- **Test strategy:** Forged/modified body, replay, out-of-order, duplicate and test/live mismatch.
## T-13: Service-role-key leakage

- **Scenario:** Secret enters client bundle, Git history, Cursor context, logs or preview environment.
- **Likelihood:** Low-Medium.
- **Impact:** Critical.
- **Prevention:** Server-only env, secret scanning, restricted use, no `PUBLIC_`, build inspection, separate env, rotation runbook.
- **Detection:** GitHub/provider secret alerts, bundle scan, anomalous bypass queries.
- **Response:** Rotate immediately, invalidate deployments, audit database access, notify/assess breach.
- **Test strategy:** CI grep/bundle test, environment exposure review, canary least-privilege tests.
## T-14: PDF-link exposure

- **Scenario:** Long-lived/public signed URL leaks monthly report through email, logs or browser history.
- **Likelihood:** Medium.
- **Impact:** High.
- **Prevention:** Private bucket, short expiry, authorize each issuance, no URL logging, optional server streaming.
- **Detection:** Download/access logs, signed-link creation anomalies.
- **Response:** Revoke/delete object/version link, regenerate path if needed, assess recipient scope.
- **Test strategy:** Expired link, removed member, foreign household, referer/log inspection.
## T-15: Sensitive logging

- **Scenario:** Errors capture form bodies, balances, transaction descriptions, tokens or CSV lines in Sentry/logs.
- **Likelihood:** High without controls.
- **Impact:** High.
- **Prevention:** Default-deny logging, structured allowlist, Sentry beforeSend scrub, no request-body capture, test fixtures.
- **Detection:** Automated log scans/DLP patterns and periodic sampled review.
- **Response:** Delete where supported, restrict access, rotate secrets/tokens, assess exposure.
- **Test strategy:** Trigger representative errors and inspect all logs/traces/events.
## T-16: Export abuse

- **Scenario:** Compromised/editor account generates whole-household archive or downloads another tenant’s export.
- **Likelihood:** Medium.
- **Impact:** Critical.
- **Prevention:** Owner+recent auth, RLS scope, durable request ownership, rate limit, short expiry, notification, audit.
- **Detection:** Export volume/download alerts, ownership mismatch failures.
- **Response:** Revoke archive/access, lock account/session, notify household, assess data scope.
- **Test strategy:** Editor/removed member/foreign ID/replay/concurrent export tests.
## T-17: Deletion abuse

- **Scenario:** Attacker or editor destroys household, or retry deletes wrong tenant.
- **Likelihood:** Low-Medium.
- **Impact:** Critical.
- **Prevention:** Owner+recent auth, typed confirmation, grace/tombstone, membership safeguards, idempotent scoped job, backup process.
- **Detection:** Deletion event alerts and job reconciliation.
- **Response:** Stop job, restore within policy, lock account, investigate/notify.
- **Test strategy:** Editor, sole-owner, multiple-owner, foreign ID, job retry and partial failure tests.
## T-18: Audit-log tampering

- **Scenario:** Privileged bug or attacker alters/deletes evidence of role/close/export actions.
- **Likelihood:** Low.
- **Impact:** High.
- **Prevention:** Append-only normal access, restricted service function, external log copies/tamper evidence, backup.
- **Detection:** Sequence/hash gaps, denied mutation alerts, expected-event reconciliation.
- **Response:** Preserve alternate evidence, restrict credentials, rebuild/annotate log, investigate scope.
- **Test strategy:** Direct update/delete denial, privileged misuse review, gap detection tests.
## T-19: Backup exposure

- **Scenario:** Production backup or restore copy is downloaded, broadly accessible or used in unsafe staging.
- **Likelihood:** Low-Medium.
- **Impact:** Critical.
- **Prevention:** Provider access control/MFA, encrypted managed backups, isolated restore, no email/webhooks, deletion and access logs.
- **Detection:** Provider audit logs, unexpected export/restore activity.
- **Response:** Revoke access, destroy copies, rotate credentials, assess/report breach.
- **Test strategy:** Restore runbook review, access-role test, staging outbound-call kill switches.
## T-20: Dependency vulnerabilities

- **Scenario:** Compromised npm package/action exfiltrates env or introduces XSS/RCE.
- **Likelihood:** Medium.
- **Impact:** Critical.
- **Prevention:** Minimal deps, lockfile, audits/alerts, pinned actions, restricted CI permissions, review install scripts/updates.
- **Detection:** Dependabot/security advisories, SCA, runtime anomalies.
- **Response:** Remove/upgrade, rotate possibly exposed secrets, rebuild clean, investigate.
- **Test strategy:** CI audit, action permission review, build in clean environment, dependency inventory.
## T-21: AI development-tool exposure

- **Scenario:** Production data/secrets or proprietary threat details are sent to Cursor/model provider or agent modifies broad code unsafely.
- **Likelihood:** Medium.
- **Impact:** High.
- **Prevention:** Sanitized context, exclude secret/data files, focused prompts/diffs, manual review, provider settings review, no autonomous deploy.
- **Detection:** Secret scanning, review agent changes, provider/audit logs where available.
- **Response:** Rotate secrets, delete shared context where possible, revert/review changes, assess data exposure.
- **Test strategy:** Canary secret exclusion, prompt/diff review checklist, simulate unsafe RLS suggestion.

## Reusable security checklists

### New database table

- [ ] Purpose and data classification documented.
- [ ] Direct `household_id` or enforced ownership path.
- [ ] Foreign keys/checks/uniques prevent invalid cross-household state.
- [ ] RLS enabled/forced as appropriate before exposure.
- [ ] `select`, `insert`, `update`, `delete` policies reviewed separately.
- [ ] Anonymous, owner, editor, removed-member and foreign-household tests.
- [ ] Archive/deletion/backup/export handling defined.
- [ ] Indexes support policy/query paths without leaking through functions.
- [ ] Audit and sensitive-log treatment defined.

### New server action or endpoint

- [ ] Authentication source is verified server-side.
- [ ] Authorization and role checked for the exact operation.
- [ ] Input parsed with bounded schema; IDs remain untrusted.
- [ ] Database query/RPC still relies on RLS/constraints.
- [ ] CSRF/origin/idempotency/replay requirements considered.
- [ ] Safe error mapping; no existence leak.
- [ ] Rate/abuse limit considered.
- [ ] Sensitive fields excluded from logs/monitoring.
- [ ] Negative direct-request tests included.

### New route

- [ ] Correct public/auth/app route group.
- [ ] Server load protects sensitive data; endpoint cannot bypass layout.
- [ ] Private/no-store cache policy as needed.
- [ ] No secret or excessive data serialized to browser.
- [ ] Accessibility, error, empty and permission states.
- [ ] Cross-household path/query parameter tests.

### New upload

- [ ] Business purpose and retention approved.
- [ ] Size/type/content/row/decompression limits.
- [ ] Private object store and random key.
- [ ] Parser treats content as data only.
- [ ] Malware/active-content approach appropriate to type.
- [ ] Cross-household upload/download tests.
- [ ] Orphan/expiry deletion and monitoring.
- [ ] Content excluded from logs and AI tools.

### New integration

- [ ] Provider due diligence, region/subprocessor and data fields documented.
- [ ] Interface boundary and failure modes.
- [ ] Server-only keys, least scopes and environment separation.
- [ ] Signed webhooks/callback state and replay/idempotency.
- [ ] Timeouts, retries and circuit/fallback behaviour.
- [ ] Data retention/deletion/export/privacy notice impact.
- [ ] Monitoring, reconciliation and incident contact.
- [ ] Contract/pricing exit risk.

### Sprint completion

- [ ] Acceptance and abuse cases pass.
- [ ] RLS database tests pass.
- [ ] Secrets/dependency scan clean.
- [ ] Logs inspected for representative failures.
- [ ] Audit events and monitoring added.
- [ ] Documentation/decision/threat model updated.
- [ ] No critical/high finding deferred without explicit block.

### Production release

- [ ] CI from clean commit; protected approval.
- [ ] Migration backup and rollback/forward-fix plan.
- [ ] Production environment values verified without exposing them.
- [ ] Security smoke tests and tenant canary pass.
- [ ] Monitoring/alerts active and owned.
- [ ] Public status/copy matches actual feature.
- [ ] Release notes include security/privacy changes.
- [ ] Rollback does not violate migrated data/snapshot integrity.
