-- ============================================================================
-- Integrasi data tools — tabel `tool_data`
-- Menyimpan data localStorage tiap tool HTML ke cloud (Supabase).
-- Key-value per tool; akses HANYA Super Admin (RLS has_permission).
-- Jalankan di Supabase → SQL Editor. Idempotent.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TABEL
-- ----------------------------------------------------------------------------
create table if not exists public.tool_data (
  tool_slug  text        not null,
  key        text        not null,
  value      jsonb       not null,
  updated_at timestamptz not null default now(),
  primary key (tool_slug, key)
);

alter table public.tool_data enable row level security;

-- ----------------------------------------------------------------------------
-- 1b. GRANT — tabel dibuat via SQL mentah tidak otomatis diberi privilege.
--     RLS tetap gerbang utama; GRANT hanya syarat agar RLS bisa dinilai.
--     (anon sengaja TIDAK diberi akses: data tool bersifat privat superadmin.)
-- ----------------------------------------------------------------------------
grant select, insert, update, delete on public.tool_data to authenticated;
grant select, insert, update, delete on public.tool_data to service_role;

-- ----------------------------------------------------------------------------
-- 2. POLICY — hanya Super Admin (via has_permission, sama seperti tabel pages)
--    - read  : has_permission(user,'user','read')
--    - write : has_permission(user,'user','update')
-- ----------------------------------------------------------------------------
drop policy if exists "tool_data_select" on public.tool_data;
create policy "tool_data_select" on public.tool_data
  for select to authenticated
  using (public.has_permission(auth.uid(), 'user', 'read'));

drop policy if exists "tool_data_write" on public.tool_data;
create policy "tool_data_write" on public.tool_data
  for all to authenticated
  using (public.has_permission(auth.uid(), 'user', 'update'))
  with check (public.has_permission(auth.uid(), 'user', 'update'));

-- ----------------------------------------------------------------------------
-- 3. REALTIME — aktifkan tabel tool_data pada publikasi supabase_realtime,
--    agar perubahan data tool langsung ter-broadcast ke semua device (tanpa reload).
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tool_data'
  ) then
    alter publication supabase_realtime add table public.tool_data;
  end if;
end $$;

-- ============================================================================
-- Verifikasi:
--   select tool_slug, count(*) from tool_data group by tool_slug;
-- ============================================================================
