# Contributing to Isuna

Thank you for your interest in Isuna. The project is founder-led, and the founder remains the sole developer and final reviewer during the MVP.

## Before contributing

- Do not submit real household financial data, credentials, private reports or production logs.
- Review the public issue/discussion process before beginning substantial work.
- Security vulnerabilities must follow `SECURITY.md`, not a public issue.
- A proposed feature must fit the approved MVP scope or post-MVP roadmap.

## Development principles

- Prefer small, understandable changes.
- Keep business logic out of presentation components.
- Perform authorization on the server and enforce household isolation with PostgreSQL Row Level Security.
- Never use a service-role key in browser code or as a normal user-request shortcut.
- Never trust a household ID, role, entitlement or financial total supplied by the browser.
- Store money using the project’s exact minor-unit/decimal-safe strategy.
- Do not mutate closed snapshots.
- Add or update tests and documentation with behaviour changes.
- Preserve keyboard and screen-reader accessibility.

## Setup

Follow the repository README and `.env.example`. Use synthetic data only. Tool versions and exact commands are pinned in repository configuration once the Foundation Sprint is complete.

## Branches and commits

Use a short-lived branch such as:

```text
feat/account-archive
fix/transaction-split-total
docs/public-roadmap
```

Keep commits focused and use descriptive messages, for example:

```text
feat(accounts): add archive validation
fix(rls): prevent foreign category assignment
test(close): cover duplicate idempotency key
```

## Pull request requirements

A pull request should include:

- the user outcome;
- relevant issue or documentation;
- files and architecture affected;
- migration and data impact;
- tests actually run and their results;
- manual verification;
- security, privacy and accessibility considerations;
- screenshots using synthetic data where useful;
- rollout and rollback/forward-fix notes;
- documentation updated.

Do not claim tests were run when they were not. Do not include unrelated generated rewrites.

## Database changes

- Add a new versioned migration; do not edit one already shared/deployed.
- Include ownership, constraints, indexes, archive/delete behaviour and RLS policies.
- Test Owner, Editor, another household, removed member and anonymous access as applicable.
- Review `security definer` functions, grants and `search_path` carefully.
- Regenerate database types and update architecture documentation.

## Dependencies

Explain why a new dependency is needed, alternatives considered, licence, maintenance/security status and bundle/runtime impact. A dependency should not be added simply because generated code expects it.

## AI-assisted contributions

AI tools may help explain, review or draft focused code, but the contributor is responsible for every line. Do not provide AI tools with production secrets or real user data. Large autonomous code drops or changes that bypass project security rules will not be accepted.

## Code of interaction

Be respectful, specific and focused on the work. Financial circumstances can be sensitive; avoid judgemental language in code, tests, issues and product copy.

## Review authority

The founder may request changes, narrow a proposal, postpone it or decline it to protect MVP scope, security, maintainability or learning goals.
