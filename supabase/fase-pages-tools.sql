-- ============================================================================
-- Integrasi HTML Tools — tabel `pages`
-- Satu tabel menyimpan konten HTML tool (scope admin/privat & scope public).
-- Jalankan di Supabase → SQL Editor. Idempotent.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TABEL
-- ----------------------------------------------------------------------------
create table if not exists public.pages (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  html_content  text not null,
  scope         text not null default 'admin' check (scope in ('admin', 'public')),
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.pages enable row level security;

-- ----------------------------------------------------------------------------
-- 1b. GRANT privilege — tabel dibuat via SQL mentah tidak otomatis diberi
--     privilege oleh Supabase. Tanpa ini role authenticated mendapat
--     "permission denied for table pages". RLS tetap menjadi gerbang akses
--     utama; GRANT ini hanya syarat agar RLS bisa dinilai.
-- ----------------------------------------------------------------------------
grant select on public.pages to anon;
grant select, insert, update, delete on public.pages to authenticated;
grant select, insert, update, delete on public.pages to service_role;

-- ----------------------------------------------------------------------------
-- 2. POLICY (pakai has_permission yang sudah ada — bukan fungsi is_superadmin baru)
--    has_permission(user,'user','read')  -> true utk Super Admin
--    has_permission(user,'user','update') -> true utk Super Admin
-- ----------------------------------------------------------------------------
-- Baca:
--   - anon/authenticated: hanya scope='public' & is_published=true
--   - Super Admin (via has_permission user.read): semua
drop policy if exists "pages_select" on public.pages;
create policy "pages_select" on public.pages
  for select to anon, authenticated
  using (
    (scope = 'public' and is_published = true)
    or public.has_permission(auth.uid(), 'user', 'read')
  );

-- Tulis: hanya Super Admin.
drop policy if exists "pages_write" on public.pages;
create policy "pages_write" on public.pages
  for all to authenticated
  using (public.has_permission(auth.uid(), 'user', 'update'))
  with check (public.has_permission(auth.uid(), 'user', 'update'));

-- ============================================================================
-- Verifikasi:
--   select slug, scope, is_published from pages;
-- ============================================================================
