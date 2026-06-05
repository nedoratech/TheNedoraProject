-- ─────────────────────────────────────────────────────────────────────────────
-- NedAI landing page: demo request inquiry type + source extension
-- NedAI demo requests reuse crm_project_requests (visible in microCRM inbox).
-- NedAI newsletter subscribers reuse crm_newsletter_subscribers (source='nedai_website').
-- Depends on: 20260607100000_crm_inquiry_type.sql (crm_inquiry_type enum)
--             20260604100000_landing_project_request_form.sql (source column + constraint)
-- ─────────────────────────────────────────────────────────────────────────────

-- Extend inquiry type enum to support NedAI demo requests
alter type public.crm_inquiry_type add value if not exists 'demo_request';

-- Widen source check constraint to include nedai_website
alter table public.crm_project_requests
  drop constraint if exists crm_project_requests_source_check;

alter table public.crm_project_requests
  add constraint crm_project_requests_source_check
  check (source in ('landing_contact_form', 'nedai_website', 'referral', 'other'));

comment on column public.crm_project_requests.source is
  'Submission channel. landing_contact_form: Nedora landing. nedai_website: NedAI product landing. referral: referred by partner. other: manual entry.';

-- Index for NedAI source filtering in microCRM
create index if not exists crm_project_requests_source_created_idx
  on public.crm_project_requests (source, created_at desc);

comment on column public.crm_newsletter_subscribers.source is
  'Signup origin. website_form: Nedora landing. nedai_website: NedAI product landing.';
