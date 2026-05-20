-- Run this once in your Supabase SQL editor.

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  original_url text not null,
  short_code text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists links_short_code_idx on public.links (short_code);

-- Allow the anon role to read and insert (simple public shortener).
alter table public.links enable row level security;

create policy "links_select_all"
  on public.links for select
  using (true);

create policy "links_insert_all"
  on public.links for insert
  with check (true);
