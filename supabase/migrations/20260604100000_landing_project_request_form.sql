-- ─────────────────────────────────────────────────────────────────────────────
-- Landing contact / project request form
-- Aligns crm_project_requests with the landing form and microCRM inbox workflow.
-- Writes from the landing app use the service role (see @nedora/db/crm).
-- ─────────────────────────────────────────────────────────────────────────────

-- Landing form uses integration_modernisation; legacy enum value was integration.
alter type public.project_type rename value 'integration' to 'integration_modernisation';

-- Inbox triage on raw submissions (separate from crm_leads.status pipeline).
create type public.crm_request_status as enum (
  'new',
  'in_review',
  'responded',
  'converted',
  'archived',
  'spam'
);

alter table public.crm_project_requests
  add column status public.crm_request_status not null default 'new',
  add column source text not null default 'landing_contact_form',
  add column updated_at timestamptz not null default now(),
  add column assigned_to uuid references public.profiles(id) on delete set null,
  add column read_at timestamptz;

alter table public.crm_project_requests
  add constraint crm_project_requests_source_check
  check (source in ('landing_contact_form', 'referral', 'other'));

comment on table public.crm_project_requests is
  'Inbound project requests from the landing contact form. Linked to crm_contacts and optionally crm_leads for CRM follow-up.';
comment on column public.crm_project_requests.status is
  'CRM inbox status for this submission (not the lead pipeline status on crm_leads).';
comment on column public.crm_project_requests.source is
  'Submission channel; landing form sets landing_contact_form.';
comment on column public.crm_project_requests.lead_id is
  'Populated when the submission is promoted to or linked with a crm_leads row.';
comment on column public.crm_project_requests.read_at is
  'When an authenticated CRM user marked the request as read.';

-- Indexes for microCRM request inbox
create index crm_project_requests_status_created_idx
  on public.crm_project_requests (status, created_at desc);

create index crm_project_requests_contact_id_idx
  on public.crm_project_requests (contact_id);

create index crm_project_requests_lead_id_idx
  on public.crm_project_requests (lead_id)
  where lead_id is not null;

create index crm_project_requests_assigned_to_idx
  on public.crm_project_requests (assigned_to)
  where assigned_to is not null;

-- updated_at maintenance
create trigger crm_project_requests_updated_at
  before update on public.crm_project_requests
  for each row execute function public.set_updated_at();

-- Tighten public insert: raw form posts must not set CRM-managed fields.
-- Service role (landing server action) bypasses RLS.
drop policy if exists "Project requests: public insert" on public.crm_project_requests;

create policy "Project requests: public insert"
  on public.crm_project_requests
  for insert
  with check (
    status = 'new'::public.crm_request_status
    and source = 'landing_contact_form'
    and contact_id is null
    and lead_id is null
    and assigned_to is null
    and read is false
    and read_at is null
  );

-- Log inbound form submissions when a contact is linked (service-role path).
create or replace function public.log_new_project_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.contact_id is not null then
    insert into public.crm_interactions (
      lead_id, contact_id, type, title, body, metadata
    ) values (
      new.lead_id,
      new.contact_id,
      'form_submission',
      'New project request received',
      null,
      jsonb_build_object(
        'request_id', new.id,
        'project_type', new.project_type,
        'engagement_model', new.engagement_model,
        'timeline', new.timeline,
        'locale', new.locale,
        'source', new.source,
        'request_status', new.status
      )
    );
  end if;
  return new;
end;
$$;
