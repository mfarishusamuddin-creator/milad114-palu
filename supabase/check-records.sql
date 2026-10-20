-- ============================================================================
-- Verifikasi tabel `records` + realtime (read-only). Output = satu JSON ringkas.
-- Jalankan via:  supabase db execute --linked -f supabase/check-records.sql
-- atau di Supabase Dashboard -> SQL Editor, lalu tempel hasilnya.
-- ============================================================================

SELECT jsonb_build_object(
  'table_exists', to_jsonb(to_regclass('public.records') is not null),
  'columns', (
    SELECT coalesce(jsonb_object_agg(a.attname, format_type(a.atttypid, a.atttypmod)), '{}'::jsonb)
    FROM pg_attribute a
    WHERE a.attrelid = 'public.records'::regclass
      AND a.attnum > 0 AND NOT a.attisdropped
  ),
  'rls_enabled', (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.records'::regclass),
  'replica_identity', (SELECT relreplident FROM pg_class WHERE oid = 'public.records'::regclass),
  'in_realtime_publication', to_jsonb(exists(
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'records'
  )),
  'policies', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'name', policyname, 'cmd', cmd, 'roles', roles,
      'using', coalesce(qual, ''), 'check', coalesce(with_check, '')
    )), '[]'::jsonb)
    FROM pg_policies WHERE schemaname = 'public' AND tablename = 'records'
  ),
  'grants', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'grantee', grantee, 'privilege', privilege_type
    )), '[]'::jsonb)
    FROM information_schema.role_table_grants
    WHERE table_schema = 'public' AND table_name = 'records'
  ),
  'has_permission_fn', to_jsonb(exists(
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'has_permission'
  )),
  'soft_deleted_rows', (SELECT count(*) FROM public.records WHERE deleted),
  'rows_per_tool', (
    SELECT coalesce(jsonb_object_agg(tool_slug, n), '{}'::jsonb)
    FROM (SELECT tool_slug, count(*) AS n FROM public.records GROUP BY tool_slug) t
  )
) AS records_check;
