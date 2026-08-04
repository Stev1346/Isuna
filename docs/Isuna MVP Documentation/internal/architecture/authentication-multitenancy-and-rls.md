# Authentication, Multitenancy and Row Level Security

> **Classification:** Internal  
> **Authority:** Authorization authority  
> **Audience:** Founder and Cursor  
> **Status:** Founding MVP baseline  
> **Last reviewed:** 2026-07-21


## 1. Security model

Authentication answers **who is making the request**. Household membership and role answer **what that identity may do**. RLS ensures the database returns or changes only rows within those permissions. All three are required.

The application uses shared-schema multitenancy: all households use the same tables, and rows are partitioned logically by `household_id`. There is no database or schema per household.

## 2. Supabase Auth approach

MVP identity providers:

- email/password with verification;
- password recovery;
- Google OAuth;
- future MFA/passkeys only after explicit planning, while account-security UX should not prevent adding them.

Profiles are application records keyed by `auth.users.id` as `profiles.user_id`. Do not copy passwords or provider tokens into public tables. Treat email as mutable identity metadata, not a permanent business primary key.

**Verified access (OD-19):** Email must be verified (or the identity must be equivalently verified via Google OAuth) before any `(app)` route, including the empty `/app` shell. Unverified users stay on auth/recovery flows. Password recovery that successfully verifies a recovery token also sets email confirmation in Supabase Auth (inbox proof). Surface this in UX when landing from `?from=recovery`.

## 3. Session handling in SvelteKit

At implementation time follow current Supabase SSR documentation (`@supabase/ssr`) rather than deprecated Auth Helpers tutorials.

Recommended flow:

1. `hooks.server.ts` creates a request-scoped server Supabase client using the request/response cookie adapter (`getAll` / `setAll`).
2. The hook refreshes/validates auth material according to current SDK guidance.
3. `event.locals` exposes a narrow function `getAuthContext()` and the server client.
4. `getAuthContext()` verifies identity with **`auth.getClaims()`** (JWT signature / JWKS). Use **`auth.getUser()`** only when a fresh Auth-server user record is required (for example confirming email verification status). Do **not** authorize from **`auth.getSession()`**’s embedded user object—session cookies can be spoofed; `getSession` is for access/refresh token needs only.
5. Protected `(app)` layouts call `getAuthContext()`, enforce OD-19 verification, and redirect when identity is absent or unverified.
6. Server actions/endpoints independently authorize; a protected layout is not sufficient because endpoints can be called directly.
7. Responses containing financial (or future financial) data use private/no-store caching policy where appropriate.

Representative contract:

```ts
export type AuthContext = {
  userId: string;
  email?: string;
  emailVerified: boolean;
};

declare global {
  namespace App {
    interface Locals {
      supabase: import('@supabase/supabase-js').SupabaseClient;
      getAuthContext(): Promise<AuthContext | null>;
    }
  }
}
```

Do not claim a session is valid merely because a token payload can be decoded without signature verification. Re-check current Supabase SSR docs if claim APIs change; keep this contract stable for application code.

## 4. Browser versus server client

| Client | Key/context | Permitted use |
|---|---|---|
| Browser Supabase client | Public project URL + publishable/anon key, user session | Auth UI and carefully selected RLS-protected operations; prefer SvelteKit server actions for financial mutations. |
| Request-scoped server client | Public key + user cookies/claims | Queries executed as the authenticated user so RLS applies; normal application path. |
| Service/administrative client | Secret service-role key | Narrow server-only jobs that require bypass, with explicit authorization and audit. Never use for ordinary user requests. |

A service-role client bypasses RLS and therefore must never be used merely to “fix” a policy problem. Sprint 2 auth and profile paths must not use the service role.

## 5. Protected routes

Use route groups such as:

```text
src/routes/
  (public)/
  (auth)/                  # register, sign-in, forgot-password, callback/confirm
  (app)/
    +layout.server.ts      # require verified AuthContext (OD-19)
    +page                   # empty protected shell at URL /app
    account/...             # later profile/password
    households/[householdId]/...  # Sprint 3+
  api/webhooks/stripe/      # provider-authenticated, not user session
```

