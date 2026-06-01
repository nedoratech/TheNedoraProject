-- ─────────────────────────────────────────────────────────────────────────────
-- 003: microCRM tables
-- ─────────────────────────────────────────────────────────────────────────────

-- Enums -----------------------------------------------------------------------
create type public.lead_status as enum (
  'new', 'qualified', 'proposal', 'negotiation', 'won', 'lost'
);

create type public.project_type as enum (
  'new_application', 'integration', 'support_evolution', 'not_sure'
);

create type public.engagement_model as enum (
  'fixed_scope', 'time_based', 'not_sure'
);

create type public.timeline_option as enum (
  'ready_now', '1_3_months', '3_6_months', 'exploring'
);

create type public.interaction_type as enum (
  'form_submission', 'email_sent', 'email_received',
  'call', 'meeting', 'note', 'status_change',
  'proposal_sent', 'contract_signed'
);

-- Contacts --------------------------------------------------------------------
create table public.crm_contacts (
  id         uuid primary key default uuid_generate_v4(),
  email      text unique not null,
  first_name text,
  last_name  text,
  company    text,
  role       text,
  phone      text,
  source     text,              -- 'website_form' | 'linkedin' | 'referral' | 'conference'
  tags       text[] not null default '{}',
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Leads -----------------------------------------------------------------------
create table public.crm_leads (
  id               uuid primary key default uuid_generate_v4(),
  contact_id       uuid not null references crm_contacts(id) on delete cascade,
  status           public.lead_status not null default 'new',
  priority         text check (priority in ('high', 'medium', 'low')) default 'medium',
  project_type     public.project_type,
  engagement_model public.engagement_model,
  timeline         public.timeline_option,
  estimated_value  numeric,
  currency         text not null default 'EUR',
  assigned_to      uuid references profiles(id) on delete set null,
  closed_at        timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Project requests (raw form submissions from landing page) -------------------
create table public.crm_project_requests (
  id               uuid primary key default uuid_generate_v4(),
  contact_id       uuid references crm_contacts(id) on delete set null,
  lead_id          uuid references crm_leads(id) on delete set null,
  first_name       text not null,
  last_name        text not null,
  email            text not null,
  company          text,
  project_type     public.project_type,
  engagement_model public.engagement_model,
  timeline         public.timeline_option,
  message          text,
  locale           text not null default 'en',
  ip_address       inet,
  read             boolean not null default false,
  created_at       timestamptz not null default now()
);

-- Interactions (activity log) -------------------------------------------------
create table public.crm_interactions (
  id         uuid primary key default uuid_generate_v4(),
  contact_id uuid references crm_contacts(id) on delete cascade,
  lead_id    uuid references crm_leads(id) on delete cascade,
  type       public.interaction_type not null,
  title      text not null,
  body       text,
  metadata   jsonb not null default '{}',
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Newsletter subscribers ------------------------------------------------------
create table public.crm_newsletter_subscribers (
  id               uuid primary key default uuid_generate_v4(),
  email            text unique not null,
  first_name       text,
  locale           text not null default 'en',
  status           text not null default 'active'
                     check (status in ('active', 'unsubscribed', 'bounced')),
  consent_given_at timestamptz,
  unsubscribed_at  timestamptz,
  source           text,
  tags             text[] not null default '{}',
  created_at       timestamptz not null default now()
);

-- Newsletter campaigns --------------------------------------------------------
create table public.crm_newsletter_campaigns (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  subject      text,
  status       text not null default 'draft'
                 check (status in ('draft', 'scheduled', 'sent')),
  segment      text not null default 'all',
  sent_count   integer not null default 0,
  open_count   integer not null default 0,
  click_count  integer not null default 0,
  unsub_count  integer not null default 0,
  scheduled_at timestamptz,
  sent_at      timestamptz,
  created_at   timestamptz not null default now()
);

-- ── RLS ──────────────────────────────────────────────────────────────────────

alter table public.crm_contacts              enable row level security;
alter table public.crm_leads                 enable row level security;
alter table public.crm_project_requests      enable row level security;
alter table public.crm_interactions          enable row level security;
alter table public.crm_newsletter_subscribers enable row level security;
alter table public.crm_newsletter_campaigns  enable row level security;

-- Public: landing page can INSERT requests + newsletter subs (anon key, server action)
create policy "Project requests: public insert"
  on crm_project_requests for insert with check (true);

create policy "Newsletter: public subscribe"
  on crm_newsletter_subscribers for insert with check (true);

create policy "Newsletter: self unsubscribe"
  on crm_newsletter_subscribers for update
  using (true) with check (status = 'unsubscribed');

-- Internal: only authenticated CRM users can read/write everything else
create policy "CRM contacts: auth full access"
  on crm_contacts for all using (auth.role() = 'authenticated');

create policy "CRM leads: auth full access"
  on crm_leads for all using (auth.role() = 'authenticated');

create policy "CRM requests: auth full access"
  on crm_project_requests for all using (auth.role() = 'authenticated');

create policy "CRM interactions: auth full access"
  on crm_interactions for all using (auth.role() = 'authenticated');

create policy "CRM newsletter subs: auth full access"
  on crm_newsletter_subscribers for all using (auth.role() = 'authenticated');

create policy "CRM campaigns: auth full access"
  on crm_newsletter_campaigns for all using (auth.role() = 'authenticated');
