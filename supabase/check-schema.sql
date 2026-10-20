-- ============================================================================
-- One-shot schema summary (read-only). Output = satu JSON ringkas.
-- Jalankan di Supabase → SQL Editor, tempel seluruh hasil (kolom query) ke AI.
-- ============================================================================

SELECT jsonb_build_object(
  'tables', (
    SELECT jsonb_object_agg(c.relname, jsonb_build_object(
      'rls', c.relrowsecurity,
      'cols', (
        SELECT coalesce(jsonb_object_agg(a.attname, a.attnotnull), '{}'::jsonb)
        FROM pg_attribute a
        WHERE a.attrelid = c.oid
          AND a.attnum > 0
          AND NOT a.attisdropped
      )
    ))
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND c.relname IN (
        'profiles','roles','permissions','role_permissions',
        'user_category_access','user_project_overrides','categories',
        'projects','erp_projects','learning_projects','event_projects',
        'project_tasks','resources','contacts','links','documents',
        'document_versions','resource_files'
      )
  ),
  'policies', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'table', tablename, 'name', policyname, 'cmd', cmd, 'roles', roles
    )), '[]'::jsonb)
    FROM pg_policies WHERE schemaname = 'public'
  ),
  'functions', (
    SELECT coalesce(jsonb_object_agg(p.proname, pg_get_function_result(p.oid)::text), '{}'::jsonb)
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN ('has_permission','get_accessible_category_ids')
  ),
  'roles', (
    SELECT coalesce(jsonb_object_agg(name, is_superadmin), '{}'::jsonb)
    FROM roles
  ),
  'permissions', (
    SELECT coalesce(jsonb_object_agg(module || '.' || action, true), '{}'::jsonb)
    FROM permissions
  )
) AS schema_summary;
