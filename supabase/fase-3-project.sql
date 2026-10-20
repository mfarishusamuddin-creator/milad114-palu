-- ============================================================================
-- FASE 3 — Modul Project Inti + fondasi Visibility Engine
-- Jalankan di Supabase → SQL Editor. Idempotent (aman dijalankan ulang).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TABEL (dibuat jika belum ada) — WAJIB sebelum fungsi, karena fungsi
--    language sql memvalidasi body (referensi tabel) saat dibuat.
-- ----------------------------------------------------------------------------
create table if not exists public.user_category_access (
  user_id    uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, category_id)
);

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category_id uuid references public.categories(id),
  type        text not null check (type in ('erp','learning','event')),
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

create table if not exists public.user_project_overrides (
  user_id    uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, project_id)
);

create table if not exists public.erp_projects (
  project_id   uuid primary key references public.projects(id) on delete cascade,
  budget_total numeric not null default 0,
  budget_used  numeric not null default 0
);

create table if not exists public.learning_projects (
  project_id        uuid primary key references public.projects(id) on delete cascade,
  target_description text,
  progress_percent  numeric not null default 0 check (progress_percent between 0 and 100),
  time_allocated    numeric not null default 0,
  time_spent        numeric not null default 0
);

create table if not exists public.event_projects (
  project_id        uuid primary key references public.projects(id) on delete cascade,
  start_time        timestamptz,
  end_time          timestamptz,
  location_address  text,
  location_lat      numeric,
  location_lng      numeric,
  agenda            text
);

