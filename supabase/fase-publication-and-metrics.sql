-- ============================================================================
-- Publication CMS + Metrics — Fase 4 (Publication Control & Monitoring)
-- Jalankan di Supabase → SQL Editor. Idempotent.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. pages: kolom tambahan utk CMS publik & portfolio
--    sort_order : urutan tampil di menu/navigasi publik
--    is_home    : jadikan halaman ini sebagai landing "/" (mengganti Under Maintenance)
-- ----------------------------------------------------------------------------
alter table public.pages
  add column if not exists sort_order integer not null default 0;

alter table public.pages
  add column if not exists is_home boolean not null default false;

-- ----------------------------------------------------------------------------
-- 2. RPC: ringkasan ukuran DB (perkiraan) — tanpa service key, aman utk client
--    n_live_tup (pg_stat_user_tables) & relpages (pg_class) adalah estimasi
--    dari statistik Postgres (cepat, tidak full count) — cukup utk tren, bukan
--    angka presisi.
-- ----------------------------------------------------------------------------
create or replace function public.get_table_usage()
returns table (
  table_name text,
  approx_rows bigint,
  total_bytes bigint
)
language sql
security definer
set search_path = public
as $$
  select
    s.relname as table_name,
    s.n_live_tup as approx_rows,
    (c.relpages * 8192) as total_bytes
  from pg_stat_user_tables s
  join pg_class c
    on c.relname = s.relname
   and c.relnamespace = 'public'::regnamespace
  order by (c.relpages * 8192) desc;
$$;

-- ----------------------------------------------------------------------------
-- 3. RPC: ringkasan pemakaian Storage (per bucket)
-- ----------------------------------------------------------------------------
create or replace function public.get_storage_usage()
returns table (
  bucket_name text,
  file_count bigint,
  total_bytes bigint
)
language sql
security definer
set search_path = public
as $$
  select
    o.bucket_id as bucket_name,
    count(*)::bigint as file_count,
    coalesce(sum((o.metadata->>'size')::bigint), 0) as total_bytes
  from storage.objects o
  group by o.bucket_id
  order by 3 desc;
$$;

-- ----------------------------------------------------------------------------
-- 4. GRANT execute fungsi-fungsi di atas ke role authenticated
--    (dan pages tetap perlu GRANT, lihat fase-pages-tools.sql)
-- ----------------------------------------------------------------------------
grant execute on function public.get_table_usage() to authenticated;
grant execute on function public.get_storage_usage() to authenticated;

-- ============================================================================
-- Verifikasi:
--   select * from public.get_table_usage();
--   select * from public.get_storage_usage();
--   select slug, scope, is_home, sort_order, is_published from pages order by sort_order;
-- ============================================================================
