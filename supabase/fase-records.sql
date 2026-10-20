-- ============================================================================
-- Shared Core — penyimpanan per-record untuk semua tool (menggantikan blob).
-- Tiap record = satu baris, sehingga operasi add/delete/update antar device
-- independen (tidak saling menimpa) — dasar sinkron live seperti Google Docs.
-- Jalankan di Supabase → SQL Editor. Idempotent.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TABEL
-- ----------------------------------------------------------------------------
create table if not exists public.records (
  id          uuid primary key default gen_random_uuid(),
  tool_slug   text not null,
  collection  text not null,
  record_id   text not null,
  data        jsonb not null,
  deleted     boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (tool_slug, collection, record_id)
);

create index if not exists records_lookup_idx
  on public.records (tool_slug, collection);

alter table public.records enable row level security;

-- REPLICA IDENTITY FULL: agar event DELETE Realtime membawa SELURUH baris lama
-- (tool_slug, collection, record_id), bukan hanya primary key. Tanpa ini,
-- sinkronisasi hapus antar device tidak berjalan.
alter table public.records replica identity full;

-- ----------------------------------------------------------------------------
-- 1b. GRANT
-- ----------------------------------------------------------------------------
grant select, insert, update, delete on public.records to authenticated;
grant select, insert, update, delete on public.records to service_role;

-- ----------------------------------------------------------------------------
-- 2. POLICY — hanya Super Admin
-- ----------------------------------------------------------------------------
drop policy if exists "records_select" on public.records;
create policy "records_select" on public.records
  for select to authenticated
  using (public.has_permission(auth.uid(), 'user', 'read'));

drop policy if exists "records_write" on public.records;
create policy "records_write" on public.records
  for all to authenticated
  using (public.has_permission(auth.uid(), 'user', 'update'))
  with check (public.has_permission(auth.uid(), 'user', 'update'));

-- ----------------------------------------------------------------------------
-- 3. REALTIME
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'records'
  ) then
    alter publication supabase_realtime add table public.records;
  end if;
end $$;

-- ============================================================================
-- Verifikasi:
--   select tool_slug, collection, count(*) from records group by tool_slug, collection;
-- ============================================================================