create table if not exists public.project_tasks (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects(id) on delete cascade,
  title        text not null,
  status       text not null default 'todo' check (status in ('todo','in_progress','completed')),
  priority     text check (priority in ('low','medium','high')),
  due_date     date,
  assigned_to  uuid references auth.users(id),
  is_milestone boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2. FUNGSI PUSAT — dibuat SETELAH tabel ada (language sql divalidasi saat dibuat)
-- ----------------------------------------------------------------------------
-- CATATAN: has_permission SUDAH ADA & dipakai kode yang berjalan — TIDAK
-- didefinisikan ulang (CREATE OR REPLACE gagal 42P13 karena nama parameter,
-- DROP/CASCADE berisiko memutus policy RLS lama). Dipanggil posisional.
drop function if exists public.get_accessible_category_ids(uuid);
drop function if exists public.is_project_visible(uuid, uuid);

-- get_accessible_category_ids: kategori yang user punya akses + seluruh keturunan.
create or replace function public.get_accessible_category_ids(user_id uuid)
returns setof uuid
language sql
security definer
set search_path = public
as $$
  with recursive tree as (
    select id, parent_id
    from public.categories
    where id in (
      select category_id from public.user_category_access where user_id = get_accessible_category_ids.user_id
    )
    union all
    select c.id, c.parent_id
    from public.categories c
    join tree t on c.parent_id = t.id
  )
  select id from tree
$$;

-- is_project_visible: Visibility Engine (Bagian 3.3) + created_by selalu terlihat.
create or replace function public.is_project_visible(user_id uuid, project_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.projects p
    where p.id = is_project_visible.project_id
      and public.has_permission(is_project_visible.user_id, 'project', 'read')
      and (
        p.created_by = is_project_visible.user_id
        or p.category_id is null
        or p.category_id in (select public.get_accessible_category_ids(is_project_visible.user_id))
        or exists (
          select 1 from public.user_project_overrides o
          where o.project_id = p.id and o.user_id = is_project_visible.user_id
        )
      )
  )
$$;

-- ----------------------------------------------------------------------------
-- 3. RLS — aktif sejak pembuatan + policy Visibility Engine
-- ----------------------------------------------------------------------------
alter table public.user_category_access enable row level security;
alter table public.user_project_overrides enable row level security;
alter table public.projects enable row level security;
alter table public.erp_projects enable row level security;
alter table public.learning_projects enable row level security;
alter table public.event_projects enable row level security;
alter table public.project_tasks enable row level security;

-- user_category_access: kelola = yang punya izin user.update (superadmin praktis).
drop policy if exists "manage user_category_access" on public.user_category_access;
create policy "manage user_category_access" on public.user_category_access
  for all to authenticated
  using (public.has_permission(auth.uid(), 'user', 'update'))
  with check (public.has_permission(auth.uid(), 'user', 'update'));

-- user_project_overrides: kelola = yang punya izin project.update.
drop policy if exists "manage user_project_overrides" on public.user_project_overrides;
create policy "manage user_project_overrides" on public.user_project_overrides
  for all to authenticated
  using (public.has_permission(auth.uid(), 'project', 'update'))
  with check (public.has_permission(auth.uid(), 'project', 'update'));

-- profiles: Super Admin perlu baca semua akun (untuk kelola akses kategori &
-- halaman akun). Policy SELECT "read own" tetap, ini tambahan untuk superadmin.
drop policy if exists "superadmin_read_all_profiles" on public.profiles;
create policy "superadmin_read_all_profiles" on public.profiles
  for select to authenticated
  using (public.has_permission(auth.uid(), 'user', 'read'));

-- projects: SELECT via Visibility Engine; tulis via permission project.*
drop policy if exists "projects_select_visible" on public.projects;
create policy "projects_select_visible" on public.projects
  for select to authenticated
  using (public.is_project_visible(auth.uid(), id));

drop policy if exists "projects_insert" on public.projects;
create policy "projects_insert" on public.projects
  for insert to authenticated
  with check (public.has_permission(auth.uid(), 'project', 'create'));

drop policy if exists "projects_update" on public.projects;
create policy "projects_update" on public.projects
  for update to authenticated
  using (public.is_project_visible(auth.uid(), id) and public.has_permission(auth.uid(), 'project', 'update'))
  with check (public.has_permission(auth.uid(), 'project', 'update'));

drop policy if exists "projects_delete" on public.projects;
create policy "projects_delete" on public.projects
  for delete to authenticated
  using (public.is_project_visible(auth.uid(), id) and public.has_permission(auth.uid(), 'project', 'delete'));

-- Tabel detail (1:1) & tasks: SELECT mengikuti visibilitas project induk,
-- tulis via permission project.update.
do $$
declare
  t text;
begin
  foreach t in array array['erp_projects','learning_projects','event_projects','project_tasks'] loop
    execute format(
      'drop policy if exists %I on public.%I',
      'child_select_visible_' || t, t
    );
    execute format(
      'create policy %I on public.%I for select to authenticated using (public.is_project_visible(auth.uid(), project_id))',
      'child_select_visible_' || t, t
    );
    execute format(
      'drop policy if exists %I on public.%I',
      'child_write_' || t, t
    );
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.has_permission(auth.uid(), ''project'', ''update'')) with check (public.has_permission(auth.uid(), ''project'', ''update''))',
      'child_write_' || t, t
    );
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- 4. SEED PERMISSION — modul project & task (role Super Admin otomatis true)
-- ----------------------------------------------------------------------------
insert into public.permissions (module, action)
select v.module, v.action
from (values
  ('project','read'), ('project','create'), ('project','update'), ('project','delete'),
  ('task','read'), ('task','create'), ('task','update'), ('task','delete')
) as v(module, action)
where not exists (
  select 1 from public.permissions p where p.module = v.module and p.action = v.action
);

-- ============================================================================
-- Verifikasi (jalankan setelah seluruh skrip di atas sukses):
--   select name, module, action from permissions where module in ('project','task') order by module, action;
--   -- Cek body has_permission yang lama benar (harus true utk superadmin, dan
--   -- cek role_permissions utk non-superadmin):
--   select pg_get_functiondef(oid) from pg_proc where proname = 'has_permission' and pronamespace = (select oid from pg_namespace where nspname='public');
--   select public.has_permission(auth.uid(), 'project', 'read') from auth.users limit 1;
-- ============================================================================
