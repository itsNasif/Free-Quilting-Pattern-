-- ─────────────────────────────────────────────────────────────────────
-- QuiltHaven · Supabase schema
--
-- Run this in the Supabase SQL editor.
-- ─────────────────────────────────────────────────────────────────────

-- 1. Patterns table ---------------------------------------------------
create table if not exists public.patterns (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  description     text not null default '',
  category        text not null default 'Lap Quilt',
  difficulty      text not null default 'Beginner',
  finished_size   text not null default '',
  pieces          text not null default '',
  fabric          text not null default '',
  file_url        text,                 -- storage path inside pattern-files
  image_url       text,                 -- Cloudinary / preview image
  download_count  integer not null default 0,
  featured        boolean not null default false,
  created_at      timestamptz not null default now()
);

-- Row Level Security for Patterns
alter table public.patterns enable row level security;

create policy "patterns are publicly readable"
  on public.patterns for select
  using (true);

-- Download counter (used by /api actions) --------------------------------
create or replace function public.increment_download(pattern_id uuid)
returns integer
language sql
security definer
set search_path = public
as $$
  update public.patterns
     set download_count = download_count + 1
   where id = pattern_id
  returning download_count;
$$;

-- 2. Profiles table (User Role & Profile Info) -------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null,
  display_name    text not null default '',
  avatar_url      text,
  role            text not null default 'user',   -- 'user' (normal quilter) or 'admin'
  bio             text default '',
  favorite_craft  text default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Row Level Security for Profiles
alter table public.profiles enable row level security;

create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- 3. Automatic New User Profile Trigger --------------------------------
-- When anyone registers/joins, they automatically receive role = 'user'
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    'user'
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(nullif(public.profiles.display_name, ''), excluded.display_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- 4. Role Protection Trigger -------------------------------------------
-- Prevents non-service_role updates from modifying the user's role column
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.role is distinct from old.role then
    if current_user <> 'service_role' and coalesce((select auth.jwt()->>'role'), '') <> 'service_role' then
      new.role := old.role;
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists tr_protect_profile_role on public.profiles;
create trigger tr_protect_profile_role
before update on public.profiles
for each row
execute function public.protect_profile_role();

-- 5. Storage buckets ---------------------------------------------------
insert into storage.buckets (id, name, public)
values ('pattern-files', 'pattern-files', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;
