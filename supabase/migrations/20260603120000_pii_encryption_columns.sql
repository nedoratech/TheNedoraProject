-- ─────────────────────────────────────────────────────────────────────────────
-- 006: PII at rest — application-layer AES-256-GCM (see @nedora/crypto)
-- Plaintext columns become *_ciphertext; email_hash enables lookup/upsert.
-- ─────────────────────────────────────────────────────────────────────────────

-- crm_contacts ----------------------------------------------------------------
alter table public.crm_contacts drop constraint if exists crm_contacts_email_key;

alter table public.crm_contacts rename column email to email_ciphertext;
alter table public.crm_contacts rename column first_name to first_name_ciphertext;
alter table public.crm_contacts rename column last_name to last_name_ciphertext;
alter table public.crm_contacts rename column phone to phone_ciphertext;
alter table public.crm_contacts rename column company to company_ciphertext;
alter table public.crm_contacts rename column notes to notes_ciphertext;

alter table public.crm_contacts
  add column email_hash text,
  add column address_line1_ciphertext text,
  add column address_line2_ciphertext text,
  add column city_ciphertext text,
  add column postal_code_ciphertext text,
  add column country_ciphertext text;

create unique index crm_contacts_email_hash_key on public.crm_contacts (email_hash);

comment on column public.crm_contacts.email_ciphertext is 'AES-256-GCM ciphertext (@nedora/crypto)';
comment on column public.crm_contacts.email_hash is 'HMAC-SHA256 of normalized email for unique lookup';

-- crm_project_requests --------------------------------------------------------
drop index if exists crm_project_requests_email_idx;

alter table public.crm_project_requests rename column first_name to first_name_ciphertext;
alter table public.crm_project_requests rename column last_name to last_name_ciphertext;
alter table public.crm_project_requests rename column email to email_ciphertext;
alter table public.crm_project_requests rename column company to company_ciphertext;
alter table public.crm_project_requests rename column message to message_ciphertext;

alter table public.crm_project_requests
  add column email_hash text,
  add column address_line1_ciphertext text,
  add column address_line2_ciphertext text,
  add column city_ciphertext text,
  add column postal_code_ciphertext text,
  add column country_ciphertext text;

create index crm_project_requests_email_hash_idx on public.crm_project_requests (email_hash);

-- crm_newsletter_subscribers --------------------------------------------------
alter table public.crm_newsletter_subscribers drop constraint if exists crm_newsletter_subscribers_email_key;

alter table public.crm_newsletter_subscribers rename column email to email_ciphertext;
alter table public.crm_newsletter_subscribers rename column first_name to first_name_ciphertext;

alter table public.crm_newsletter_subscribers
  add column email_hash text,
  add column last_name_ciphertext text;

create unique index crm_newsletter_subscribers_email_hash_key
  on public.crm_newsletter_subscribers (email_hash);

drop index if exists crm_newsletter_subscribers_email_idx;

-- Trigger: do not log decrypted names in interaction titles -------------------
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
      'New project request received',
      null,
      jsonb_build_object(
        'project_type', new.project_type,
        'engagement_model', new.engagement_model,
        'timeline', new.timeline,
        'locale', new.locale,
        'request_id', new.id
      )
    );
  end if;
  return new;
end;
$$;
