-- ─────────────────────────────────────────────────────────────────────────────
-- Per-subject encryption store (auth user id → data encryption key)
-- Form submitters become auth.users + profiles (role contact); PII uses their DEK.
-- ─────────────────────────────────────────────────────────────────────────────

-- Contact role for landing / CRM subjects (staff remain admin/editor/viewer)
alter table public.profiles drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'editor', 'viewer', 'contact'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.raw_user_meta_data ->> 'role', 'admin')
  );
  return new;
end;
$$;

-- DEK stored base64; readable only via service role (no RLS policies)
create table public.nedora_encryption_store (
  subject_id uuid primary key references auth.users(id) on delete cascade,
  dek_b64    text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.nedora_encryption_store is
  'Per-subject AES-256 data encryption keys. Server-only access via service role.';
comment on column public.nedora_encryption_store.dek_b64 is
  '32-byte DEK, base64-encoded. Used by @nedora/db/encryption helpers.';

alter table public.nedora_encryption_store enable row level security;

create trigger nedora_encryption_store_updated_at
  before update on public.nedora_encryption_store
  for each row execute function public.set_updated_at();

-- Link CRM rows to auth subjects
alter table public.crm_contacts
  add column subject_id uuid unique references auth.users(id) on delete set null;

alter table public.crm_project_requests
  add column subject_id uuid references auth.users(id) on delete set null;

alter table public.crm_newsletter_subscribers
  add column subject_id uuid unique references auth.users(id) on delete set null;

create index crm_contacts_subject_id_idx on public.crm_contacts (subject_id);
create index crm_project_requests_subject_id_idx on public.crm_project_requests (subject_id);
