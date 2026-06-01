-- ─────────────────────────────────────────────────────────────────────────────
-- 005: API auth helpers
-- Utility functions used by Route Handlers to verify the caller is
-- authenticated and has the required role.
-- ─────────────────────────────────────────────────────────────────────────────

-- Returns the role of the currently authenticated user, or null if anon.
create or replace function public.current_user_role()
returns text
language sql stable security definer
as $$
  select role
  from public.profiles
  where id = auth.uid()
  limit 1;
$$;

-- Returns true if the current user has at least 'editor' privileges.
create or replace function public.is_editor()
returns boolean
language sql stable security definer
as $$
  select coalesce(
    (select true from public.profiles
     where id = auth.uid()
     and role in ('admin', 'editor')
     limit 1),
    false
  );
$$;

-- Returns true if the current user is an admin.
create or replace function public.is_admin()
returns boolean
language sql stable security definer
as $$
  select coalesce(
    (select true from public.profiles
     where id = auth.uid()
     and role = 'admin'
     limit 1),
    false
  );
$$;

-- Grant execute to authenticated role so these work in RLS policies
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.is_editor()         to authenticated;
grant execute on function public.is_admin()          to authenticated;
