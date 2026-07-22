# Isuna

Canadian-first Family Financial Operating System (founding MVP).

> See your whole financial picture, know what needs attention, and decide what comes next—together.

## Development model

The founder is the sole developer. Cursor is a mentor/reviewer, not an autonomous builder.

## Stack

- SvelteKit, Svelte 5, TypeScript, Tailwind CSS
- Bits UI (headless) + Isuna-owned components
- Supabase, Vercel, Vitest, Playwright
- Node production LTS + pnpm (pinned in `.nvmrc` / `package.json`)

## Prerequisites

- Node `24.18.0` (from `.nvmrc`; production LTS per OD-03)
- pnpm `10.15.1` (from `packageManager` / Corepack)
- Supabase CLI `2.109.1` (local stack; upgrade deliberately when needed)

```bash
nvm use
node -v
pnpm -v
```
