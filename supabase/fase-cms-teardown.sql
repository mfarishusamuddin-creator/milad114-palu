-- ============================================================================
-- Teardown CMS — penghapusan total fitur CMS / konten publik
-- Tanggal        : 2026-09-06
-- Backup (WAJIB) : C:\devel\husam\supabase\backups\cms-teardown-backup-2026-09-06.json
--                  (berisi baris content_pages, content_sections, media,
--                   settings key home_page & social_links, + metadata pages)
--
-- Tujuan: CMS dan seluruh konten publik dihapus total. Project lama kini hanya
-- terdiri dari (1) pengalih publik minimal ("Under Maintenance") dan (2) cockpit
-- privat berisi 14 tools HTML milik pengguna (scope='admin').
--
-- CATATAN KERAS:
--   * Tabel `pages` TIDAK di-drop — masih dipakai bersama oleh 14 tools privat
--     (baris scope='admin') milik pengguna. Hanya BARIS scope='public' yang
--     boleh di-delete. Struktur tabel tetap utuh.
--   * Tabel `records` TIDAK disentuh sama sekali.
--   * Fungsi `has_permission` TIDAK disentuh (tidak di-redefine, tidak
--     di-DROP CASCADE) — fungsi ini menopang RLS banyak tabel.
--   * TANPA CASCADE di statement mana pun.
--
-- Jalankan via: supabase db query --linked -f supabase/fase-cms-teardown.sql
-- ============================================================================

-- 1) Drop content_sections DULUAN karena punya FK page_id → content_pages(id).
--    Bila content_pages di-drop lebih dulu, drop akan gagal oleh dependensi FK.
drop table if exists public.content_sections;

-- 2) Drop content_pages setelah seluruh baris section (anak FK) hilang bersama
--    tabel di atas. Halaman konten buatan pengguna di CMS ikut terhapus;
--    salinannya sudah aman di file backup.
drop table if exists public.content_pages;

-- 3) Drop media (pustaka aset CMS). Saat baseline berisi 0 baris, tetapi tabel
--    tetap dihapus karena seluruh fitur CMS untuk pengguna dibongkar total.
drop table if exists public.media;

-- 4) Safeguard: hapus baris halaman publik di tabel `pages`. Saat baseline
--    jumlahnya 0 baris, jadi statement ini tidak mengubah apa pun — hanya
--    penjaga agar tidak ada sisa halaman publik. Struktur tabel `pages` dan
--    14 baris tools privat (scope='admin') milik pengguna TIDAK terpengaruh.
delete from public.pages where scope = 'public';

-- 5) Hapus pengaturan khusus CMS/landing publik: home_page (teks pengalih) dan
--    social_links (tautan sosial halaman publik). Lima key lain (nav_layout,
--    site_meta, submarine, swarm_cursor, theme) tetap dipertahankan karena
--    masih dipakai cockpit privat pengguna.
delete from public.settings where key in ('home_page', 'social_links');
