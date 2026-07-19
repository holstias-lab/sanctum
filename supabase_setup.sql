-- ============================================================
-- Sanctum — accounts & cloud sync setup
-- Run this once in your Supabase project's SQL editor:
-- https://supabase.com/dashboard/project/ruwuvwqsrenluygvigox/sql/new
--
-- This creates a NEW table + storage bucket only. It does not
-- touch or read the old sanctum_state / sanctum_words / etc.
-- tables from the previous app.
-- ============================================================

-- One row per user, the whole app state as a single JSON blob.
-- Mirrors exactly what used to live in localStorage.
create table if not exists public.sanctum_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.sanctum_data enable row level security;

drop policy if exists "sanctum_data select own" on public.sanctum_data;
create policy "sanctum_data select own" on public.sanctum_data
  for select using (auth.uid() = user_id);

drop policy if exists "sanctum_data insert own" on public.sanctum_data;
create policy "sanctum_data insert own" on public.sanctum_data
  for insert with check (auth.uid() = user_id);

drop policy if exists "sanctum_data update own" on public.sanctum_data;
create policy "sanctum_data update own" on public.sanctum_data
  for update using (auth.uid() = user_id);

-- Private bucket for per-language uploaded documents (PDFs, docx, etc).
-- Files are stored at path: {user_id}/{language}/{filename}
insert into storage.buckets (id, name, public)
  values ('sanctum-documents', 'sanctum-documents', false)
  on conflict (id) do nothing;

drop policy if exists "sanctum_documents select own" on storage.objects;
create policy "sanctum_documents select own" on storage.objects
  for select using (
    bucket_id = 'sanctum-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "sanctum_documents insert own" on storage.objects;
create policy "sanctum_documents insert own" on storage.objects
  for insert with check (
    bucket_id = 'sanctum-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "sanctum_documents delete own" on storage.objects;
create policy "sanctum_documents delete own" on storage.objects
  for delete using (
    bucket_id = 'sanctum-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Optional but recommended: in Supabase Auth settings, you may want to
-- disable "Confirm email" during testing so sign-up logs straight in,
-- then re-enable it later for production use.
