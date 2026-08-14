-- ─────────────────────────────────────────────────────────────────────
-- QuiltHaven · Supabase schema
--
-- Run this in the Supabase SQL editor, then create a public storage
-- bucket named `pattern-files` (Settings → Storage) for the PDFs.
-- ─────────────────────────────────────────────────────────────────────

-- Patterns table --------------------------------------------------------
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
  image_url       text,                 -- Cloudinary preview image
  download_count  integer not null default 0,
  featured        boolean not null default false,
  created_at      timestamptz not null default now()
);

-- Row Level Security -----------------------------------------------------
alter table public.patterns enable row level security;

-- Anyone can read the catalog (the public site).
create policy "patterns are publicly readable"
  on public.patterns for select
  using (true);

-- Writes come from the service-role key only, which bypasses RLS, so no
-- insert/update/delete policies are granted to the anon/authenticated roles.

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

-- Storage bucket ----------------------------------------------------------
-- Create the bucket (or via the dashboard):
insert into storage.buckets (id, name, public)
values ('pattern-files', 'pattern-files', false)
on conflict (id) do nothing;

-- The service-role key manages objects; anon may not read files directly.
-- Download links are short-lived signed URLs generated server-side.