**Sprint 2 empty shell URL:** `/app` (route group `(app)` does not appear in the path; use a concrete `/app` segment or equivalent so the protected home is `/app`).

Redirect rules:

- Unauthenticated or unverified → `(app)/*` → allowlisted local sign-in/verify path (for example `/sign-in?redirectTo=…` with local-path allowlist only).
- OAuth and email confirmation callbacks exchange tokens into cookies, then return only to safe local paths.
- Never put tokens in logs, telemetry, or open redirects to absolute external URLs.

The `[householdId]` route value is untrusted input. Resolve membership before returning data. Prefer resource lookup by both `id` and authorized household, or rely on RLS plus explicit not-found handling that does not reveal cross-tenant existence.

## 5.1 Profiles (Sprint 2)

- Table `public.profiles` with PK/FK `user_id` → `auth.users(id)` (not a differently named surrogate).
- Columns: `display_name`, `locale`, `timezone`, `created_at`, `updated_at`.
- Defaults for new rows: `locale = 'en-CA'`, `timezone = 'America/Edmonton'` (Canadian-first; household timezone remains separate in Sprint 3+).
- **Create strategy:** `AFTER INSERT ON auth.users` trigger (`security definer`, fixed `search_path`, least grants) inserts one profile; application code may idempotently ensure a row (`ON CONFLICT DO NOTHING`) as a safety net. Profile created exactly once per auth user.
- **RLS:** own-user only — `SELECT` / `INSERT` / `UPDATE` where `auth.uid() = user_id`. No `anon` access. No “public profiles viewable by everyone” policy. No normal authenticated `DELETE` (deletion follows Sprint 12 workflow).
- Do not authorize from `user_metadata` / `raw_user_meta_data` in RLS (user-editable).

## 6. Membership model

An active membership is `(household_id, user_id, role, status)`. A user may belong to multiple households. The UI may store a last-selected household preference, but each request validates active membership anew.

### Roles

- **Owner:** all Editor capabilities plus membership/invitations, protected household settings, billing, household export/deletion, and close correction/finalization by default.
- **Editor:** create and maintain financial data, reconcile, participate in meetings and manage action items. Cannot change ownership, billing, whole-household deletion or privileged close correction.

### Permission matrix

| Capability | Owner | Editor |
|---|:---:|:---:|
| Read household financial data | ✓ | ✓ |
| Create/edit open-period financial data | ✓ | ✓ |
| Reconcile accounts | ✓ | ✓ |
| Participate in meeting | ✓ | ✓ |
| Finalize/close month | ✓ | Configurable later; default no |
| Approve close exception | ✓ | No |
| Correct/re-close month | ✓ | No |
| Invite/remove members | ✓ | No |
| Change roles/household protected settings | ✓ | No |
| Billing/portal | ✓ | No |
| Household export | ✓ | No |
| Household deletion | ✓ | No |
| Manage own notification preferences | ✓ | ✓ |

Do not scatter role strings through components. Centralize permission predicates and still enforce each operation server-side and through database policies/functions.

## 7. Invitation flow

1. Owner submits email and role.
2. Server normalizes email, authorizes owner, rate-limits and checks existing membership/active invitation.
3. Generate a cryptographically random token; store only a strong hash and expiry.
4. Email a link containing the raw token; do not include financial data.
5. Invitee authenticates.
6. Server hashes token, locks invitation row, verifies active/not expired/not used and applies recipient matching policy.
7. In one transaction, create membership, mark invitation accepted and emit audit events.
8. Repeated acceptance returns the already-completed safe outcome or a generic invalid state, never a second membership.

## 8. Server-side authorization pattern

```ts
export async function requireHouseholdRole(
  db: SupabaseClient,
  input: { userId: string; householdId: string; roles: readonly HouseholdRole[] }
): Promise<HouseholdMembership> {
  const { data, error } = await db
    .from('household_members')
    .select('household_id,user_id,role,status')
    .eq('household_id', input.householdId)
    .eq('user_id', input.userId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) throw mapDatabaseError(error);
  if (!data || !input.roles.includes(data.role)) throw new ForbiddenError();
  return data;
}
```

