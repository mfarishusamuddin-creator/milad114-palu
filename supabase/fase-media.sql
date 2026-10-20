-- ============================================================================
-- Media library (URL eksternal) — katalog referensi media (gambar/video/ikon)
-- yang bisa dipakai di visual editor. TIDAK menyimpan biner — hanya URL eksternal
-- agar hemat storage tier gratis. Jalankan di SQL Editor. Idempotent.
-- ============================================================================

create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  url         text not null,
  media_type  text not null default 'image' check (media_type in ('image','video','icon','file')),
  created_at  timestamptz not null default now()
);

alter table public.media enable row level security;

grant select on public.media to authenticated;
grant select, insert, update, delete on public.media to authenticated;

-- Baca: halaman publik memuat URL langsung (bukan via tabel), jadi katalog media
-- hanya untuk admin; Super Admin baca/tulis semua.
drop policy if exists "media_select" on public.media;
create policy "media_select" on public.media
  for select to authenticated
  using (public.has_permission(auth.uid(), 'user', 'read'));

drop policy if exists "media_write" on public.media;
create policy "media_write" on public.media
  for all to authenticated
  using (public.has_permission(auth.uid(), 'user', 'update'))
  with check (public.has_permission(auth.uid(), 'user', 'update'));
