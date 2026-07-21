# Isuna

**Isuna** is a Canadian-first Family Financial Operating System in founding MVP development.

> **Product promise:** See your whole financial picture, know what needs attention, and decide what comes next—together.

Isuna is intended to connect household budgeting, transactions, reconciliation, debt, savings, investments, net worth, Monthly Money Meetings, immutable month-end snapshots and quarterly reviews in one secure workspace.

## Development status

This repository is under active development and is not a production release. Public descriptions identify intended MVP direction; not every feature is implemented. Do not use development builds for real household financial data.

## Development model

The founder is the sole developer. Cursor may be used as a senior mentor, reviewer and debugging partner, but it is not authorized to build or deploy the application autonomously. All code, migrations, tests and releases are reviewed and executed by the founder.

## Planned stack

- SvelteKit, Svelte 5, TypeScript and Tailwind CSS
- Bits UI or native accessible primitives
- Supabase Auth, PostgreSQL, Storage and Row Level Security
- Vercel, GitHub Actions, Stripe, Resend and Sentry
- Vitest and Playwright

## Documentation

The full founding package is under:

```text
docs/Isuna MVP Documentation/
```

Start with:

```text
docs/Isuna MVP Documentation/00 - START HERE/README.md
```

Internal architecture and security documentation is private by default. Only reviewed `public-docs/` and public repository files should be published.

## Local setup

The exact commands will be finalized during Foundation Sprint after the repository is scaffolded and tool versions are pinned. The intended flow is:

```bash
pnpm install
cp .env.example .env.local
supabase start
pnpm dev
```

Do not add real values to `.env.example` or commit `.env.local`.

## Quality

Expected checks will include formatting, linting, Svelte/TypeScript checking, unit tests, local database/RLS tests, production build and Playwright tests. A green browser UI is not sufficient evidence for tenant isolation or financial correctness.

## Security

Do not open public issues containing vulnerabilities, credentials or real financial data. Follow [`SECURITY.md`](SECURITY.md).

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). The founder reviews and approves all contributions.

## Disclaimer

Isuna is an organizational and planning tool. It is not professional financial, investment, tax, legal, accounting, credit or mortgage advice and does not guarantee financial results.

## Name

Isuna is inspired by **Ìṣúná**, the Yoruba word for “budget,” reflecting the founder’s Yoruba and Nigerian heritage.