This check improves clear application errors and protects operations that may use privileged functions. It does not replace RLS.

## 9. Why browser household IDs are untrusted

A user can modify URLs, form fields, JSON payloads, local storage and JavaScript. A hidden input called `household_id` is not proof. Attackers deliberately replace IDs with another tenant’s UUID (IDOR). Therefore:

- derive the user from verified server auth;
- look up active membership;
- constrain every query/mutation by authorized context;
- enforce RLS from `auth.uid()` membership;
- ensure child rows’ household matches parent rows;
- return generic not-found/forbidden behaviour without data clues.

## 10. RLS helper pattern

Keep helper functions small, stable and performance-aware. A representative function:

```sql
create function public.is_active_household_member(target_household_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.household_members hm
    where hm.household_id = target_household_id
      and hm.user_id = (select auth.uid())
      and hm.status = 'active'
  );
$$;

revoke all on function public.is_active_household_member(uuid) from public;
grant execute on function public.is_active_household_member(uuid) to authenticated;
```

Security-definer functions require careful owner, `search_path`, grants and review. If direct policy subqueries are sufficiently clear and performant, prefer them.

### Read policy

```sql
create policy select_accounts_for_active_members
on public.accounts
for select
to authenticated
using (public.is_active_household_member(household_id));
```

### Write policy

```sql
create policy insert_accounts_for_editors
on public.accounts
for insert
to authenticated
with check (
  exists (
    select 1 from public.household_members hm
    where hm.household_id = accounts.household_id
      and hm.user_id = (select auth.uid())
      and hm.status = 'active'
      and hm.role in ('owner','editor')
  )
);
```

Update policies need both `using` (which existing rows may be targeted) and `with check` (what resulting rows are valid). Prevent changing `household_id` through permissions and constraints.

## 11. Snapshot and audit policies

- Members may select snapshots for their household.
- No normal authenticated policy permits snapshot update/delete.
- Snapshot insertion occurs through a reviewed database function or trusted server orchestration with strict membership/role checks.
- Audit events are insert-only through an allowlisted function; normal users cannot alter them.
- If a service role is used for report jobs, the job first verifies the report/snapshot relationship and records job identity.

## 12. Storage policies

A path prefix is useful but insufficient. Storage object metadata/path must map to a household and the policy must confirm active membership. For generated URLs, authorize at the moment of creation. Use short expiry and do not log signed URLs.

## 13. RLS test strategy

For every household table, create at least:

1. owner A can read/write permitted A rows;
2. editor A can perform editor actions but not owner actions;
3. member B cannot read, insert, update or delete A rows even when using known UUIDs;
4. unauthenticated user cannot access rows;
5. removed member immediately loses access;
6. attempted ownership-column change fails;
7. child row pointing to another household parent fails;
8. snapshot mutation fails;
9. service-role-only job path has an independent authorization test;
10. query plans remain reasonable for membership policy joins.

Run tests against a real PostgreSQL/Supabase test environment, not mocks alone.

## 14. Service-role restrictions

- Server-only secret environment variable; never `PUBLIC_`.
- Never returned from load/action data or included in source maps.
- Not available to preview environments unless required and isolated.
- Used in the smallest module/function with an explicit reason.
- All inputs to privileged jobs are re-authorized from trusted database state.
- Rotate immediately after suspected exposure; review logs/build artefacts.
- Cursor must never be given production values.

## 15. Cross-household attack-prevention checklist

- [ ] Direct household ownership column or enforced path exists.
- [ ] RLS enabled and forced where appropriate.
- [ ] `select`, `insert`, `update`, `delete` policies reviewed separately.
- [ ] Server action verifies user and role.
- [ ] Parent/child household consistency constraint exists.
- [ ] Resource lookup does not leak existence.
- [ ] Bulk operations and exports are household-scoped.
- [ ] Storage objects are private and authorized.
- [ ] Tests use known IDs from another household.
- [ ] Service role is absent from normal request path.
