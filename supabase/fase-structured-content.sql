-- ============================================================================
-- Structured CMS — content_pages + content_sections
-- "Simple schema, maximum flexibility": halaman disusun dari deretan "section",
-- tiap section punya `type` (komponen) + `data` (jsonb) berisi teks & gaya.
-- Dipakai untuk halaman PUBLIK (landing, about, services, portfolio, contact).
-- Tool HTML interaktif TETAP memakai tabel `pages` + iframe (tidak terpengaruh).
-- Jalankan di Supabase → SQL Editor. Idempotent.
-- ============================================================================

create table if not exists public.content_pages (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  status      text not null default 'draft' check (status in ('draft','published')),
  is_home     boolean not null default false,
  sort_order  integer not null default 0,
  seo         jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.content_sections (
  id        uuid primary key default gen_random_uuid(),
  page_id   uuid not null references public.content_pages(id) on delete cascade,
  type      text not null,
  ordering  integer not null default 0,
  data      jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists content_sections_page_idx on public.content_sections (page_id, ordering);

alter table public.content_pages enable row level security;
alter table public.content_sections enable row level security;

-- ----------------------------------------------------------------------------
-- GRANT (tabel via SQL mentah tidak otomatis diberi privilege oleh Supabase)
-- ----------------------------------------------------------------------------
grant select on public.content_pages to anon, authenticated;
grant select on public.content_sections to anon, authenticated;
grant select, insert, update, delete on public.content_pages to authenticated;
grant select, insert, update, delete on public.content_sections to authenticated;

-- ----------------------------------------------------------------------------
-- RLS — pakai has_permission eksisting (bukan fungsi is_superadmin duplikat)
-- ----------------------------------------------------------------------------
-- Baca halaman: published bisa dibaca anon; Super Admin baca semua.
drop policy if exists "content_pages_select" on public.content_pages;
create policy "content_pages_select" on public.content_pages
  for select to anon, authenticated
  using (status = 'published' or public.has_permission(auth.uid(), 'user', 'read'));

drop policy if exists "content_pages_write" on public.content_pages;
create policy "content_pages_write" on public.content_pages
  for all to authenticated
  using (public.has_permission(auth.uid(), 'user', 'update'))
  with check (public.has_permission(auth.uid(), 'user', 'update'));

-- Baca section: ikut visibilitas halaman induk.
drop policy if exists "content_sections_select" on public.content_sections;
create policy "content_sections_select" on public.content_sections
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.content_pages p
      where p.id = page_id
        and (p.status = 'published' or public.has_permission(auth.uid(), 'user', 'read'))
    )
  );

drop policy if exists "content_sections_write" on public.content_sections;
create policy "content_sections_write" on public.content_sections
  for all to authenticated
  using (public.has_permission(auth.uid(), 'user', 'update'))
  with check (public.has_permission(auth.uid(), 'user', 'update'));

-- ============================================================================
-- Verifikasi:
--   select * from public.content_pages;
--   select * from public.content_sections order by page_id, ordering;
-- ============================================================================
