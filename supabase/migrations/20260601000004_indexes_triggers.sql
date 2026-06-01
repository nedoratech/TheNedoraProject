-- ─────────────────────────────────────────────────────────────────────────────
-- 004: Indexes + triggers
-- ─────────────────────────────────────────────────────────────────────────────

-- Indexes ---------------------------------------------------------------------
create index on public.cms_content_blocks (page_slug, locale);
create index on public.cms_feature_flags (key);
create index on public.cms_navigation (location, locale, "order");

create index on public.crm_leads (status, created_at desc);
create index on public.crm_leads (contact_id);
create index on public.crm_project_requests (read, created_at desc);
create index on public.crm_project_requests (email);
create index on public.crm_interactions (contact_id, created_at desc);
create index on public.crm_interactions (lead_id, created_at desc);
create index on public.crm_newsletter_subscribers (status, locale);
create index on public.crm_newsletter_subscribers (email);

-- updated_at trigger ----------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cms_pages_updated_at
  before update on public.cms_pages
  for each row execute function public.set_updated_at();

create trigger cms_blocks_updated_at
  before update on public.cms_content_blocks
  for each row execute function public.set_updated_at();

create trigger cms_flags_updated_at
  before update on public.cms_feature_flags
  for each row execute function public.set_updated_at();

create trigger crm_contacts_updated_at
  before update on public.crm_contacts
  for each row execute function public.set_updated_at();

create trigger crm_leads_updated_at
  before update on public.crm_leads
  for each row execute function public.set_updated_at();

-- Auto-log lead status changes ------------------------------------------------
create or replace function public.log_lead_status_change()
returns trigger
language plpgsql security definer
as $$
begin
  if old.status is distinct from new.status then
    insert into public.crm_interactions (
      lead_id, contact_id, type, title, metadata
    ) values (
      new.id,
      new.contact_id,
      'status_change',
      'Status: ' || old.status || ' → ' || new.status,
      jsonb_build_object('from', old.status, 'to', new.status)
    );
  end if;
  return new;
end;
$$;

create trigger crm_lead_status_log
  after update on public.crm_leads
  for each row execute function public.log_lead_status_change();

-- Auto-log new project request ------------------------------------------------
create or replace function public.log_new_project_request()
returns trigger
language plpgsql security definer
as $$
begin
  if new.contact_id is not null and new.lead_id is not null then
    insert into public.crm_interactions (
      lead_id, contact_id, type, title, body, metadata
    ) values (
      new.lead_id,
      new.contact_id,
      'form_submission',
      'New project request from ' || new.first_name || ' ' || new.last_name,
      new.message,
      jsonb_build_object(
        'project_type', new.project_type,
        'engagement_model', new.engagement_model,
        'timeline', new.timeline,
        'locale', new.locale
      )
    );
  end if;
  return new;
end;
$$;

create trigger crm_request_log
  after insert on public.crm_project_requests
  for each row execute function public.log_new_project_request();
