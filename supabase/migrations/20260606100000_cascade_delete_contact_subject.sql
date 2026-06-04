-- ─────────────────────────────────────────────────────────────────────────────
-- Cascade delete CRM + encryption data when an auth subject (contact) is removed.
-- Deleting auth.users already cascades: profiles, nedora_encryption_store.
-- Staff assignment fields (assigned_to, created_by) stay ON DELETE SET NULL.
-- ─────────────────────────────────────────────────────────────────────────────

-- crm_contacts.subject_id → auth.users
alter table public.crm_contacts
  drop constraint if exists crm_contacts_subject_id_fkey;

alter table public.crm_contacts
  add constraint crm_contacts_subject_id_fkey
  foreign key (subject_id) references auth.users(id) on delete cascade;

-- crm_newsletter_subscribers.subject_id → auth.users
alter table public.crm_newsletter_subscribers
  drop constraint if exists crm_newsletter_subscribers_subject_id_fkey;

alter table public.crm_newsletter_subscribers
  add constraint crm_newsletter_subscribers_subject_id_fkey
  foreign key (subject_id) references auth.users(id) on delete cascade;

-- crm_project_requests.subject_id → auth.users
alter table public.crm_project_requests
  drop constraint if exists crm_project_requests_subject_id_fkey;

alter table public.crm_project_requests
  add constraint crm_project_requests_subject_id_fkey
  foreign key (subject_id) references auth.users(id) on delete cascade;

-- crm_project_requests.contact_id → crm_contacts (remove orphaned submissions)
alter table public.crm_project_requests
  drop constraint if exists crm_project_requests_contact_id_fkey;

alter table public.crm_project_requests
  add constraint crm_project_requests_contact_id_fkey
  foreign key (contact_id) references public.crm_contacts(id) on delete cascade;

comment on column public.crm_contacts.subject_id is
  'Auth subject for encryption; ON DELETE CASCADE removes contact and dependent CRM rows when the user is deleted.';
