-- ─────────────────────────────────────────────────────────────────────────────
-- Distinguish general contact messages from project quote requests.
-- ─────────────────────────────────────────────────────────────────────────────

create type public.crm_inquiry_type as enum ('contact', 'project_request');

alter table public.crm_project_requests
  add column inquiry_type public.crm_inquiry_type not null default 'project_request';

create index crm_project_requests_inquiry_type_created_idx
  on public.crm_project_requests (inquiry_type, created_at desc);

comment on column public.crm_project_requests.inquiry_type is
  'Landing form intent: general contact message vs project quote request.';

-- Include inquiry_type in interaction metadata for CRM inbox filtering.
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
      case
        when new.inquiry_type = 'contact' then 'New contact message received'
        else 'New project request received'
      end,
      null,
      jsonb_build_object(
        'request_id', new.id,
        'inquiry_type', new.inquiry_type,
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
