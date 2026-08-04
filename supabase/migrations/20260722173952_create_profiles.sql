-- profiles: application identity keyed to auth.users (Sprint 2 Checkpoint 1)

create table public.profiles (
	user_id uuid primary key references auth.users (id) on delete cascade,
	display_name text,
	locale text not null default 'en-CA',
	timezone text not null default 'America/Edmonton',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	constraint profiles_display_name_length check (
		display_name is null or char_length(display_name) between 1 and 100
	)
);

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_profiles_updated_at();

-- Auto-create profile on signup (security definer + fixed search_path)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
	insert into public.profiles (user_id)
	values (new.id)
	on conflict (user_id) do nothing;
	return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy profiles_select_own
on public.profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy profiles_update_own
on public.profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- No delete policy for authenticated (deletion = later workflow)
-- No anon policies

revoke all on table public.profiles from anon;
grant select, insert, update on table public.profiles to authenticated;

revoke all on function public.handle_new_user() from public;
revoke all on function public.set_profiles_updated_at() from public;